# Implementation Plan: Local Setup & Polish

**Branch**: `` | **Date**: 2026-06-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-local-setup-polish/spec.md`

## Summary

Make the ZU Connect platform fully runnable locally with a Neon PostgreSQL
database backend, complete the visual design with framer-motion animations,
fix existing bugs, and ensure all 15 pages and API endpoints work correctly.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24, pnpm 10

**Primary Dependencies**: React 19 + Vite 7 (frontend), Express 5 (API),
Drizzle ORM 0.45 + pg (database), framer-motion 12 (animations),
Tailwind CSS 4 + tw-animate-css (styling), Zod 3 (validation),
TanStack React Query 5 (data fetching), wouter 3 (routing), Zod 4 (zod/v4)

**Storage**: PostgreSQL 16 (Neon) via Drizzle ORM with drizzle-kit migrations

**Testing**: TypeScript typecheck (`pnpm run typecheck:libs`),
runtime validation via Zod schemas, manual integration verification

**Target Platform**: Web (React SPA frontend + Express REST API)

**Project Type**: Web application — monorepo with frontend (`artifacts/zu-connect`),
API server (`artifacts/api-server`), shared libraries (`lib/db`, `lib/api-zod`,
`lib/api-client-react`, `lib/api-spec`)

**Performance Goals**: Page transitions <300ms, scroll animations at 60fps,
API responses <500ms for standard queries, form submissions acknowledged <1s

**Constraints**: Arabic RTL layout (`dir="rtl"`), Cairo font family,
MasterClass Dark Editorial design system (black #000, red #E32652 accent,
charcoal #1F2125 surfaces), respects `prefers-reduced-motion`

**Scale/Scope**: ~5,240 students across 14 faculties, 15 frontend pages,
13 API route modules, 11 database entity schemas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

All five principles align with this feature:

- **I. Arabic-First & RTL** — Existing layout is Arabic RTL; animations
  must not break RTL flow. No violations.
- **II. Real Data Layer** — Core purpose: replace localStorage simulation
  with persistent Neon PostgreSQL. Full alignment.
- **III. Authoritative Content** — Data models already defined from
  authoritative sources; this feature connects them to the database.
  No violations.
- **IV. Mobile-First Delivery** — Animations and effects must perform
  well on mobile; `prefers-reduced-motion` respected. No violations.
- **V. Defensive Supply Chain** — No new untrusted dependencies or
  minimum-release-age changes needed. No violations.

**Result**: ✅ PASS — no constitutional violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/001-local-setup-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
artifacts/
├── api-server/          # Express REST API
│   ├── src/
│   │   ├── routes/      # 13 route modules (news, courses, chat, etc.)
│   │   ├── lib/         # Logger, middleware helpers
│   │   ├── app.ts       # Express app setup
│   │   └── index.ts     # Server entry point
│   └── build.mjs        # esbuild bundler
├── zu-connect/          # React frontend SPA
│   ├── src/
│   │   ├── pages/       # 15 page components
│   │   ├── components/  # UI + layout components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities
│   │   ├── App.tsx      # Route definitions
│   │   ├── main.tsx     # Entry point
│   │   └── index.css    # Tailwind + design tokens
│   └── vite.config.ts   # Vite build config
lib/
├── db/                  # Database schema + Drizzle ORM
│   ├── src/schema/      # 11 entity schemas
│   └── drizzle.config.ts
├── api-spec/            # OpenAPI specification
│   └── openapi.yaml
├── api-zod/             # Zod validation schemas from spec
└── api-client-react/    # Auto-generated React Query hooks
```

## Complexity Tracking

No constitutional violations — Complexity Tracking not required.
