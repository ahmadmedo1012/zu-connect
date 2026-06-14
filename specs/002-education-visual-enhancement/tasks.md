---

description: "Education Visual Enhancement — تحسين المظهر برسومات وأيقونات تعليمية وأنيميشن متقدمة"
---

# Tasks: Education Visual Enhancement

**Input**: Design documents from `/specs/002-education-visual-enhancement/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated tests requested — verification is visual inspection and DevTools performance monitoring.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `artifacts/zu-connect/src/`
- **Icons lib**: `artifacts/zu-connect/src/lib/icons/`
- **Animations lib**: `artifacts/zu-connect/src/lib/animations/`
- **UI components**: `artifacts/zu-connect/src/components/ui/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundation files needed by all user stories — icon mapping, animation variants, design tokens

- [X] T001 Create centralized icon mapping file at `artifacts/zu-connect/src/lib/icons/icon-maps.ts` with all category-to-icon associations (news, colleges, courses, library types, course levels) per data-model.md
- [X] T002 [P] Create centralized animation variants file at `artifacts/zu-connect/src/lib/animations/variants.ts` with containerVariants, itemVariants, hoverEffect, tapEffect, pageTransition standard patterns
- [X] T003 [P] Add gold (#d4af37) and navy (#0b1f3f, #152a4f) as CSS custom properties in `artifacts/zu-connect/src/index.css` under `@theme` block: `--color-accent-gold`, `--color-navy-deep`, `--color-navy-card`
- [X] T004 [P] Repurpose existing `<Empty>` component in `artifacts/zu-connect/src/components/ui/empty.tsx` to support icon + educational title/description; currently unused but fully built

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete (icon mapping and animation foundation needed by all pages)

- [X] T005 [P] Integrate `<Skeleton>` component usage into all pages that still use inline `animate-pulse` divs: `colleges.tsx`, `news.tsx`, `planner.tsx`, `faq.tsx`, `chat.tsx`
- [X] T006 [P] Add framer-motion `AnimatePresence` + containerVariants/itemVariants to all pages missing it: `colleges.tsx`, `news.tsx`, `planner.tsx`, `services.tsx`, `faq.tsx`, `chat.tsx`, `suggestions.tsx`, `volunteer.tsx`, `about.tsx`, `login.tsx`, `not-found.tsx`

**Checkpoint**: Foundation ready — icon system and animation infrastructure available for all user stories

---

## Phase 3: User Story 1 - Enhanced Homepage with Educational Visuals (Priority: P1) 🎯 MVP

**Goal**: The homepage hero section shows educational-themed graphics, animated stat counters, and smooth scrolling animations.

**Independent Test**: Loading the homepage shows the hero with educational decorative icons, stat cards with animated icons and counters, and staggered section reveals on scroll.

- [X] T007 [P] [US1] Add hero decorative educational icons (GraduationCap, Book, Atom) as floating animated elements in `artifacts/zu-connect/src/pages/home.tsx` lines 55-77 (hero section overlay) — smooth y-axis drift ±8px over 3s ease-in-out, repeating
- [X] T008 [P] [US1] Add animated stat counters to the 4 stat cards in `artifacts/zu-connect/src/pages/home.tsx` — use `IntersectionObserver` to animate numbers from 0 to final value
- [X] T009 [P] [US1] Add educational icons to each stat card (GraduationCap for students, Building2 for colleges, Calendar for activities, FileText for library) in `artifacts/zu-connect/src/pages/home.tsx`
- [X] T010 [US1] Add subtle parallax effect on hero background image in `artifacts/zu-connect/src/pages/home.tsx` using framer-motion `useScroll` + `useTransform`

**Checkpoint**: Homepage hero visually enhanced with educational graphics, animated counters, and parallax effect

---

## Phase 4: User Story 2 - Educational Icon System Throughout Pages (Priority: P1)

**Goal**: Every page displays relevant educational icons for content categories — colleges, courses, library resources, news categories all have distinct visual identities.

**Independent Test**: Visiting each of the 15 pages shows category-appropriate educational icons on cards, headers, and navigation.

- [X] T011 [P] [US2] Add college-specific icons to `artifacts/zu-connect/src/pages/colleges.tsx` using icon-maps.ts — 12 colleges each with field-representative icon
- [X] T012 [P] [US2] Add subject-specific icons to course cards in `artifacts/zu-connect/src/pages/courses.tsx` — map course category from icon-maps.ts to display on each card
- [X] T013 [P] [US2] Add resource type icons (ملخصات→FileText, كتب PDF→Book, بحوث→Search, تسجيلات→Headphones) to library cards in `artifacts/zu-connect/src/pages/library.tsx`
- [X] T014 [P] [US2] Add news category visual indicators (color + icon per type) in `artifacts/zu-connect/src/pages/news.tsx`
- [X] T015 [US2] Add category visual indicators to news section on homepage in `artifacts/zu-connect/src/pages/home.tsx` — reuse news category icon mapping from icon-maps.ts

**Checkpoint**: All 15 pages display consistent educational iconography per category

---

## Phase 5: User Story 3 - Micro-Animations & Interactive Feedback (Priority: P2)

**Goal**: Hover effects, click animations, and page transitions provide smooth visual feedback throughout the platform.

**Independent Test**: Hovering cards shows scale effect, clicking buttons shows press effect, navigating pages shows transition animation.

- [X] T016 [P] [US3] Add whileHover scale and whileTap press effects to college cards in `artifacts/zu-connect/src/pages/colleges.tsx`
- [X] T017 [P] [US3] Add whileHover scale and whileTap press effects to news cards in `artifacts/zu-connect/src/pages/news.tsx`
- [X] T018 [P] [US3] Add whileHover scale and whileTap press effects to planner cards in `artifacts/zu-connect/src/pages/planner.tsx`
- [X] T019 [P] [US3] Add whileHover scale and whileTap press effects to service tiles in `artifacts/zu-connect/src/pages/services.tsx`
- [X] T020 [P] [US3] Add whileHover scale and whileTap press effects to FAQ items in `artifacts/zu-connect/src/pages/faq.tsx`
- [X] T021 [P] [US3] Add whileHover scale and whileTap press effects to chat room cards in `artifacts/zu-connect/src/pages/chat.tsx`
- [X] T022 [P] [US3] Add whileHover scale and whileTap press effects to member cards in `artifacts/zu-connect/src/pages/members.tsx`
- [X] T023 [P] [US3] Add whileHover scale and whileTap press effects to library resource cards in `artifacts/zu-connect/src/pages/library.tsx`
- [X] T024 [US3] Add whileHover scale and whileTap press effects to course cards in `artifacts/zu-connect/src/pages/courses.tsx`
- [X] T025 [US3] Refine the AI assistant chat widget color scheme in `artifacts/zu-connect/src/pages/home.tsx` — replace ad-hoc colors with navy/gold educational theme; add send button pulse animation

**Checkpoint**: All interactive elements provide smooth visual hover/click feedback

---

## Phase 6: User Story 4 - Loading & Empty States with Educational Graphics (Priority: P2)

**Goal**: Loading states show educational-themed skeletons/spinners; empty states show helpful educational illustrations.

**Independent Test**: On slow connections, skeletons with educational icons display; on empty sections, illustrated empty states appear.

- [X] T026 [P] [US4] Update `<Skeleton>` component in `artifacts/zu-connect/src/components/ui/skeleton.tsx` to accept optional `icon` prop for educational-themed loading states
- [X] T027 [P] [US4] Integrate `<Empty>` component into `colleges.tsx` for empty college list state
- [X] T028 [P] [US4] Integrate `<Empty>` component into `planner.tsx` for empty events state
- [X] T029 [P] [US4] Integrate `<Empty>` component into `library.tsx` for no search results
- [X] T030 [P] [US4] Integrate `<Empty>` component into `chat.tsx` for no messages state

**Checkpoint**: Loading states and empty states consistently display educational-themed placeholders

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and quality assurance

- [ ] T032 [P] Disable API server, navigate through all pages — verify error states display educational empty state graphics (not broken UI)
- [ ] T033 [P] Enable Chrome DevTools Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`, navigate through all 15 pages — verify zero animations play, all content renders immediately
- [X] T034 [P] Run `pnpm run typecheck` — fix any TypeScript errors
- [X] T035 [P] Run `pnpm run build` — verify production build completes without errors
- [ ] T036 [P] Source or create SVG illustrations for empty states and hero decorations, store in `artifacts/zu-connect/public/images/education/`
- [ ] T037 [P] Profile frame rate using Chrome DevTools Performance tab on mid-range mobile emulation — verify 60fps during scroll-triggered animations
- [ ] T038 [P] Measure page transition duration with `performance.now()` — verify all transitions complete under 300ms
- [ ] T039 [P] Measure hover response time using DevTools Event Listeners breakpoints — verify response within 100ms
- [ ] T040 [P] Run before/after screenshot comparison on all 15 pages — verify zero visual regressions (FR-012, SC-005)
- [ ] T041 [P] Verify responsive layout at CSS breakpoints 980px, 720px, 480px on all pages — no broken layouts (Constitution Principle IV)
- [ ] T042 [P] Verify mobile viewport on a real device or Chrome emulator — content renders correctly, no overflow, touch targets functional (Constitution Principle IV)
- [ ] T043 Run quickstart.md validation scenarios A through G end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 can run in parallel once Foundation is done
  - US3 and US4 can run in parallel once Foundation is done
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational — Independent from US1
- **User Story 3 (P2)**: Can start after Foundational — Independent from US1/US2
- **User Story 4 (P2)**: Can start after Foundational — Independent from US1/US2/US3

### Within Each User Story

- Setup tasks before page integration tasks
- Icon system tasks before visual polish tasks
- Component integration before animation refinement

### Parallel Opportunities

- All [P] tasks across all phases can run in parallel (no shared files)
- T007-T010 (US1 homepage) all in parallel — different sections of same file but non-overlapping
- T011-T015 (US2 icon system) all in parallel — different pages
- T016-T025 (US3 micro-animations) all in parallel — different pages
- T026-T031 (US4 loading states) all in parallel — different components/pages
- T032-T036 (Polish) can run after all stories complete

---

## Parallel Example: User Story 3 (Micro-Animations)

```bash
# Launch all hover/click animation tasks together (different files):
Task: "T016 [P] [US3] Add whileHover/whileTap to colleges.tsx"
Task: "T017 [P] [US3] Add whileHover/whileTap to news.tsx"
Task: "T018 [P] [US3] Add whileHover/whileTap to planner.tsx"
Task: "T019 [P] [US3] Add whileHover/whileTap to services.tsx"
Task: "T020 [P] [US3] Add whileHover/whileTap to faq.tsx"
Task: "T021 [P] [US3] Add whileHover/whileTap to chat.tsx"
Task: "T022 [P] [US3] Add whileHover/whileTap to members.tsx"
Task: "T023 [P] [US3] Add whileHover/whileTap to library.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — icon maps, animation variants, CSS tokens
2. Complete Phase 2: Foundational — skeleton integration, framer-motion on all pages
3. Complete Phase 3: User Story 1 — homepage hero with educational graphics + stat counters
4. **STOP and VALIDATE**: Test US1 independently — homepage loads with educational visuals, animated counters, parallax
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready (icon system, animation infrastructure)
2. Add US1 (Homepage) → Test independently → MVP complete!
3. Add US2 (Icon System) → Test independently → Core visual identity
4. Add US3 (Micro-Animations) → Test independently → Polished feel
5. Add US4 (Loading States) → Test independently → Production-ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (homepage hero + stat counters)
   - Developer B: User Story 2 (icon system across 4 pages)
   - Developer C: User Story 3 (micro-animations across 10 pages)
   - Developer D: User Story 4 (loading states across 6 pages)
3. All stories complete independently and integrate without conflicts
