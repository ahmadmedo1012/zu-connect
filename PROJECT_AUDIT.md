# Project Audit — ZU Connect

> Prepared for referral feature implementation.
> Date: 2026-06-16

---

## 1. Architecture Overview

### 1.1 Repository Structure

```
zu-connect/                          # pnpm workspace monorepo
├── artifacts/zu-connect/            # FRONTEND (Vite + React 19.1 + Tailwind v4)
├── artifacts/api-server/            # BACKEND (Express 5 + Drizzle + PostgreSQL)
├── lib/api-client-react/            # Orval-generated React Query hooks
├── lib/api-zod/                     # Orval-generated Zod schemas
├── lib/db/                          # Drizzle ORM schema + connection + seed
├── lib/api-spec/                    # OpenAPI 3.1 spec (source of truth)
└── specs/                           # Feature specs and plans
```

### 1.2 Frontend Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Build | Vite 7 + TypeScript 5.9 | Fast HMR, tree-shaking |
| UI | React 19.1 + Tailwind CSS v4 | Radix primitives (56 components) |
| Animations | Framer Motion 12.x | GPU-accelerated, respects prefers-reduced-motion |
| Routing | wouter | Lightweight, no redirect guards |
| Server State | @tanstack/react-query v5 | Auto-generated hooks via Orval |
| Forms | react-hook-form + zod | Manual validation in some pages |
| Icons | lucide-react | All icons in use |
| Toast | Custom useReducer pattern | Not shadcn sonner |
| Theme | CSS custom properties + localStorage | "light" / "dark" persisted |

### 1.3 Backend Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | Express 5 (ESM) | Lightweight, no ORM wrapper |
| Database | PostgreSQL via drizzle-orm | Pooled connections via @neondatabase/serverless |
| Auth | Simple Base64-encoded JSON token | Stored in `Authorization: Bearer` header |
| Validation | Zod (generated from OpenAPI) | Shared between frontend/backend |

### 1.4 State Management

**No external state library.** The app uses:
- **React Context**: `AuthContext` (user), `ThemeContext` (dark/light)
- **Local useState**: All page-level filters, form data, UI toggles
- **React Query**: All server data (fetched, cached, invalidated)
- **localStorage**: Token, username, theme preference — no wrapper or hook

### 1.5 localStorage Usage

| Key | Location | Purpose |
|-----|----------|---------|
| `"token"` | AuthContext + setupAuth.ts | Base64-encoded user payload |
| `"username"` | AuthContext + chat.tsx | Display name for chat sender |
| `"theme"` | ThemeProvider + main.tsx | "light" / "dark" theme preference |

**Pattern:** `localStorage.getItem(key)` and `localStorage.setItem(key, value)`. No expiry, no event listeners, no reactive wrapper.

---

## 2. Referral-Relevant Pages

### 2.1 Page Inventory

| Page | Route | Natural for Referral? | Why |
|------|-------|-----------------------|-----|
| home.tsx | `/` | **Strong** | Dashboard, first page users see, has stats cards and services grid |
| services.tsx | `/services` | **Strong** | Service directory, could host referral as a service card |
| login.tsx | `/login` | **Medium** | Post-login referral prompt, but no onboarding flow exists |
| about.tsx | `/about` | Weak | Informational only, no interaction patterns |
| members.tsx | `/members` | Weak | Member directory, could show top referrers |
| courses.tsx | `/courses` | Weak | Course enrollment unrelated |
| news.tsx | `/news` | Weak | Content consumption |
| planner.tsx | `/planner` | Weak | Calendar/events |
| chat.tsx | `/chat` | Weak | Messaging |
| suggestions.tsx | `/suggestions` | Weak | Feedback form |
| volunteer.tsx | `/volunteer` | Weak | Volunteer registration |
| faq.tsx | `/faq` | Weak | Static content |
| library.tsx | `/library` | Weak | File downloads |
| not-found.tsx | — | None | 404 page |

### 2.2 Natural Insertion Points

Ranked by fit:

1. **Home page services section** (home.tsx ~line 250) — Add a "دعوة صديق" (Invite a Friend) service card in the `SERVICE_CARDS` array
2. **Home page header/user dropdown** (Topbar.tsx ~line 56) — Add referral link in the logged-in user's dropdown menu
3. **A new `/profile` or `/referral` page** — Best long-term home for full referral dashboard (stats, history, rewards)
4. **Login success flow** — After login, show a one-time referral CTA banner

---

## 3. Existing Engagement Systems

### 3.1 Gamification Audit

| System | Exists? | Details |
|--------|---------|---------|
| Points | **No** | Nothing to build on |
| Badges | **No** | Nothing to build on |
| Levels | **No** | Nothing to build on |
| Leaderboard | **No** | Nothing to build on |
| Streaks | **No** | Nothing to build on |
| Progress indicators | **No** | Nothing to build on |
| Reward cards | **No** | Nothing to build on |
| Achievements | **No** | Nothing to build on |
| Activity feed | **No** | Nothing to build on |

The referral feature will be the **first gamification element** in the app. It must define its own reward/points system from scratch.

---

## 4. Auth System Detail

### 4.1 AuthUser Shape

```typescript
// From: lib/auth/AuthContext.tsx
export type Role = "student" | "teacher" | "admin";

export interface AuthUser {
  id: number;
  name: string;
  role: Role;
  identifier: string;  // student ID or email
}
```

### 4.2 Token Content

The token is a Base64url-encoded JSON with fields: `{ id, name, identifier, role }`.

Stored in `localStorage("token")`. Auto-attached to API requests via `custom-fetch.ts`.

### 4.3 Auth Flow

```
login.tsx → POST /api/auth/login → server validates → returns token →
AuthContext.login(token, name, role) → stores in localStorage →
auto-attached via setupAuth.getToken() on all subsequent API calls
```

---

## 5. API Pattern (for adding referral endpoints)

### 5.1 The Orval Workflow

```
1. Edit openapi.yaml           (lib/api-spec/openapi.yaml)
2. Run orval                   (generates api.ts + api.schemas.ts)
3. Use generated hooks         (@workspace/api-client-react)
```

### 5.2 Existing API Endpoint Pattern

```typescript
// Generated hook example (from api.ts):
export const useListNews = <TData = Awaited<ReturnType<typeof getNews>>>(
  params?: ListNewsParams,
  options?: Omit<ReactQueryOptions, 'queryKey'>,
) => { ... }
```

### 5.3 custom-fetch.ts Pattern

The `customFetch` wrapper:
- Prepends `/api` base URL
- Reads auth token from `getAuthToken()` (set by `setupAuth.ts`)
- Parses JSON responses
- Throws typed errors

---

## 6. Component Patterns

### 6.1 Card Pattern (for referral summary)

All grid cards follow a consistent pattern:

```tsx
<div className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-4
                hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
                transition-all group cursor-pointer">
  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center
                  text-primary group-hover:bg-primary group-hover:text-white transition-colors">
    <Icon className="w-6 h-6" />
  </div>
  <div>
    <h3 className="font-bold text-lg text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
  </div>
</div>
```

### 6.2 Button Pattern

```tsx
<Button className="rounded-xl font-bold" size="lg">
  نص الزر
</Button>
// or rounded-full for hero CTAs:
<Button size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20">
```

### 6.3 Stat Card Pattern

```tsx
<div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary">
    <Icon className="w-6 h-6" />
  </div>
  <span className="text-4xl font-black text-foreground">{value}</span>
  <span className="text-muted-foreground font-semibold">{label}</span>
</div>
```

### 6.4 Empty State Pattern

```tsx
<Empty icon={SomeIcon} title="لا يوجد محتوى" description="وصف الحالة الفارغة">
  <LottieAnimation src="/animations/empty/something.json" className="w-[140px] h-[140px]" />
</Empty>
```

### 6.5 Toast Pattern

```tsx
const { toast } = useToast();
toast({ title: "تم بنجاح", description: "وصف الإجراء" });
toast({ title: "خطأ", description: "وصف الخطأ", variant: "destructive" });
```

---

## 7. Responsive Patterns

- **Container**: `max-w-6xl mx-auto px-4 md:px-6` (all pages)
- **Grid cards**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
- **Mobile-first**: Always `sm:` breakpoint for 2-column layouts
- **RTL**: `dir="rtl"` on root; `space-x-reverse` for horizontal spacings; `mr-*` for icon spacing

---

## 8. What Stays Untouched

The referral feature must NOT modify these existing systems:

| System | Reason |
|--------|--------|
| AuthContext | Stable, works correctly |
| ThemeProvider | Unrelated |
| custom-fetch.ts | Globally shared |
| Existing API routes | No existing functionality should change |
| All UI components | Reuse, don't modify |
| Existing pages (except adding referral cards) | Content pages should remain intact |
| Database schema files (except new table) | Existing tables unchanged |

---

## 9. What Must Be Created

| Item | Type | Notes |
|------|------|-------|
| `referrals` DB table | Drizzle schema | Referral tracking |
| `POST /api/referrals/generate` | API route | Generate new code |
| `POST /api/referrals/claim` | API route | Apply referral on signup |
| `GET /api/referrals/stats` | API route | Get referrer stats |
| OpenAPI paths for referrals | `openapi.yaml` | 3 new endpoints |
| Generated hooks + schemas | Orval output | After regeneration |
| `useReferral` hook | Frontend hook | Encapsulates referral state + localStorage sync |
| Referral summary card | Component | Dashboard card showing code + stats |
| Referral history list | Component | Shows who was referred |
| Referral code display | Component | Copyable code + link |
| Referral service card | Home page addition | Entry point for feature |
| Profile/Referral page | New page | Full referral dashboard |

---

## 10. Dependencies to Add

| Dependency | Purpose | Type |
|-----------|---------|------|
| `nanoid` (or manual crypto) | Referral code generation | dependency |
| No other new dependencies | Everything else is in the project | — |

No UI libraries needed. No state management libraries needed. No additional icon libraries needed (lucide-react already has `Share2`, `Link`, `Copy`, `UserPlus`, `Award`, `Gift`, `Medal`).
