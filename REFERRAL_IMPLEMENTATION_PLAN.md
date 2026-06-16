# Referral Implementation Plan — ZU Connect

> Phased implementation plan with step-by-step tasks, dependency order, and risk mitigation.

---

## Phase 0: Foundation (Backend + Data Layer)

**Goal**: Everything the frontend will depend on.

### Task 0.1 — Add referral_code + points columns to users table

**File**: `lib/db/src/schema/users.ts`

**Changes**:
- Add `referralCode: varchar("referral_code", { length: 20 }).unique()`
- Add `points: integer("points").notNull().default(0)`
- Run `drizzle-kit push` or generate migration

**Risk**: Low. Adding nullable/optional columns to existing table is backward-compatible.

### Task 0.2 — Create referrals table

**File**: `lib/db/src/schema/referrals.ts` (new file)

**Schema**: As defined in `REFERRAL_DATA_MODEL.md` §1.1

**Files to update**:
- `lib/db/src/schema/index.ts` — add export for `referrals`
- `lib/db/src/seed.ts` — add seed data (optional, 2-3 test referrals)

**Risk**: Low. New table, no existing code depends on it.

### Task 0.3 — Add OpenAPI paths for referrals

**File**: `lib/api-spec/openapi.yaml`

**Add 3 paths**:
- `POST /api/referrals/generate`
- `POST /api/referrals/claim`
- `GET /api/referrals/stats`
- `POST /api/referrals/regenerate`

**Follow existing patterns** from other endpoints (e.g., `POST /api/volunteers`).

**Risk**: Low. Follows existing spec structure.

### Task 0.4 — Regenerate Orval client

```bash
cd lib/api-spec
npx orval
```

**This generates**:
- `lib/api-client-react/src/generated/api.ts` (new hooks)
- `lib/api-client-react/src/generated/api.schemas.ts` (new types)
- `lib/api-zod/src/generated/` (new Zod schemas)

**Risk**: Medium. Orval regeneration can sometimes break if the spec has issues. Validate by checking TypeScript compilation after regeneration.

### Task 0.5 — Create referral API routes

**File**: `artifacts/api-server/src/routes/referrals.ts` (new)

**Endpoints to implement**:

1. `POST /api/referrals/generate`
   - Requires auth (Bearer token)
   - Check if user already has a code → return existing
   - If no code → generate new `ZU-XXXXXX` code
   - Store `referralCode` on the user record
   - Return `{ code, shareUrl }`

2. `POST /api/referrals/regenerate`
   - Requires auth
   - Generate new code
   - Update `referralCode` on user record (overwrite old)
   - Old code becomes invalid
   - Return `{ code, shareUrl }`

3. `POST /api/referrals/claim`
   - No auth required (called during registration)
   - Validate: code exists, code is active, referrer !== referee, referee not already claimed
   - Create referral record with status "pending"
   - Return `{ success: true, pointsAwarded: 0 }` (points awarded on completion)

4. `GET /api/referrals/stats`
   - Requires auth
   - Query referrals by `referrerId`
   - Compute: total count, completed count, points earned, monthly points
   - Query rank (COUNT of users with more points than current user)
   - Return `{ code, shareUrl, stats, history }`

**Files to update**:
- `artifacts/api-server/src/routes/index.ts` — register new route

**Risk**: Medium. Need to handle edge cases (collision on code generation, race conditions on claim).

### Task 0.6 — Add validation + anti-abuse

**Implemented inside the routes** (not as a separate file unless complexity grows).

**Rules**:
- Duplicate claim prevention: `refereeId` must be unique in referrals table
- Self-referral prevention: check `referrerId !== refereeId`  
- Code existence check: query user by `referralCode`
- Rate limiting: max 3 claims per IP per hour (store in memory or DB)

---

## Phase 1: Frontend Hook + Profile Page

**Goal**: Full referral dashboard available at `/profile`.

### Task 1.1 — Create useReferral hook

**File**: `artifacts/zu-connect/src/hooks/use-referral.ts`

**Implementation**:
```typescript
export function useReferral() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch stats from API
  const statsQuery = useQuery({
    queryKey: ["referral-stats"],
    queryFn: () => fetch("/api/referrals/stats").then(r => r.json()),
    enabled: !!user,
  });

  // Generate/refresh code mutation
  const generateMutation = useMutation({
    mutationFn: () =>
      fetch("/api/referrals/generate", { method: "POST" }).then(r => r.json()),
    onSuccess: (data) => {
      localStorage.setItem("referral_code", data.code);
      queryClient.invalidateQueries({ queryKey: ["referral-stats"] });
    },
  });

  // ... copyCode, copyLink, regenerateCode methods
}
```

### Task 1.2 — Create referral UI components

**Files**:
- `ReferralCodeCard.tsx`
- `ReferralStatsCards.tsx`
- `ReferralHistoryTable.tsx`
- `ReferralRewardsProgress.tsx`

**Directory**: `artifacts/zu-connect/src/components/referral/`

**Pattern**: Each component receives data via props, handles its own loading/error/empty states. No internal data fetching — data comes from `useReferral` hook.

### Task 1.3 — Create Profile page

**File**: `artifacts/zu-connect/src/pages/profile.tsx`

**Components used**:
```
profile.tsx
├── ReferralCodeCard
├── ReferralStatsCards
├── ReferralRewardsProgress
└── ReferralHistoryTable
```

**Auth guard**: Redirect to `/login` if `!user`.

### Task 1.4 — Register route

**File**: `artifacts/zu-connect/src/App.tsx`

```typescript
<Route path="/profile"><AnimatedPage><Profile /></AnimatedPage></Route>
```

---

## Phase 2: UI Entry Points

**Goal**: Users can discover the referral feature from multiple surfaces.

### Task 2.1 — Add referral service card to home page

**File**: `artifacts/zu-connect/src/pages/home.tsx`

**Changes**:
1. Import `UserPlus` from lucide-react
2. Add `{ icon: UserPlus, title: "دعوة صديق", desc: "..." }` to `SERVICE_CARDS`
3. Handle click to navigate to `/profile`

**Navigation approach**: The `SERVICE_CARDS` array is defined outside the component. Options:
- A) Make the array a component-level constant and use `useLocation()` + handlers
- B) Convert to JSX map with inline `<Link>` wrappers

**Recommendation**: Option A — wrap each card's `motion.div` with an `onClick` handler:
```typescript
const goTo = (path: string) => {
  if (user) setLocation(path);
  else setLocation("/login");
};
```

### Task 2.2 — Add referral menu item to user dropdown

**File**: `artifacts/zu-connect/src/components/layout/Topbar.tsx`

**Changes**:
1. Import `UserPlus` and `useLocation`
2. Add menu item between the user info section and logout button:
```tsx
<button
  onClick={() => {
    setMenuOpen(false);
    setLocation('/profile');
  }}
  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
>
  <UserPlus className="w-4 h-4" />
  دعوة صديق
</button>
```

---

## Phase 3: Referral on Registration

**Goal**: New users can enter a referral code when logging in.

### Task 3.1 — Add referral code field to login page

**File**: `artifacts/zu-connect/src/pages/login.tsx`

**Changes**:
1. Add `refCode` state variable
2. Read `?ref=` from URL on mount (URLSearchParams)
3. Add collapsible field between role selector and form
4. Include `refCode` in the login API call body
5. On submit, call `POST /api/referrals/claim` with the code + user identifier

### Task 3.2 — Update login API route to handle referral

**File**: `artifacts/api-server/src/routes/auth.ts`

**Changes**:
- After successful login/registration, if `refCode` is provided in body:
  - Validate the referral code
  - Create referral record linking referrer to new user
  - Award points to referrer
- Return referral result in login response (for frontend toast)

---

## Phase 4: Polish + Edge Cases

**Goal**: Handle all error states, loading states, and edge cases.

### Task 4.1 — localStorage caching layer

**File**: `artifacts/zu-connect/src/hooks/use-referral.ts`

**Implementation**:
- On mount: read `localStorage("referral_code")`, display immediately
- After API fetch: update localStorage with fresh data
- On logout: clear all referral localStorage keys

### Task 4.2 — Toast notifications

**Integration points**:
- Copy success: `toast({ title: "تم النسخ!", description: "..." })`
- Referral claimed: `toast({ title: "تم تسجيل دعوتك!", description: "+50 نقطة" })`
- Error: `toast({ title: "خطأ", description: "..." , variant: "destructive" })`

### Task 4.3 — Skeleton loading states

All referral components must show skeleton placeholders while data loads.

**Pattern**: Reuse existing `<Skeleton variant="card" className="h-48" icon={UserPlus} />`

---

## Dependency Order (Execution Sequence)

```
Task 0.1 ──→ Task 0.2 ──→ Task 0.3 ──→ Task 0.4
                                      │
                    Task 0.5 ←────────┘
                       │
                       ├──→ Task 0.6
                       │
Task 1.1 ←────────────┘
   │
   ├──→ Task 1.2 ──→ Task 1.3 ──→ Task 1.4
   │
   └──→ Task 2.1
   │
   └──→ Task 2.2
   │
Task 3.1 ──→ Task 3.2
   │
Task 4.1 ──→ Task 4.2 ──→ Task 4.3
```

**Parallelizable**: Tasks 2.1 and 2.2 can run in parallel with each other. Tasks 0.1-0.4 can run sequentially in a single session.

---

## Files That Must Be Created

| # | File | Phase |
|---|------|-------|
| 1 | `lib/db/src/schema/referrals.ts` | 0 |
| 2 | `lib/api-spec/openapi.yaml` (3 new paths) | 0 |
| 3 | `artifacts/api-server/src/routes/referrals.ts` | 0 |
| 4 | `artifacts/zu-connect/src/hooks/use-referral.ts` | 1 |
| 5 | `artifacts/zu-connect/src/components/referral/ReferralCodeCard.tsx` | 1 |
| 6 | `artifacts/zu-connect/src/components/referral/ReferralStatsCards.tsx` | 1 |
| 7 | `artifacts/zu-connect/src/components/referral/ReferralHistoryTable.tsx` | 1 |
| 8 | `artifacts/zu-connect/src/components/referral/ReferralRewardsProgress.tsx` | 1 |
| 9 | `artifacts/zu-connect/src/pages/profile.tsx` | 1 |

## Files That Must Be Modified

| # | File | Change | Phase |
|---|------|--------|-------|
| 1 | `lib/db/src/schema/users.ts` | Add referral_code + points columns | 0 |
| 2 | `lib/db/src/schema/index.ts` | Export referrals table | 0 |
| 3 | `artifacts/api-server/src/routes/index.ts` | Register referral routes | 0 |
| 4 | `artifacts/api-server/src/routes/auth.ts` | Handle refCode on registration | 3 |
| 5 | `artifacts/zu-connect/src/App.tsx` | Add /profile route | 1 |
| 6 | `artifacts/zu-connect/src/pages/home.tsx` | Add referral service card | 2 |
| 7 | `artifacts/zu-connect/src/components/layout/Topbar.tsx` | Add referral menu item | 2 |
| 8 | `artifacts/zu-connect/src/pages/login.tsx` | Add referral code field | 3 |

## Files That Stay Untouched

| File | Reason |
|------|--------|
| `index.css` | Theme system unrelated |
| `ThemeProvider.tsx` / `ThemeToggle.tsx` | Unrelated |
| `custom-fetch.ts` | Already handles auth, works as-is |
| `setupAuth.ts` | Works as-is |
| All existing UI components (`button.tsx`, `card.tsx`, etc.) | Reuse, don't modify |
| All existing page files (except home, login, profile) | No changes needed |
| All existing lib files (`utils.ts`, `icon-maps.ts`, `variants.ts`) | Unrelated |
| All existing backend routes (except auth, index) | No changes needed |

## Total Effort Estimate

| Phase | Tasks | Files touched | Estimated time |
|-------|-------|---------------|----------------|
| 0 (Backend) | 6 | 5 new, 4 modified | 2-3 hours |
| 1 (Hook + Profile) | 4 | 5 new, 1 modified | 1-2 hours |
| 2 (Entry Points) | 2 | 2 modified | 30 min |
| 3 (Registration) | 2 | 1 new field, 1 modified | 30 min |
| 4 (Polish) | 3 | 1 modified | 30 min |

**Total**: ~5-7 hours for a single developer.
