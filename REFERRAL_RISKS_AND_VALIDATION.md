# Referral Risks & Validation — ZU Connect

> Anti-abuse logic, validation rules, error handling strategy, and edge case prevention.

---

## 1. Validation Rules (Backend)

### 1.1 Referral Code Format

```typescript
const CODE_REGEX = /^ZU-[A-Z0-9]{6}$/;

function validateCodeFormat(code: string): boolean {
  return CODE_REGEX.test(code);
}
```

Applied at:
- `POST /api/referrals/claim` — reject malformed codes immediately
- `POST /api/referrals/generate` — ensure generated code matches format
- `POST /api/referrals/regenerate` — same as generate

### 1.2 Self-Referral Prevention

```typescript
async function preventSelfReferral(
  db: DrizzleClient,
  code: string,
  refereeId: number
): Promise<void> {
  const referrer = await db
    .select()
    .from(users)
    .where(eq(users.referralCode, code))
    .limit(1);

  if (referrer.length === 0) {
    throw new AppError(404, "رمز الدعوة غير صالح");
  }

  if (referrer[0].id === refereeId) {
    throw new AppError(400, "لا يمكنك دعوة نفسك");
  }
}
```

**Edge case**: What if the referrer account was deleted? Code should be invalidated. Check user still exists and is active.

### 1.3 Duplicate Claim Prevention

```typescript
async function preventDuplicateClaim(
  db: DrizzleClient,
  refereeId: number
): Promise<void> {
  const existing = await db
    .select()
    .from(referrals)
    .where(eq(referrals.refereeId, refereeId))
    .limit(1);

  if (existing.length > 0) {
    throw new AppError(400, "تم استخدام رمز دعوة من قبل لهذا الحساب");
  }
}
```

**Edge case**: What if the same person has two accounts (different identifiers)? Not preventable without tying to real identity. Acceptable abuse surface.

### 1.4 Referral Code Existence

```typescript
async function validateCodeExists(
  db: DrizzleClient,
  code: string
): Promise<typeof users.$inferSelect> {
  const referrer = await db
    .select()
    .from(users)
    .where(eq(users.referralCode, code))
    .limit(1);

  if (referrer.length === 0) {
    throw new AppError(404, "رمز الدعوة غير موجود");
  }

  return referrer[0];
}
```

---

## 2. Anti-Abuse Measures

### 2.1 Rate Limiting (Server-Side)

```typescript
// Simple in-memory rate limiter for referral claims
const claimRateMap = new Map<string, { count: number; resetAt: number }>();

function checkClaimRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = claimRateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    claimRateMap.set(ip, { count: 1, resetAt: now + 3600000 }); // 1 hour
    return true;
  }

  if (entry.count >= 3) {
    return false; // Max 3 claims per hour per IP
  }

  entry.count++;
  return true;
}
```

**Considerations**:
- Use the `x-forwarded-for` header if behind a proxy
- For production, replace with a DB-backed or Redis-based rate limiter
- Apply only to `POST /api/referrals/claim`, not to GET/stats

### 2.2 Referral Code Uniqueness

```typescript
// When generating a code, handle collision:
async function generateUniqueCode(db: DrizzleClient): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateReferralCode(); // "ZU-XXXXXX"
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.referralCode, code))
      .limit(1);

    if (existing.length === 0) {
      return code; // Unique
    }
  }

  throw new AppError(500, "تعذر إنشاء رمز دعوة فريد، حاول مرة أخرى");
}
```

36^6 ≈ 2.17 billion combinations. Collision is extremely unlikely but handled defensively.

### 2.3 Code Regeneration Invalidation

When a user regenerates their code:
1. The old code is immediately invalidated
2. Any pending referrals using the old code remain in "pending" status
3. The referrer can still be rewarded if those referrals complete
4. New referrals must use the new code

**State transition**:
```
Old Code: ZU-OLD123 → invalidated (but existing pending referrals preserved)
New Code: ZU-NEW456 → active
```

**Implementation**: Update `users.referralCode` to new value. The claim endpoint checks `users.referralCode` (always the current code).

### 2.4 Expired Referral Links

**Approach**: Time-based expiration. A referral code is valid for 90 days after generation. When claiming:

```typescript
async function validateCodeNotExpired(
  user: typeof users.$inferSelect
): Promise<void> {
  const createdAt = user.createdAt; // or use a referral_code_generated_at field
  const daysSinceCreation = (Date.now() - createdAt.getTime()) / 86400000;

  if (daysSinceCreation > 90) {
    throw new AppError(410, "انتهت صلاحية رمز الدعوة");
  }
}
```

**Alternative**: Add a `referralCodeGeneratedAt` timestamp column to `users` table for more precise expiration tracking.

---

## 3. Error Response Strategy

### 3.1 Standard Error Format

All referral endpoints return the same error shape:

```typescript
interface ApiError {
  error: string;        // Arabic user-facing message
  code: string;         // Machine-readable error code
  details?: unknown;    // Optional debug info (hidden in production)
}
```

### 3.2 Error Codes

| HTTP | Code | Message (Arabic) | When |
|------|------|-------------------|------|
| 400 | `SELF_REFERRAL` | لا يمكنك دعوة نفسك | Self-referral attempt |
| 400 | `DUPLICATE_CLAIM` | تم استخدام رمز دعوة من قبل | Duplicate code usage |
| 400 | `INVALID_CODE_FORMAT` | رمز الدعوة غير صالح | Malformed code |
| 404 | `CODE_NOT_FOUND` | رمز الدعوة غير موجود | Code doesn't exist |
| 404 | `REFERRER_NOT_FOUND` | حساب المُرسِل غير موجود | Referrer deleted |
| 410 | `CODE_EXPIRED` | انتهت صلاحية رمز الدعوة | Code > 90 days old |
| 429 | `RATE_LIMITED` | طلبات كثيرة جداً، حاول لاحقاً | Rate limit hit |
| 500 | `CODE_GENERATION_FAILED` | تعذر إنشاء رمز الدعوة | Collision after 5 attempts |

### 3.3 Error Handling in Frontend

```typescript
// In useReferral hook or API call:
async function handleClaim(code: string) {
  try {
    const response = await fetch("/api/referrals/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  } catch (err) {
    toast({
      title: "فشل تسجيل الدعوة",
      description: err instanceof Error ? err.message : "حدث خطأ غير متوقع",
      variant: "destructive",
    });
  }
}
```

---

## 4. Stale State & Caching Risks

### 4.1 localStorage Staleness

| Scenario | Problem | Solution |
|----------|---------|----------|
| User logs in on a different device | localStorage has no code | API returns existing code on first fetch |
| User regenerated code on another device | localStorage has old code | Always trust API over localStorage; update cache after response |
| User has never generated a code | localStorage has no key | "referral_code" key doesn't exist — treat as "no code yet" |
| Points earned on another device | localStorage stats are stale | Show cached → fetch fresh → update UI → update cache |

**Implementation rule**: localStorage is a **display optimization**, never a source of truth. Always:
1. Show cached value immediately (for instant UX)
2. Fetch from API in background
3. Update with fresh data
4. Update cache with fresh data

### 4.2 React Query Staleness

```typescript
const statsQuery = useQuery({
  queryKey: ["referral-stats"],
  queryFn: fetchReferralStats,
  staleTime: 30_000,    // 30 seconds before considered stale
  gcTime: 5 * 60_000,   // 5 minutes in cache
});
```

**Invalidation triggers**:
- After `POST /api/referrals/claim` returns success → invalidate stats for referrer
- After login → invalidate (fresh data for this user)
- After code regeneration → invalidate stats + code

### 4.3 Toast Duplication Prevention

Use `localStorage("referral_claimed_toast")` to track which referral reward notifications have been shown:

```typescript
function shouldShowToast(referralId: number): boolean {
  const toasted = JSON.parse(
    localStorage.getItem("referral_claimed_toast") || "[]"
  );
  return !toasted.includes(referralId);
}

function markToastShown(referralId: number): void {
  const toasted = JSON.parse(
    localStorage.getItem("referral_claimed_toast") || "[]"
  );
  toasted.push(referralId);
  localStorage.setItem("referral_claimed_toast", JSON.stringify(toasted));
}
```

---

## 5. Edge Cases Checklist

### 5.1 User Lifecycle

| Scenario | Handling |
|----------|----------|
| User deletes account | All their referral codes become invalid. Keep referral records but mark referrer as deleted. |
| User changes role | Referral code remains valid. Role doesn't affect referral system. |
| User is banned | Invalidate their referral code. Don't award new points. Existing points remain. |
| User never generates code | `GET /api/referrals/stats` returns null for code. Frontend shows "إنشاء رمز دعوة" button. |

### 5.2 Referral Lifecycle

| Scenario | Handling |
|----------|----------|
| Referee enters code but never registers | Referral stays "pending" forever (or expires after 30 days) |
| Referee registers with wrong identifier | Code is tied to the registration — if login fails, the claim is lost. Acceptable. |
| Referee clicks link on multiple devices | Only the first registration triggers the claim. Subsequent clicks do nothing. |
| Same person uses two different codes on two accounts | Not preventable. Acceptable margin of abuse. |
| Referral code shared publicly (e.g., on Twitter) | Acceptable — this is a feature, not abuse. The referrer benefits from more exposure. |

### 5.3 Race Conditions

| Scenario | Handling |
|----------|----------|
| Two claims for the same code arrive simultaneously | DB unique constraint on `refereeId` prevents duplicate. Second request fails. |
| User regenerates code while a claim is in-flight | The claim checks `users.referralCode` at time of request. If code has changed, claim fails. |
| Multiple concurrent stat requests | Read-only, no race condition. |

### 5.4 Points & Rewards

| Scenario | Handling |
|----------|----------|
| Points awarded but referrer never claims | Auto-awarded on referral completion. No manual claim needed. |
| Points need to be revoked (fraud detection) | Admin endpoint to deduct points. Future feature. |
| What happens at tier thresholds | Purely cosmetic. No hard gatekeeping on features. |

---

## 6. Testing Checklist

### 6.1 Unit Tests

```
□ Referral code generation produces valid format
□ Referral code generation handles collision (mock collision)
□ Self-referral detection
□ Duplicate claim detection
□ Code format validation (rejects bad formats)
□ Rate limit enforcement
□ Tier calculation accurate
□ Points accumulation math
```

### 6.2 Integration Tests

```
□ Generate code → verify stored in DB
□ Claim with valid code → verify referral record created
□ Claim with invalid code → verify 404 error
□ Claim self-referral → verify 400 error
□ Claim duplicate → verify 400 error
□ View stats → verify counts match DB
□ Regenerate code → verify old code invalid, new code works
□ Claim with expired code → verify 410 error
```

### 6.3 Frontend Tests

```
□ ReferralCodeCard shows code when loaded
□ ReferralCodeCard shows skeleton when loading
□ ReferralCodeCard shows error when API fails
□ Copy button copies to clipboard (navigator.clipboard.writeText)
□ Share link opens native share dialog
□ ReferralStatsCards shows correct numbers
□ ReferralHistoryTable shows rows when populated
□ ReferralHistoryTable shows empty state
□ Profile page redirects to /login when unauthenticated
□ Service card navigates to /profile when clicked
□ Service card navigates to /login when unauthenticated
```
