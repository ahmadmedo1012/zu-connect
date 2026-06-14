---

description: "Local Setup & Polish — make ZU Connect runnable locally with Neon DB, add animations, fix bugs"
---

# Tasks: Local Setup & Polish

**Input**: Design documents from `/specs/001-local-setup-polish/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/, quickstart.md

**Tests**: Per spec, no automated tests requested — verification is manual browser testing and typecheck.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `artifacts/api-server/src/`, `artifacts/zu-connect/src/`
- **Shared libs**: `lib/db/src/`, `lib/api-zod/src/`, `lib/api-client-react/src/`
- **Spec**: `lib/api-spec/openapi.yaml`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, environment config, dependency installation

- [x] T001 Create `.env.example` at repo root with `PORT`, `BASE_PATH`, `DATABASE_URL` placeholders
- [x] T002 Run `pnpm install` — verify all workspace packages resolve without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete (role-based auth middleware T027 is a prerequisite for login/auth user stories)

- [ ] T003 Push DB schema to Neon via `pnpm --filter @workspace/db run push` — verify 11 tables created
- [ ] T004 Create seed script at `lib/db/src/seed.ts` with prototype data (news, courses, members, colleges, library, planner, chat rooms, faq) using Drizzle insert
- [ ] T005 [P] Run `pnpm run typecheck:libs` — fix any TypeScript errors in lib packages
- [ ] T027 [P] Implement role-based authorization middleware in `artifacts/api-server/src/middlewares/auth.ts` — enforce student/teacher/admin roles at API layer with distinct boundaries per Principle II

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Local Development Environment (Priority: P1) 🎯 MVP

**Goal**: Developer can clone the repo, install, configure, and run both frontend and API server locally.

**Independent Test**: After setup, opening `http://localhost:5173` shows the full homepage with data loaded from the Neon database, no console errors.

- [ ] T006 [P] [US1] Create `.env` at repo root from `.env.example` with `PORT=3000 BASE_PATH=/ DATABASE_URL=<neon-connection-string>`
- [ ] T007 [US1] Build API server via `pnpm --filter @workspace/api-server run build` — fix any esbuild/runtime errors in `artifacts/api-server/src/`
- [ ] T008 [P] [US1] Start frontend dev server via `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/zu-connect run dev` — fix any Vite/resolve errors in `artifacts/zu-connect/src/`
- [ ] T009 [US1] Run seed script to populate DB with demo content — `pnpm tsx lib/db/src/seed.ts`
- [ ] T010 [US1] Verify full stack: API server on :3000 returns data for `/api/news`, `/api/stats`, `/api/chat/rooms`; frontend on :5173 loads homepage with stats, news, leadership board

**Checkpoint**: User Story 1 complete — full stack runs locally with real data

---

## Phase 4: User Story 2 - Database-Backed Data Layer (Priority: P1)

**Goal**: All platform content persists in the Neon database. localStorage simulations are replaced. Data survives page refreshes and is shared across sessions.

**Independent Test**: Submit a suggestion, enroll in a course, send a chat message — refresh browser — all data persists and is visible.

- [ ] T011 [P] [US2] Audit all API routes in `artifacts/api-server/src/routes/` — verify every endpoint reads/writes through Drizzle ORM (no hardcoded arrays or localStorage)
- [ ] T012 [P] [US2] Verify course enrollment/unenrollment endpoints in `artifacts/api-server/src/routes/courses.ts` correctly increment/decrement `enrolledCount` in DB
- [ ] T013 [P] [US2] Check frontend pages in `artifacts/zu-connect/src/pages/` use generated React Query hooks from `@workspace/api-client-react` (not localStorage) for all data operations
- [ ] T014 [US2] End-to-end persistence test: submit form (suggestions/volunteer/chat) → refresh page → verify data still displays via API
- [ ] T028 [P] [US2] Create leadership API endpoint in `artifacts/api-server/src/routes/leadership.ts` — move hardcoded data from `home.tsx` to `lib/db/src/schema/leadership.ts`, add DB table, seed data, and register route
- [ ] T029 [US2] Implement DB-backed login authentication in `artifacts/api-server/src/routes/auth.ts` with credential verification and `artifacts/zu-connect/src/pages/login.tsx` — connect to DB, validate credentials, return user name

**Checkpoint**: User Story 2 complete — all data persists in Neon DB across sessions

---

## Phase 5: User Story 3 - Visual Polish & Animations (Priority: P2)

**Goal**: The platform feels polished with smooth transitions, hover effects, scroll animations, and loading states.

**Independent Test**: Navigate between pages with smooth transitions, hover buttons/cards for feedback, scroll through lists for staggered reveals — all at 60fps with no jank.

- [ ] T015 [P] [US3] Add framer-motion `AnimatePresence` page transition wrapper in `artifacts/zu-connect/src/App.tsx` — wrap `<Switch>` with fade/slide transition on route change
- [ ] T016 [P] [US3] Add `motion.div` staggered reveal to card grids in `artifacts/zu-connect/src/pages/home.tsx` (stats, news, leadership), `courses.tsx`, `members.tsx`, `library.tsx` using `framer-motion` variants
- [ ] T017 [P] [US3] Add hover/click micro-interactions to interactive elements: scale on cards (`home.tsx`), glow on buttons, ripple on chips — use `whileHover`/`whileTap` from framer-motion
- [ ] T018 [P] [US3] Add loading skeleton components in `artifacts/zu-connect/src/components/ui/` — replace existing manual `animate-pulse` divs with reusable `<Skeleton />` component; apply to all pages with async data
- [ ] T019 [US3] Add `prefers-reduced-motion` support: wrap framer-motion animations with a check for `window.matchMedia("(prefers-reduced-motion: reduce)")` and disable animation in that case

**Checkpoint**: User Story 3 complete — animations, transitions, loading states all working smoothly

---

## Phase 6: User Story 4 - Bug Fixes & Full Feature Access (Priority: P2)

**Goal**: All navigation links work, forms submit correctly, AI assistant responds, login functions end-to-end, no console errors.

**Independent Test**: Click every nav link (15 routes), submit every form (5+ forms), interact with AI assistant, test login — zero console errors, zero broken targets.

- [ ] T020 [P] [US4] Fix navigation: verify all links in `artifacts/zu-connect/src/components/layout/AppLayout.tsx` and service tiles redirect to correct wouter routes; fix any broken `href` targets
- [ ] T021 [P] [US4] Fix form validation and error handling in `artifacts/zu-connect/src/pages/suggestions.tsx`, `volunteer.tsx`, `login.tsx` — add Zod validation feedback, show inline errors, display success toast on submit
- [ ] T022 [P] [US4] Fix AI assistant in `artifacts/zu-connect/src/pages/home.tsx` — ensure response matching works correctly for keywords (امتحانات, تسجيل, مكتبة, منح, محادثات, تاريخ); add 3-second timeout fallback message
- [ ] T023 [US4] Run `pnpm run typecheck` — fix all remaining TypeScript errors across the entire workspace

**Checkpoint**: User Story 4 complete — all pages functional, forms validated, no errors

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification and final cleanup

- [ ] T024 [P] Run quickstart.md validation scenarios end-to-end: confirm all 5 scenarios pass
- [ ] T025 [P] Add `.gitignore` entries for `dist/`, `.env` (ensure `.env.example` is NOT ignored); verify `pnpm-lock.yaml` is tracked
- [ ] T026 Run `pnpm run build` — verify full production build completes without errors
- [ ] T030 [P] Evaluate CDN dependencies (Google Fonts Cairo, Tabler Icons) for regional reliability in Libya — add self-hosting plan or `.env` toggle if unreliable per Principle IV
- [ ] T031 [P] Edge case verification: test DB disconnect (verify 503 response), empty form submission (verify inline errors), full course enrollment (verify "مكتمل" state)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 can run in parallel
  - US3 and US4 can start any time after Foundational — no dependencies on US1/US2
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational — Independent from US1
- **User Story 3 (P2)**: Can start after Foundational — Independent from US1/US2
- **User Story 4 (P2)**: Can start after Foundational — Independent from US1/US2/US3

### Within Each User Story

- Models/DB tasks before service/route tasks (within US2)
- UI components before page integration (within US3)
- Fix typecheck as final step (within US4, T023)

### Parallel Opportunities

- All [P] tasks across all phases can run in parallel (no shared files)
- T015-T018 (US3 animations) can all run in parallel — different files
- T020-T022 (US4 fixes) can all run in parallel — different files
- T027 (auth middleware) is sequential within Phase 2 — blocks T029 (login auth)
- T030, T031 can run in parallel with any other [P] task
- US1 and US2 can be worked on in parallel by different developers
- Once Foundational completes, all 4 stories can proceed in parallel

---

## Parallel Example: User Story 3 (Animations)

```bash
# Launch all animation tasks together (different files):
Task: "T015 [P] [US3] Add framer-motion AnimatePresence page transition in App.tsx"
Task: "T016 [P] [US3] Add staggered reveal to card grids in home.tsx, courses.tsx, members.tsx, library.tsx"
Task: "T017 [P] [US3] Add hover/click micro-interactions using framer-motion whileHover/whileTap"
Task: "T018 [P] [US3] Create Skeleton component and apply to all data-fetching pages"

# Then sequential (depends on animation decisions):
Task: "T019 [US3] Add prefers-reduced-motion support"
```

## Parallel Example: User Story 4 (Bug Fixes)

```bash
# Launch all fix tasks together (different files):
Task: "T020 [P] [US4] Fix navigation links in AppLayout.tsx"
Task: "T021 [P] [US4] Fix form validation in suggestions.tsx, volunteer.tsx, login.tsx"
Task: "T022 [P] [US4] Fix AI assistant in home.tsx"

# Then sequential (depends on fixes being applied):
Task: "T023 [US4] Run pnpm run typecheck and fix remaining errors"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — `.env.example`, `pnpm install`
2. Complete Phase 2: Foundational — DB schema push, seed script, typecheck
3. Complete Phase 3: User Story 1 — `.env`, API build, frontend dev, seed run, verify
4. **STOP and VALIDATE**: Test US1 independently — homepage loads with DB data
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Local Dev) → Test independently → MVP complete!
3. Add US2 (Data Layer) → Test independently → Core complete
4. Add US3 (Animations) → Test independently → Polished
5. Add US4 (Bug Fixes) → Test independently → Production-ready
6. Final Polish → Verification complete

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (local dev setup)
   - Developer B: User Story 2 (data layer audit)
   - Developer C: User Story 3 (animations)
   - Developer D: User Story 4 (bug fixes)
3. All stories complete independently and integrate without conflicts
