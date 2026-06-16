# Implementation Plan: Loyalty System Enhancement

**Branch**: `006-loyalty-system-enhancement` | **Date**: 2026-06-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-loyalty-system-enhancement/spec.md`

## Summary

Enhance the existing points-and-referrals system into a full-featured loyalty platform. Add multi-action point earning (daily login, suggestions, sharing, events), a points history with filtering, a rewards catalog for redeeming points, achievement badges with auto-award, persisted user tiers, a leaderboard, and an admin management panel. The feature builds on the existing `users.points` and `referrals` tables by adding 8 new database tables and extending both the public user-facing UI and the private admin panel.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) — consistent with existing project

**Primary Dependencies**: Drizzle ORM (existing), Express 5 (existing), React 19 + Wouter (existing), Framer Motion (existing for animations), Recharts (existing for analytics charts)

**Storage**: PostgreSQL via NeonDB (existing) — new tables: `points_transactions`, `earning_actions`, `rewards`, `redemptions`, `achievements`, `user_achievements`, `tiers`, `loyalty_config`

**Testing**: Vitest (frontend existing), Supertest + Vitest (backend existing)

**Target Platform**: Web (desktop + mobile) — same as existing platform

**Project Type**: Full-stack web application (monorepo with `artifacts/api-server` backend + `artifacts/zu-connect` frontend + `lib/db` database schema)

**Performance Goals**: Points history page loads in under 2s for 100k transactions; leaderboard loads in under 2s with caching; reward redemption completes in under 1s

**Constraints**: RTL Arabic-first layout (constitution); all new tables go through Drizzle ORM; existing `users.points` column remains SSOT; no raw SQL

**Scale/Scope**: ~10k registered users; ~100k points transactions; ~50 rewards; ~20 achievements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Notes |
|-----------|------------|-------|
| I. Arabic-First & RTL | ✅ PASS | All UI text in Arabic, `dir="rtl"` layout, Cairo font family |
| II. Real Data Layer | ✅ PASS | All loyalty data persisted in PostgreSQL via Drizzle ORM; no localStorage |
| III. Authoritative Content | ✅ PASS (N/A) | Loyalty configuration is admin-defined, not union-authoritative content |
| IV. Mobile-First Delivery | ✅ PASS | All new user-facing pages responsive at 480/720/980px breakpoints |
| V. Defensive Supply Chain | ✅ PASS | No new external dependencies; all within existing project scope |
| Technical Standards | ✅ PASS | TypeScript strict mode, Drizzle ORM, Zod v4 validation, pnpm catalog |

**GATE RESULT**: ✅ PASS — all 6 gates pass. No violations needing complexity justification.

## Project Structure

### Documentation (this feature)

```text
specs/006-loyalty-system-enhancement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
lib/db/src/schema/
├── points-transactions.ts    # NEW — points history
├── earning-actions.ts        # NEW — configurable earning actions
├── rewards.ts                # NEW — rewards catalog
├── redemptions.ts            # NEW — reward redemptions
├── achievements.ts           # NEW — achievement definitions
├── user-achievements.ts      # NEW — user achievement awards
├── tiers.ts                  # NEW — persisted tier definitions
├── loyalty-config.ts         # NEW — global loyalty settings

artifacts/api-server/src/routes/
├── loyalty.ts                # NEW — public loyalty endpoints
└── admin/
    └── loyalty.ts            # NEW — admin loyalty management endpoints

artifacts/api-server/src/routes/admin/
├── gamification.ts           # ENHANCE — add points management, reward/adjust/analytics
└── referrals.ts              # ENHANCE — update to use configurable point values

artifacts/zu-connect/src/
├── pages/
│   ├── Loyalty.tsx           # NEW — user-facing loyalty dashboard
│   ├── Rewards.tsx           # NEW — rewards catalog + redemption
│   └── Leaderboard.tsx       # NEW — platform leaderboard
├── pages/admin/
│   └── Loyalty.tsx           # NEW — admin loyalty management
├── components/
│   └── loyalty/              # NEW — reusable loyalty components
└── hooks/
    └── use-loyalty.ts        # NEW — loyalty data hooks
```

**Structure Decision**: Follows the existing monorepo convention — schema in `lib/db`, backend routes in `artifacts/api-server/src/routes`, frontend pages in `artifacts/zu-connect/src/pages`. Public routes go in `routes/loyalty.ts`, admin routes in `routes/admin/loyalty.ts`.

## Implementation Status

| Phase | Status | Key Deliverables |
|-------|--------|-----------------|
| Phase 1 (Setup) | ✅ Complete | Seed data: 8 actions, 4 tiers, 6 achievements, 5 config values |
| Phase 2 (Schema) | ✅ Complete | 9 tables created & pushed to NeonDB |
| Phase 3 (US1 — Points) | ✅ Complete | `loyalty.ts` service, claim endpoint, auth/referral/suggestion integrations, `use-loyalty` hooks, login toast |
| Phase 4 (US2 — History) | ✅ Complete | stats/transactions endpoints, Loyalty dashboard, LoyaltyHistory page, nav link |
| Phase 5 (US3 — Rewards) | ✅ Complete | rewards/redemption endpoints, Rewards catalog page, confirmation dialog |
| Phase 6 (US4 — Badges) | ✅ Complete | `checkAchievements` service, badges on dashboard & profile, notification toasts |
| Phase 7 (US5 — Admin) | ✅ Complete | Full CRUD for actions/rewards/achievements/tiers/config, redemptions queue, manual adjustment, admin page with 7 tabs |
| Phase 8 (US6 — Leaderboard) | ✅ Complete | Leaderboard sorted by points/referrals/achievements, highlighted current user |
| Phase 9 (Polish) | 🔄 In progress | Rate-limit, expiry cron, loading/error/empty states, RTL |

## Complexity Tracking

No constitution violations. Table intentionally left empty.
