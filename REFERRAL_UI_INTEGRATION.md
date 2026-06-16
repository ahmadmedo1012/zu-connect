# Referral UI Integration — ZU Connect

> Exact component definitions, page placements, and state handling for the referral UI.

---

## 1. Components to Create

### 1.1 ReferralCodeCard

**File**: `artifacts/zu-connect/src/components/referral/ReferralCodeCard.tsx`

**Purpose**: Display the user's referral code with copy and share actions.

**Layout**:
```
┌──────────────────────────────────────┐
│  رمز الدعوة الخاص بك                  │
│                                      │
│  ┌──────────────────────────────┐    │
│  │       ZU-A1B2C3              │    │
│  └──────────────────────────────┘    │
│                                      │
│  [📋 نسخ الرمز]  [🔗 نسخ الرابط]    │
│                                      │
│  <details>                          │
│    <summary>تغيير الرمز</summary>     │
│     تحذير: تغيير الرمز سيلغي القديم   │
│     [تأكيد التغيير]                  │
│  </details>                         │
└──────────────────────────────────────┘
```

**Props**:
```typescript
interface ReferralCodeCardProps {
  code: string | null;
  shareUrl: string;
  isLoading: boolean;
  error: string | null;
  onCopyCode: () => void;
  onCopyLink: () => void;
  onRegenerate: () => void;
}
```

**States**:
| State | Display |
|-------|---------|
| Loading | Skeleton box (w-48 h-12 rounded-xl) |
| Code Available | Large monospace code text |
| Error | "حدث خطأ في تحميل رمز الدعوة" with retry button |
| Empty (no code) | "جاري إنشاء رمز الدعوة..." with spinner |
| Copied | "تم النسخ!" toast + brief green check on button |
| Regenerating | Button disabled with spinner |

**RTL Note**: All text is Arabic. Use `dir="rtl"` on the card wrapper.

**Classes to use**:
```tsx
<div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
```

### 1.2 ReferralStatsCards

**File**: `artifacts/zu-connect/src/components/referral/ReferralStatsCards.tsx`

**Purpose**: Display key referral metrics in stat card format.

**Layout**:
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   عدد الدعوات │  │  النقاط      │  │  الترتيب     │
│     ١٥       │  │     ٧٥٠     │  │     ١٢      │
│  إجمالي      │  │  مكتسبة     │  │  بين المروجين│
└─────────────┘  └─────────────┘  └─────────────┘
```

**Props**:
```typescript
interface ReferralStatsCardsProps {
  stats: ReferralStats | null;
  isLoading: boolean;
}
```

**States**:
| State | Display |
|-------|---------|
| Loading | 3 skeleton stat cards |
| Loaded | 3 stat cards with animated numbers |
| Zero | Shows "0" with empty state styling (not error) |
| Error | "تعذر تحميل الإحصائيات" with retry button |

**Copy the existing `StatCard` pattern** from `home.tsx`:

```tsx
<div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary">
    <Users className="w-6 h-6" />
  </div>
  <span className="text-4xl font-black text-foreground">{value}</span>
  <span className="text-muted-foreground font-semibold">{label}</span>
</div>
```

### 1.3 ReferralHistoryTable

**File**: `artifacts/zu-connect/src/components/referral/ReferralHistoryTable.tsx`

**Purpose**: List all referrals made by the user.

**Layout**:
```
سجل الدعوات
┌──────┬────────────┬──────────┬──────────┬──────────┐
│ التاريخ │ الاسم     │ الحالة   │ النقاط   │          │
├──────┼────────────┼──────────┼──────────┼──────────┤
│ 15/6 │ أحمد محمد  │ ✅ مكتمل │ +٥٠     │          │
│ 14/6 │ سارة علي   │ ⏳ معلق  │ —       │          │
└──────┴────────────┴──────────┴──────────┴──────────┘
```

**Props**:
```typescript
interface ReferralHistoryTableProps {
  history: ReferralRecord[];
  isLoading: boolean;
}
```

**States**:
| State | Display |
|-------|---------|
| Loading | 3 skeleton rows |
| Empty | "لم تقم بدعوة أحد بعد. ابدأ الآن!" with CTA to share |
| Populated | Table rows with status badges |
| Error | "تعذر تحميل سجل الدعوات" with retry |

**Status badges**:
```typescript
const STATUS_CONFIG = {
  pending:    { label: "معلق",    class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  completed:  { label: "مكتمل",   class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  rewarded:   { label: "مكافأ",   class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  expired:    { label: "منتهي",   class: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400" },
} as const;
```

### 1.4 ReferralRewardsProgress

**File**: `artifacts/zu-connect/src/components/referral/ReferralRewardsProgress.tsx`

**Purpose**: Show progress toward next reward tier.

**Layout**:
```
تقدم المكافآت
───────────────
المروج    ●━━━━━━━━○───────    السفير
         ٢٥٠ / ٥٠٠ نقطة
         ┌────────────────────┐
         ████████████████░░░░░ 50%
         └────────────────────┘
```

**Props**:
```typescript
interface ReferralRewardsProgressProps {
  currentPoints: number;
  tiers: typeof REFERRAL_CONSTANTS.TIERS;
}
```

### 1.5 ReferralServiceCard

**File**: `artifacts/zu-connect/src/pages/home.tsx` (inline addition)

**Purpose**: Entry point on the home page services grid.

**Code addition to `SERVICE_CARDS` array**:
```typescript
{ icon: UserPlus, title: "دعوة صديق", desc: "ادعُ أصدقاءك للانضمام للمنصة واحصل على المكافآت" }
```

**Click behavior**:
- Authenticated → navigate to `/profile#referral`
- Unauthenticated → navigate to `/login`

### 1.6 ReferralCodeField (login.tsx)

**File**: `artifacts/zu-connect/src/pages/login.tsx` (modification)

**Purpose**: Allow new users to enter a referral code during login.

**UI**: Collapsible `<details>` element below the role selector, above the form.

**Auto-fill from URL**: On mount, parse `?ref=CODE` from URL search params:

```typescript
const params = new URLSearchParams(window.location.search);
const refCode = params.get("ref");
if (refCode) setReferralCode(refCode);
```

**Validation**: On submit, if referral code is provided, call `POST /api/referrals/claim`.

---

## 2. Page Integration

### 2.1 Profile Page (`/profile`) — NEW

**File**: `artifacts/zu-connect/src/pages/profile.tsx`

**Route**: `/profile` (add to `App.tsx` Router)

**Layout**:
```
<div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
  <PageHeader title="برنامج الدعوات" icon={UserPlus} desc="ادعُ أصدقاءك واربح النقاط" />
  <ReferralCodeCard />
  <ReferralStatsCards />
  <ReferralRewardsProgress />
  <ReferralHistoryTable />
</div>
```

**Auth guard**: Wrap in `if (!user) return <Redirect to="/login" />` pattern (use wouter's `useLocation`).

**Data fetching**: Use a `useReferral` hook that combines:
- `useQuery` for referral stats (GET /api/referrals/stats)
- `useMutation` for code generation (POST /api/referrals/generate)
- `useMutation` for code regeneration (POST /api/referrals/regenerate)

### 2.2 Home Page (`/`) — Modification

**File**: `artifacts/zu-connect/src/pages/home.tsx`

**Change 1**: Add `UserPlus` to the import from lucide-react.

**Change 2**: Add referral service card to `SERVICE_CARDS` array.

**Change 3**: Referral card onClick must use `useLocation` to navigate:
```typescript
// In Home component:
const [, navigate] = useLocation();
// SERVICE_CARDS is defined outside the component, so handle click:
// either convert to inline JSX or add onClick to the motion.div
```

### 2.3 User Dropdown (Topbar) — Modification

**File**: `artifacts/zu-connect/src/components/layout/Topbar.tsx`

**Change**: Add a "دعوة صديق" menu item before the logout button:
```tsx
<button
  onClick={() => setLocation('/profile')}
  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
>
  <UserPlus className="w-4 h-4" />
  دعوة صديق
</button>
```

---

## 3. Custom Hook: useReferral

**File**: `artifacts/zu-connect/src/hooks/use-referral.ts`

**Purpose**: Single hook that manages all referral state, localStorage caching, and API calls.

```typescript
interface UseReferralReturn {
  // State
  code: string | null;
  stats: ReferralStats | null;
  history: ReferralRecord[];
  isLoading: boolean;
  error: string | null;

  // Mutations
  copyCode: () => Promise<void>;
  copyLink: () => Promise<void>;
  regenerateCode: () => Promise<void>;

  // Derived
  progress: ReturnType<typeof getReferralProgress>;
  tier: (typeof REFERRAL_CONSTANTS.TIERS)[number];
}
```

**Implementation approach**:
1. On mount, check `localStorage("referral_code")` for instant display
2. Fetch from API in parallel via `useQuery`
3. On successful fetch, update localStorage cache
4. Mutations update React Query cache + localStorage
5. Expose loading/error states for UI

---

## 4. Routing Addition

**File**: `artifacts/zu-connect/src/App.tsx`

**Add**:
```typescript
import Profile from "@/pages/profile";

// In Router component:
<Route path="/profile"><AnimatedPage><Profile /></AnimatedPage></Route>
```

**Auth guard in Profile page** (not in router, since wouter doesn't support route guards natively):
```typescript
const { user } = useAuth();
const [, setLocation] = useLocation();

useEffect(() => {
  if (!user) setLocation("/login");
}, [user]);
```

---

## 5. Toast Integration Points

| Action | Toast | Type |
|--------|-------|------|
| Code copied | `"تم نسخ الرمز!"` | default |
| Link copied | `"تم نسخ رابط الدعوة!"` | default |
| Regenerate success | `"تم تغيير الرمز بنجاح"` | default |
| Referral claimed | `"تم تسجيل دعوتك! +٥٠ نقطة"` | default |
| API error | `"حدث خطأ، حاول مرة أخرى"` | destructive |
| Self-referral blocked | `"لا يمكنك دعوة نفسك"` | destructive |
| Duplicate code | `"تم استخدام هذا الرمز من قبل"` | destructive |

---

## 6. Icon Usage (lucide-react)

All icons already available (no new imports needed from icon packs):

| Icon | Usage |
|------|-------|
| `UserPlus` | Service card, page header, menu item |
| `Share2` | Share button |
| `Link` | Copy link button |
| `Copy` | Copy code button |
| `Award` | Rewards section header |
| `Gift` | Points/tier display |
| `Medal` | Tier achievement |
| `Users` | Stats card icon |
| `RefreshCw` | Regenerate button |
| `Check` | Copy confirmation |
| `X` | Error/close state |
| `Clock` | Pending status |
| `CheckCircle` | Completed status |
| `Trophy` | Top referrer |
| `TrendingUp` | Progress indicator |
