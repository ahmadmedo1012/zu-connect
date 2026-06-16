# Referral Data Model — ZU Connect

> Exact TypeScript interfaces, database schema, localStorage keys, and derived values for the referral feature.

---

## 1. Database Schema (Drizzle + PostgreSQL)

### 1.1 Referrals Table

File: `lib/db/src/schema/referrals.ts`

```typescript
import { pgTable, serial, integer, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";

// ─── Status Enum ─────────────────────────────────────────────
export const REFERRAL_STATUS = {
  PENDING: "pending",     // Referee clicked link / entered code, not yet registered
  COMPLETED: "completed", // Referee completed registration
  REWARDED: "rewarded",   // Referrer received their reward points
  EXPIRED: "expired",     // Code was never used within time limit
} as const;

export type ReferralStatus = (typeof REFERRAL_STATUS)[keyof typeof REFERRAL_STATUS];

// ─── Table Definition ─────────────────────────────────────────
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),

  // The referrer (the person who shared the code)
  referrerId: integer("referrer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // The referred person (the new user)
  refereeId: integer("referee_id")
    .references(() => users.id, { onDelete: "set null" }),

  // The unique code used for this referral
  code: varchar("code", { length: 20 }).notNull(),

  // Current status of the referral
  status: varchar("status", { length: 20 })
    .notNull()
    .default(REFERRAL_STATUS.PENDING),

  // Points awarded to the referrer
  pointsAwarded: integer("points_awarded").notNull().default(0),

  // When the referee first used the code (clicked link / entered code)
  firstContactAt: timestamp("first_contact_at"),

  // When the referee completed registration
  completedAt: timestamp("completed_at"),

  // When points were awarded
  rewardedAt: timestamp("rewarded_at"),

  // IP address of the referee at time of claim (anti-abuse)
  refereeIp: varchar("referee_ip", { length: 45 }),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// ─── Indexes ──────────────────────────────────────────────────
// Index on (code) for fast lookup during claim
// Index on (referrerId) for listing a user's referrals
// Unique constraint on (refereeId) to prevent duplicate claims
```

### 1.2 Insert Schema (Drizzle Zod)

```typescript
export const insertReferralSchema = createInsertSchema(referrals, {
  referrerId: (s) => s.referrerId.min(1, "المرجع مطلوب"),
  code: (s) => s.code.min(4, "الرمز قصير جداً").max(20, "الرمز طويل جداً"),
  status: (s) => s.status.optional(),
});

export type InsertReferral = z.infer<typeof insertReferralSchema>;
```

### 1.3 User Points Column (Add to Existing `users` Table)

Add to `lib/db/src/schema/users.ts`:

```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  identifier: varchar("identifier", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("student"),
  referralCode: varchar("referral_code", { length: 20 }).unique(),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

---

## 2. TypeScript Interfaces (Frontend)

File: `lib/api-client-react/src/generated/api.schemas.ts` (Orval-generated additions)

```typescript
// ─── Referral Code ────────────────────────────────────────────
export interface ReferralCode {
  /** The unique referral code string */
  code: string;
  /** Full shareable URL */
  shareUrl: string;
  /** When the code was created */
  createdAt: string;
}

// ─── Referral Stats ───────────────────────────────────────────
export interface ReferralStats {
  /** Total number of people referred */
  totalReferrals: number;
  /** Number that completed registration */
  completedReferrals: number;
  /** Total points earned from referrals */
  totalPointsEarned: number;
  /** Points earned this month */
  monthlyPointsEarned: number;
  /** Current rank among referrers (optional) */
  rank?: number;
}

// ─── Referral Record ──────────────────────────────────────────
export interface ReferralRecord {
  id: number;
  /** Referred student's name (nullable if not registered) */
  refereeName: string | null;
  /** Referred student's identifier */
  refereeIdentifier: string | null;
  /** Status: pending | completed | rewarded | expired */
  status: ReferralStatus;
  /** Points earned from this referral */
  pointsAwarded: number;
  /** When the referral link was first used */
  firstContactAt: string | null;
  /** When registration completed */
  completedAt: string | null;
  /** When points were awarded */
  rewardedAt: string | null;
}

// ─── Generate Referral Code Request ───────────────────────────
export interface GenerateReferralCodeBody {
  // No body needed — code generated server-side
}

// ─── Generate Referral Code Response ──────────────────────────
export interface GenerateReferralCodeResponse {
  code: string;
  shareUrl: string;
}

// ─── Claim Referral Request ───────────────────────────────────
export interface ClaimReferralBody {
  /** Referral code entered by the new user */
  code: string;
}

// ─── Claim Referral Response ──────────────────────────────────
export interface ClaimReferralResponse {
  success: boolean;
  /** Points awarded to referrer */
  pointsAwarded: number;
  /** New total points for referrer */
  referrerNewTotal: number;
}

// ─── Referral Status Type ─────────────────────────────────────
export type ReferralStatus = "pending" | "completed" | "rewarded" | "expired";
```

---

## 3. localStorage Schema

### 3.1 New Keys

| Key | Type | Example | Purpose |
|-----|------|---------|---------|
| `"referral_code"` | `string \| null` | `"ZU-A1B2C3"` | Cached referral code for quick display |
| `"referral_stats"` | `string (JSON)` | `{"total":3,"points":150}` | Cached stats for instant load |
| `"referral_claimed_toast"` | `string[]` | `["ref-42","ref-43"]` | IDs of already-toasted rewards |

### 3.2 Why Cache to localStorage

- Referral code should appear **instantly** when user opens the referral page (no loading skeleton for already-known data)
- Stats can show cached values while re-fetching in background
- Prevent duplicate toast notifications on page refresh

### 3.3 Cache Invalidation

| Event | Action |
|-------|--------|
| User logs in | Load referral code from API, cache to localStorage |
| User logs out | Clear referral localStorage keys |
| Referral succeeds (API response) | Update cached stats |
| Page loads | Read from localStorage → show immediately → fetch fresh data → update cache + UI |

---

## 4. Derived Values

```typescript
// Computed on frontend from ReferralStats
export function getReferralProgress(stats: ReferralStats): {
  nextTier: string;
  pointsToNextTier: number;
  progressPercent: number;
} {
  const TIERS = [
    { name: "المبتدئ", threshold: 0 },
    { name: "المروج", threshold: 100 },
    { name: "السفير", threshold: 500 },
    { name: "المؤثر", threshold: 1000 },
    { name: "الأسطورة", threshold: 5000 },
  ];

  const currentPoints = stats.totalPointsEarned;
  const nextIndex = TIERS.findIndex(t => currentPoints < t.threshold);

  if (nextIndex === -1) {
    return {
      nextTier: TIERS[TIERS.length - 1].name,
      pointsToNextTier: 0,
      progressPercent: 100,
    };
  }

  const currentTier = TIERS[nextIndex - 1]?.threshold ?? 0;
  const nextTier = TIERS[nextIndex];
  const pointsToNextTier = nextTier.threshold - currentPoints;
  const progressPercent = ((currentPoints - currentTier) / (nextTier.threshold - currentTier)) * 100;

  return {
    nextTier: nextTier.name,
    pointsToNextTier,
    progressPercent: Math.min(progressPercent, 100),
  };
}
```

---

## 5. API Endpoints

### 5.1 `POST /api/referrals/generate`

Generate (or return existing) referral code for the authenticated user.

**Auth**: Required (Bearer token)

**Response (200)**:
```json
{
  "code": "ZU-A1B2C3",
  "shareUrl": "https://zu-connect.app/login?ref=ZU-A1B2C3"
}
```

### 5.2 `POST /api/referrals/claim`

Apply a referral code for a newly registering user.

**Auth**: Not required (used during registration flow)

**Body**:
```json
{
  "code": "ZU-A1B2C3",
  "refereeIdentifier": "2024-12345"
}
```

**Validation rules**:
- Code must exist and be active
- Referrer cannot refer themselves
- Referee cannot claim multiple codes
- Code cannot be expired

**Response (200)**:
```json
{
  "success": true,
  "pointsAwarded": 50,
  "referrerNewTotal": 150
}
```

### 5.3 `GET /api/referrals/stats`

Get referral stats for the authenticated user.

**Auth**: Required (Bearer token)

**Response (200)**:
```json
{
  "code": "ZU-A1B2C3",
  "shareUrl": "https://zu-connect.app/login?ref=ZU-A1B2C3",
  "stats": {
    "totalReferrals": 5,
    "completedReferrals": 3,
    "totalPointsEarned": 150,
    "monthlyPointsEarned": 50,
    "rank": 12
  },
  "history": [
    {
      "id": 1,
      "refereeName": "أحمد محمد",
      "refereeIdentifier": "2024-56789",
      "status": "rewarded",
      "pointsAwarded": 50,
      "completedAt": "2026-06-15T10:30:00Z"
    }
  ]
}
```

### 5.4 `POST /api/referrals/regenerate`

Generate a new referral code (invalidates old one).

**Auth**: Required (Bearer token)

**Response (200)**:
```json
{
  "code": "ZU-X9Y8Z7",
  "shareUrl": "https://zu-connect.app/login?ref=ZU-X9Y8Z7"
}
```

---

## 6. Referral Code Format

| Property | Value |
|----------|-------|
| Prefix | `ZU-` (university abbreviation) |
| Suffix | 6 alphanumeric characters (uppercase) |
| Length | 9 characters total |
| Example | `ZU-A1B2C3` |
| Collision prob. | 36^6 ≈ 2.17 billion combinations |
| Generation | Server-side, retry on collision |

Generation function (server-side, in referral route):

```typescript
import { nanoid } from "nanoid"; // or use crypto.randomBytes

function generateReferralCode(): string {
  // Use a 6-char alphanumeric (uppercase)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  const array = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[array[i] % chars.length];
  }
  return `ZU-${code}`;
}
```

---

## 7. Points & Rewards Constants

```typescript
export const REFERRAL_CONSTANTS = {
  POINTS_PER_REFERRAL: 50,
  MIN_CODE_LENGTH: 4,
  MAX_CODE_LENGTH: 20,
  CODE_PREFIX: "ZU-",
  CODE_SUFFIX_LENGTH: 6,
  CACHE_KEY_CODE: "referral_code",
  CACHE_KEY_STATS: "referral_stats",
  CACHE_KEY_TOASTED: "referral_claimed_toast",
  TIERS: [
    { name: "المبتدئ", threshold: 0,    icon: "🌱" },
    { name: "المروج",  threshold: 100,  icon: "📢" },
    { name: "السفير",  threshold: 500,  icon: "🎖️" },
    { name: "المؤثر",  threshold: 1000, icon: "🏆" },
    { name: "الأسطورة", threshold: 5000, icon: "👑" },
  ] as const,
} as const;

export type ReferralTier = (typeof REFERRAL_CONSTANTS.TIERS)[number]["name"];
```
