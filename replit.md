# ZU Connect — منصة طلبة جامعة الزاوية

Arabic RTL student platform for the General Union of Zawia University Students. Dark editorial design (MasterClass-inspired) with full Arabic content.

## Run & Operate

- `pnpm --filter @workspace/zu-connect run dev` — run the frontend (port assigned by env)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, framer-motion, wouter, Cairo font
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Frontend pages: `artifacts/zu-connect/src/pages/`
- Frontend components: `artifacts/zu-connect/src/components/`
- API routes: `artifacts/api-server/src/routes/`
- DB schema: `lib/db/src/schema/` (one file per entity)
- OpenAPI spec: `lib/api-spec/openapi.yaml`
- Generated hooks: `lib/api-client-react/src/generated/`
- Image assets: `attached_assets/` (logo IMG_0792, campus IMG_0793)

## Architecture decisions

- MasterClass Dark Editorial design: pure black (#000) background, red (#E32652) accent, charcoal (#1F2125) surfaces
- Full Arabic RTL: dir="rtl" on html, Cairo Google font, all text in Arabic
- Frontend is fully static (no SSR) — connects to Express backend at /api
- Course enrollment tracked in DB (enrolledCount increments/decrements per API call)
- Chat rooms and messages persisted in PostgreSQL (no WebSocket — polling)
- Suggestions and volunteer registrations stored in DB

## Product

- **الرئيسية**: Hero + stats row + leadership board (navy/gold) + news + AI assistant
- **عن الاتحاد**: Mission, vision 2030, historical timeline 2008→2026
- **أعضاء الاتحاد**: Filterable union council directory (16 members)
- **الكليات**: 14 university faculties with student counts
- **الأخبار**: News feed with category filtering
- **الدورات التدريبية**: 9 training courses with enroll/unenroll
- **الأنشطة القادمة**: Month-tabbed activity planner
- **غرف النقاش**: 7 multi-room chat with real messages
- **الخدمات**: Service tiles linking to all major sections
- **اقترح / تواصل**: Suggestion/complaint form
- **تطوع معنا**: Volunteer registration (6 categories)
- **الأسئلة الشائعة**: FAQ accordion (10 items)
- **المكتبة**: 10 digital library resources with type filters
- **الدخول**: 3-role login (student/teacher/admin), simulated

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change: run `pnpm --filter @workspace/api-spec run codegen` before touching frontend or backend
- Cairo font import must be the FIRST line in index.css (before @import "tailwindcss")
- All frontend routes use BASE_URL prefix via wouter Router base prop
- Courses enrollment uses `studentId: "guest"` for unauthenticated users

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
