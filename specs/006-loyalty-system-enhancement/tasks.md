# Tasks: Loyalty System Enhancement

**Input**: Design documents from `specs/006-loyalty-system-enhancement/`

**Prerequisites**: plan.md, spec.md, data-model.md, research.md, contracts/api.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Database schema**: `lib/db/src/schema/`
- **Backend**: `artifacts/api-server/src/routes/`
- **Frontend**: `artifacts/zu-connect/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Seed data, configuration, and shared infrastructure for the loyalty system.

- [x] T001 Seed default earning actions in `lib/db/src/seed.ts` (8 actions with point values, daily limits, cooldowns)
- [x] T002 [P] Seed default tier definitions in `lib/db/src/seed.ts` (4 tiers: bronze, silver, gold, platinum)
- [x] T003 [P] Seed default achievement definitions in `lib/db/src/seed.ts` (6 achievements with criteria JSON)
- [x] T004 [P] Seed default loyalty config values in `lib/db/src/seed.ts` (points_per_currency, default_tier, expiry_days, max_daily, achievement_notification)
- [x] T005 Add `last_activity_at` column to `users` schema in `lib/db/src/schema/users.ts` and update seed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database schema tables that MUST exist before any user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Create `points_transactions` schema in `lib/db/src/schema/points-transactions.ts` with user_id FK, action_type, points_change, balance_after, reference_id, admin_note, idempotency_key, timestamps
- [x] T007 [P] Create `earning_actions` schema in `lib/db/src/schema/earning-actions.ts` with action_key, names, description, point_value, daily_limit, cooldown, enabled, icon
- [x] T008 [P] Create `rewards` schema in `lib/db/src/schema/rewards.ts` with name_ar, point_cost, image_url, stock, reward_type, fulfillment_instructions, is_active, expires_at
- [x] T009 [P] Create `redemptions` schema in `lib/db/src/schema/redemptions.ts` with user_id FK, reward_id FK, points_spent, status, admin_note, fulfillment timestamps
- [x] T010 [P] Create `achievements` schema in `lib/db/src/schema/achievements.ts` with key, names, icon, criteria JSONB, point_reward, is_hidden, is_active
- [x] T011 [P] Create `user_achievements` schema in `lib/db/src/schema/user-achievements.ts` with user_id FK, achievement_id FK, unique constraint, awarded_at, notified flag
- [x] T012 [P] Create `tiers` schema in `lib/db/src/schema/tiers.ts` with key, names, min_points, max_points, color, icon, benefits JSONB, sort_order
- [x] T013 [P] Create `loyalty_config` schema in `lib/db/src/schema/loyalty-config.ts` as key-value pair with JSONB value
- [x] T014 Export all new schemas from `lib/db/src/schema/index.ts` and push to DB

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — User Earns Points from Multiple Actions (Priority: P1) 🎯 MVP

**Goal**: Users can earn loyalty points from 5+ different action types (daily login, referrals, suggestions, content sharing, profile completion, events).

**Independent Test**: Perform each eligible action as a logged-in user and verify points are credited.

### Implementation for User Story 1

- [x] T015 [US1] Create loyalty service core in `artifacts/api-server/src/services/loyalty.ts` — `awardPoints(userId, actionType, refId, idempotencyKey)` function with daily limit and cooldown checks, creates points_transaction, updates users.points and last_activity_at
- [x] T015a [US1] Create Zod validation schemas for loyalty actions in `lib/db/src/schema/loyalty-validation.ts` — validatePointsClaim, validateTransactionQuery
- [x] T016 [P] [US1] Create `GET /api/loyalty/actions` endpoint in `artifacts/api-server/src/routes/loyalty.ts` — returns all enabled earning_actions with point values
- [x] T017 [P] [US1] Create `POST /api/loyalty/actions/:key/claim` endpoint in `artifacts/api-server/src/routes/loyalty.ts` — awards points for an action with idempotency key, returns new balance, uses Zod validation
- [x] T018 [US1] Integrate daily login point award into `artifacts/api-server/src/routes/auth.ts` — calls loyaltyService.awardPoints after successful login, once per day per user
- [x] T019 [US1] Integrate suggestion point award into existing suggestion submission route — calls loyaltyService.awardPoints on new suggestion creation
- [x] T020 [US1] Integrate referral point award into existing referral claim route — replace hardcoded 50 with config value from loyalty_config
- [x] T021 [US1] Create `use-loyalty` hook in `artifacts/zu-connect/src/hooks/use-loyalty.ts` with `useEarningActions()` and `useClaimPoints()` functions
- [x] T022 [US1] Add daily login point toast in existing login flow showing "+5 نقاط تسجيل الدخول اليومي" in `artifacts/zu-connect/src/pages/login.tsx`

**Checkpoint**: Users can earn points from daily login, referrals, and suggestions. Points balance increases and persists.

---

## Phase 4: User Story 2 — User Views Points History and Progress (Priority: P1)

**Goal**: Users can view complete points history with filters, current tier, progress to next tier, and available earning actions.

**Independent Test**: Perform earning actions, navigate to loyalty page, verify history shows transactions and tier progress updates.

### Implementation for User Story 2

- [x] T023 [P] [US2] Create `GET /api/loyalty/stats` endpoint in `artifacts/api-server/src/routes/loyalty.ts` — returns points, tier (computed), next tier progress, recent transactions, recent achievements, available reward count; depends on T015 loyalty service core
- [x] T024 [P] [US2] Create `GET /api/loyalty/transactions` endpoint in `artifacts/api-server/src/routes/loyalty.ts` — paginated history with filter by actionType, dateFrom, dateTo, uses Zod validation
- [x] T025 [US2] Create loyalty dashboard page at `artifacts/zu-connect/src/pages/Loyalty.tsx` — shows hero card with points + tier + progress bar, recent transactions list, achievements section, "Ways to Earn" panel
- [x] T026 [US2] Create points history page at `artifacts/zu-connect/src/pages/LoyaltyHistory.tsx` — full paginated transactions table with filter dropdown (action type), date range picker
- [x] T027 [US2] Add loyalty route to `artifacts/zu-connect/src/App.tsx` — `/loyalty` renders Loyalty.tsx, `/loyalty/history` renders LoyaltyHistory.tsx
- [x] T028 [US2] Add loyalty nav link in public site header/sidebar in `artifacts/zu-connect/src/components/layout/Navbar.tsx` — "نقاطي" link to /loyalty

**Checkpoint**: Users can navigate to /loyalty, see their points/tier/progress, filter transaction history, and view available earning actions.

---

## Phase 5: User Story 3 — User Redeems Points for Rewards (Priority: P1)

**Goal**: Users can browse a rewards catalog and redeem points for digital/physical rewards.

**Independent Test**: Accumulate points, browse catalog, redeem a reward, verify points deducted and history updated.

### Implementation for User Story 3

- [x] T029 [P] [US3] Create `GET /api/loyalty/rewards` endpoint in `artifacts/api-server/src/routes/loyalty.ts` — returns active rewards with stock status
- [x] T030 [US3] Create `POST /api/loyalty/rewards/:id/redeem` endpoint in `artifacts/api-server/src/routes/loyalty.ts` — validates points and stock, creates points_transaction (spend) + redemption record, decrements stock, returns redemption status
- [x] T031 [P] [US3] Create rewards catalog page at `artifacts/zu-connect/src/pages/Rewards.tsx` — grid of reward cards with point cost, stock indicator, redeem button
- [x] T032 [US3] Add reward redemption confirmation dialog — shows reward name, cost, user balance, confirm/cancel buttons
- [x] T033 [US3] Add insufficient points and out-of-stock handling in Rewards.tsx — disabled state with clear message
- [x] T034 [US3] Add rewards route to `artifacts/zu-connect/src/App.tsx` — `/loyalty/rewards` renders Rewards.tsx

**Checkpoint**: Users can browse rewards, redeem them, see points deducted, and view the redemption in their history.

---

## Phase 6: User Story 4 — User Receives Achievement Badges (Priority: P2)

**Goal**: Users automatically earn achievement badges when reaching milestones. Badges show on profile.

**Independent Test**: Trigger an achievement condition (e.g., earn 100 points) and verify badge appears on profile.

### Implementation for User Story 4

- [x] T035 [US4] Implement achievement checker service in `artifacts/api-server/src/services/loyalty.ts` — `checkAchievements(userId)` function that evaluates criteria JSON against user stats, awards badges, and optionally grants point rewards; depends on T015 loyalty service core
- [x] T036 [US4] Integrate achievement check into `awardPoints()` in loyalty service — calls `checkAchievements()` after every points change
- [x] T037 [P] [US4] Add user achievements display to loyalty dashboard in `Loyalty.tsx` — shows earned badges with icons, "Recent Achievements" section
- [x] T038 [US4] Add achievements section to public user profile page — shows all earned badges for the viewed user
- [x] T039 [US4] Add achievement notification — toast when a new badge is earned: "تهانينا! حصلت على شارة {name}"

**Checkpoint**: Users automatically earn badges on milestone, see them on their loyalty page and profile, and receive notifications.

---

## Phase 7: User Story 5 — Admin Manages Loyalty System Settings (Priority: P2)

**Goal**: Admin can configure earning actions, rewards, achievements, tiers, view analytics, and manually adjust points.

**Independent Test**: Login as admin, modify loyalty settings, verify changes take effect for regular users.

### Implementation for User Story 5

- [x] T040 [US5] Create admin loyalty stats endpoint `GET /api/admin/loyalty/stats` in `artifacts/api-server/src/routes/admin/loyalty.ts` — returns overall analytics: tier distribution, points by action, recent redemptions, total achievements awarded
- [x] T041 [P] [US5] Create admin loyalty CRUD endpoints in `artifacts/api-server/src/routes/admin/loyalty.ts`:
  - `GET /api/admin/loyalty/actions` — list earning actions
  - `PUT /api/admin/loyalty/actions/:key` — update action config
  - `POST /api/admin/loyalty/actions` — create new action
  - `GET/POST/PUT/DELETE /api/admin/loyalty/rewards[/:id]` — reward CRUD
  - `GET/POST/PUT/DELETE /api/admin/loyalty/achievements[/:id]` — achievement CRUD
  - `GET/PUT /api/admin/loyalty/tiers[/:key]` — tier list/update
  - `GET/PUT /api/admin/loyalty/config[/:key]` — loyalty config management
- [x] T041a [US5] Add retroactive achievement awarding endpoint `POST /api/admin/loyalty/achievements/:id/retroactively-award`
- [x] T042 [US5] Create `POST /api/admin/loyalty/users/:userId/adjust` endpoint — manual point adjustment with required reason, creates admin_adjustment transaction, logs to audit trail
- [x] T043 [US5] Create `GET /api/admin/loyalty/redemptions` endpoint with status filter — list pending redemptions
- [x] T044 [US5] Create `PUT /api/admin/loyalty/redemptions/:id/fulfill` and `PUT /api/admin/loyalty/redemptions/:id/cancel` endpoints — refunds points on cancel
- [x] T045 [US5] Create admin loyalty page at `artifacts/zu-connect/src/pages/admin/Loyalty.tsx` — tabbed layout with analytics, actions, rewards, achievements, tiers, config, redemptions, manual adjustment
- [x] T046 [US5] Add admin loyalty route to admin routing — `/admin/loyalty` renders Loyalty.tsx
- [x] T047 [US5] Add "الولاء" nav link to admin sidebar in `artifacts/zu-connect/src/components/admin/AdminSidebar.tsx`

**Checkpoint**: Admin can fully manage the loyalty system via the admin panel — actions, rewards, achievements, tiers, config, redemptions, and manual adjustments.

---

## Phase 8: User Story 6 — User Sees Leaderboard and Compares Progress (Priority: P3)

**Goal**: Users can view a platform leaderboard ranked by points, referrals, or achievements, with their own rank highlighted.

**Independent Test**: Earn points, navigate to leaderboard, verify ranking updates and own rank is shown.

### Implementation for User Story 6

- [x] T048 [P] [US6] Create `GET /api/loyalty/leaderboard` endpoint in `artifacts/api-server/src/routes/loyalty.ts` — returns top N users by sortBy (points/referrals/achievements), includes current user's rank
- [x] T049 [US6] Create `GET /api/loyalty/leaderboard/my-rank` endpoint — included in leaderboard response
- [x] T050 [US6] Create leaderboard page at `artifacts/zu-connect/src/pages/Leaderboard.tsx` — ranked list with name, points, stats; sort tabs (points/referrals/achievements); current user highlighted
- [x] T051 [US6] Add leaderboard route to `artifacts/zu-connect/src/App.tsx` — `/leaderboard` renders Leaderboard.tsx
- [x] T052 [US6] Add leaderboard nav link — "المتصدرين" link in Navbar.tsx

**Checkpoint**: Users can browse the leaderboard, see their own rank, and switch between sort modes.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories — RTL verification, points expiration, notifications, mobile responsiveness, edge case handling.

- [x] T053 [P] Implement points expiration cron script — `artifacts/api-server/src/scripts/expire-points.ts` queries inactive users, creates expiration transactions, resets points
- [x] T054 [P] Send in-app notification on level-up — rendered in loyalty dashboard tier section
- [x] T054a [P] Notification handled via `checkAchievements` return value → achievements toast on claim
- [x] T055 [P] All new pages use `dir="rtl"` and Arabic labels
- [x] T056 [P] Loading skeletons included in all new pages (Loyalty, LoyaltyHistory, Rewards, Leaderboard, admin Loyalty)
- [x] T057 [P] Error states with retry in all pages via `react-query` error handling
- [x] T058 [P] Empty states: "لا توجد معاملات بعد", "لا توجد مكافآت متاحة", "لا يوجد متصدرين بعد"
- [x] T058a [P] Rate-limit middleware on claim endpoint — 10 requests/minute per user via in-memory rate limiter
- [x] T058b [P] Add performance test script — `artifacts/api-server/src/scripts/benchmark-points.ts` for SC-008
- [x] T059 Run full project typecheck — verified, only pre-existing api-zod errors remain
- [x] T060 Update quickstart.md — fixed login credentials, endpoint paths, rollback commands
- [x] T061 Update `AGENTS.md` — already points to `specs/006-loyalty-system-enhancement/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Phase 2
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|-----------|-------------------|
| US1 — Points Earning | Phase 2 | — (first story) |
| US2 — History & Progress | Phase 2, US1 (to have data) | US3, US4, US6 |
| US3 — Rewards Catalog | Phase 2 | US2, US4, US6 |
| US4 — Achievement Badges | Phase 2, US1 (for points) | US2, US3, US6 |
| US5 — Admin Management | Phase 2, US1 (for actions), US3 (for rewards), US4 (for achievements) | — (needs most stories built) |
| US6 — Leaderboard | Phase 2 | US2, US3, US4 |

### Parallel Opportunities

- Phase 1 tasks T002, T003, T004 are all parallel (`[P]`)
- Phase 2 tasks T007–T013 are all parallel as they create independent tables
- Phase 3 US1: T015a, T016, T017 are parallel within the phase
- US2, US3, US4 can be built in parallel after Phase 2 (they use different schema/routes/pages)
- Phase 9 tasks T053–T061 are all parallel

---

## Parallel Example: User Story 2

```bash
# Backend stats + transactions endpoints are independent:
Task: "Create GET /api/loyalty/stats in routes/loyalty.ts"
Task: "Create GET /api/loyalty/transactions in routes/loyalty.ts"

# Frontend pages can be built after backend endpoints:
Task: "Create loyalty dashboard page at pages/Loyalty.tsx"
Task: "Create points history page at pages/LoyaltyHistory.tsx"
```

## Parallel Example: User Story 3

```bash
# Rewards catalog + redemption can be built together:
Task: "Create GET /api/loyalty/rewards in routes/loyalty.ts"
Task: "Create POST /api/loyalty/rewards/:id/redeem in routes/loyalty.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (seed data)
2. Complete Phase 2: Foundational (all 9 schema tables)
3. Complete Phase 3: US1 — Points earning (backend award service + basic hooks)
4. Complete Phase 4: US2 — History & progress (stats + transactions endpoints + dashboard page)
5. Complete Phase 5: US3 — Rewards catalog (rewards + redemption + frontend)
6. **STOP and VALIDATE**: Users can earn points, see history, and redeem rewards
7. Deploy MVP

### Incremental Delivery

1. Phase 1-2 → Foundation ready
2. US1 (Phase 3) → Users earn points → Deploy
3. US2 (Phase 4) → Users see history → Deploy
4. US3 (Phase 5) → Users redeem rewards → Deploy (MVP complete!)
5. US4 (Phase 6) → Achievements → Deploy
6. US5 (Phase 7) → Admin panel → Deploy
7. US6 (Phase 8) → Leaderboard → Deploy
8. Phase 9 → Polish → Final deploy

### Parallel Team Strategy

With multiple developers:
1. Team completes Phase 1-2 together
2. Once Foundation is done:
   - Developer A: US1 (points earning backend)
   - Developer B: US2 (history endpoints + frontend dashboard)
   - Developer C: US3 (rewards + redemption)
3. After US1-3 merge:
   - Developer A: US4 (achievements)
   - Developer B: US6 (leaderboard)
   - Developer C: US5 (admin panel)
4. Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each logical group of tasks
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
