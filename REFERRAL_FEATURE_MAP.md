# Referral Feature Map — ZU Connect

> All touchpoints, user flows, and insertion points for the student referral system.

---

## 1. Feature Summary

Allow logged-in students to:
1. Generate a unique referral code
2. Share their code/link with other students
3. Track how many students they've referred
4. Receive rewards (points) when a referred student joins
5. View their referral history and stats

---

## 2. Referral User Flow (End-to-End)

### Flow A: First-Time Referrer

```
1. Student logs in → lands on home page
2. Sees "دعوة صديق" (Invite a Friend) card in the services grid
3. Clicks card → navigates to /profile#referral (or a modal)
4. System auto-generates their referral code (first visit only)
5. Student sees:
   - Their unique code: "ZU-XXXXXX"
   - Copy button to copy code to clipboard
   - Share link button
   - Current stats: 0 referrals, 0 points earned
   - "أدعُ أصدقاءك الآن" CTA
6. Student copies code and shares with friends
```

### Flow B: Referred Student Joins

```
1. New student visits /login
2. Sees "لديك رمز دعوة؟" (Have an invite code?) field
3. Or uses direct link: /login?ref=ZU-XXXXXX
4. If using direct link, code auto-fills
5. Student creates account (future) or the code is recorded
6. Backend:
   - Validates code exists and is active
   - Checks referrer isn't the same person
   - Checks code hasn't been used by this student before
   - Creates referral record
   - Awards points to referrer
```

### Flow C: Referrer Checks Stats

```
1. Student clicks "دعوة صديق" card or user menu item
2. Goes to /profile#referral
3. Sees:
   - Referral code (always visible, regenerable)
   - Total referrals count
   - Points earned
   - History table: date, referred name, status, points earned
   - Progress toward next reward tier (if any)
```

### Flow D: Referral Reward Claim

```
1. System auto-awards points when a referral completes
2. Student sees toast notification: "تم تسجيل دعوتك! +50 نقطة"
3. Points balance updates on the referral dashboard
4. Future: can add reward tiers (100pts = badge, 500pts = feature unlock)
```

---

## 3. All Touchpoints (UI Surfaces)

### 3.1 Home Page — Services Section (home.tsx)

**Priority: P0 (must have)**

Add a new entry to the `SERVICE_CARDS` array:

```typescript
{ icon: UserPlus, title: "دعوة صديق", desc: "ادعُ أصدقاءك للانضمام للمنصة واحصل على المكافآت" }
```

When clicked:
- If logged in → navigate to `/profile#referral` or open referral modal
- If not logged in → navigate to `/login`

**Click handler**: The services page uses `<Link>` wrapping each card. The home services cards use `motion.div`. Need to either:
- Add `onClick` + `useLocation()` for navigation, or
- Wrap each card in `<Link>`

### 3.2 Topbar User Dropdown (Topbar.tsx)

**Priority: P1 (enhancement)**

Add a menu item in the logged-in user dropdown:

```tsx
<button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm
                    text-foreground hover:bg-accent transition-colors">
  <UserPlus className="w-4 h-4" />
  دعوة صديق
</button>
```

Position: Above "تسجيل الخروج" logout button.

### 3.3 New Profile Page — `/profile`

**Priority: P0 (must have)**

This is the **primary home** for the referral feature. The page has sections:

```
/profile
├── Hero: "برنامج الدعوات" title + description
├── Referral Code Card
│   ├── Generated code (large, bold, monospace)
│   ├── "نسخ الرمز" button (copies to clipboard)
│   ├── "مشاركة الرابط" button (share link)
│   └── Regenerate button (with confirmation)
├── Stats Cards Row
│   ├── عدد الدعوات (total referrals count)
│   ├── النقاط المكتسبة (total points earned)
│   └── الترتيب (rank, if leaderboard exists)
├── Rewards Progress Card
│   ├── Current points / Next tier threshold
│   ├── Progress bar
│   └── Tier names/targets
└── Referral History Table
    ├── Date column
    ├── Referred student name/identifier
    ├── Status badge (pending / completed / rewarded)
    └── Points earned
```

### 3.4 Login Page — Referral Code Field (login.tsx)

**Priority: P1 (enhancement)**

Add a collapse/optional field on the login form:

```tsx
<details className="text-sm">
  <summary className="text-primary font-bold cursor-pointer">
    لديك رمز دعوة؟
  </summary>
  <input
    type="text"
    placeholder="أدخل رمز الدعوة"
    className="..."
  />
</details>
```

Also auto-fill from URL: `login.tsx` should read `?ref=CODE` from URL params using wouter's `useLocation` or URLSearchParams.

### 3.5 Referral Success Toast

**Priority: P1 (enhancement)**

When a referral is confirmed, show a toast:

```typescript
toast({
  title: "🎉 تم تسجيل دعوتك!",
  description: "أضفت +50 نقطة إلى رصيدك. شكراً لدعوة أصدقائك!"
});
```

### 3.6 Referral Notification Badge (Optional)

**Priority: P2 (future)**

If the user has unread referral rewards, show a badge on the user icon or referral menu item.

---

## 4. State Machines

### 4.1 Referral Code State

```
[no code] → generate → [code active]
    ↑                      │
    └──── regenerate ──────┘
         (with confirm)
```

### 4.2 Referral Claim State

```
[valid code entered] → validate → [code valid] → claim → [success]
                              ↓                    ↓
                         [invalid]            [error]
```

### 4.3 Referral Toast Trigger

```
[referee creates account] → [backend records referral] →
[refreshes query cache] → [referrer stats update] →
[toast: "تم تسجيل دعوتك!"]
```

---

## 5. Loading, Empty, Error States

| Component | Loading | Empty | Error | Success |
|-----------|---------|-------|-------|---------|
| Code Display | Skeleton box 120x40 | N/A | "حدث خطأ في تحميل الرمز" | Large code text |
| Stats Cards | Skeleton circle + text | "0" values with plus icon | "تعذر التحميل" | Counter numbers |
| History Table | Skeleton rows (3) | "لم تقم بدعوة أحد بعد" + CTA | "تعذر تحميل السجل" | Table rows |
| Copy Button | Disabled | N/A | "فشل النسخ" toast | "تم النسخ!" toast |
| Share Button | Disabled | N/A | "فشل المشاركة" toast | Share dialog opened |
| Code Generate | Spinning spinner | N/A | Error toast | Code displayed |

---

## 6. Responsive Behavior

| Component | Mobile (<640px) | Tablet (640-1024px) | Desktop (>1024px) |
|-----------|-----------------|---------------------|-------------------|
| Code Card | Full width, centered | 2/3 width, centered | max-w-md, centered |
| Stats Row | 1 column stack | 3 columns | 3 columns |
| History Table | Scrollable horizontally | Full table | Full table |
| Buttons | Full width | Auto width | Auto width |
| Copy/Share | Stacked vertically | Side by side | Side by side |

---

## 7. Dependency Graph

```
openapi.yaml ──→ Orval ──→ api.schemas.ts (types)
                         └─→ api.ts (hooks)
                              │
referrals DB table ←──────────┤
                              │
                              ├── useReferral hook (frontend)
                              │       │
                              │       ├── referral code display component
                              │       ├── referral stats card component
                              │       ├── referral history component
                              │       └── referral CTA (service card)
                              │
                              └── POST /api/referrals/claim (backend)
                                        │
                                        └── login.tsx ref code field
```
