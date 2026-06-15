# ADMIN PROJECT AUDIT

## Project Overview

**Project**: ZU Connect — Zawiya Student Union Platform
**Stack**: React 19 + TypeScript + Vite + Wouter + TanStack Query + Drizzle ORM + PostgreSQL + Express 5
**Direction**: RTL (Arabic)
**Package Manager**: pnpm (workspace monorepo)

## Source Map

```
zu-connect/
├── artifacts/
│   ├── zu-connect/           # Frontend SPA (React + Vite)
│   │   └── src/
│   │       ├── App.tsx        # Root component with routing
│   │       ├── main.tsx       # Entry point
│   │       ├── pages/         # 16 page components
│   │       ├── components/    # UI, layout, referral, theme
│   │       ├── hooks/         # Custom hooks
│   │       ├── lib/           # Auth, utils, animations, icons
│   │       └── index.css      # Tailwind v4 + CSS variables
│   ├── api-server/            # Express backend
│   │   └── src/
│   │       ├── app.ts         # Express setup
│   │       ├── index.ts       # Server bootstrap
│   │       ├── routes/        # 15 route modules
│   │       ├── middlewares/   # Auth middleware
│   │       └── lib/           # Logger
│   └── mockup-sandbox/        # Design sandbox (not production)
├── lib/
│   ├── db/                    # Drizzle schema + seed
│   ├── api-client-react/      # Auto-generated React Query hooks
│   ├── api-zod/               # Zod validation schemas
│   └── api-spec/              # OpenAPI specification
└── specs/                     # Feature specifications
```

## Existing Authentication

- **Token format**: Base64url-encoded JSON (not JWT, no signature, no expiry)
- **Roles**: `"student" | "teacher" | "admin"` (string, stored in DB)
- **Storage**: localStorage("token") on frontend
- **Middleware**: `requireRole(...roles)` and `optionalAuth()` in Express
- **Auth context**: React context in `lib/auth/AuthContext.tsx`
- **Login**: POST `/api/auth/login` with `{ identifier, password, role }`

**Security concerns**: Plaintext passwords, unsigned tokens, no token expiry. Admin audit notes these as critical risks.

## Existing Routing (Frontend)

- **Library**: Wouter (`wouter`), hash-free routing
- **Structure**: `Switch` + `Route` components inside `Router()`
- **Layout**: All public routes wrapped in `AppLayout` (Topbar + Navbar + Footer)
- **Admin routes**: NONE exist currently

## Existing API Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /healthz | None | Health check |
| GET | /stats | optionalAuth | Platform statistics |
| GET | /news | optionalAuth | List news |
| POST | /news | requireRole("admin") | Create news |
| GET | /news/:id | optionalAuth | Single news |
| GET | /courses | optionalAuth | List courses |
| POST | /courses | requireRole("admin") | Create course |
| POST | /courses/:id/enroll | Any auth | Enroll |
| POST | /courses/:id/unenroll | Any auth | Unenroll |
| GET | /members | optionalAuth | List members |
| GET | /colleges | optionalAuth | List colleges |
| GET | /library | optionalAuth | Library resources |
| GET | /planner | optionalAuth | Planner events |
| GET | /chat/rooms | optionalAuth | Chat rooms |
| GET | /chat/rooms/:id/messages | Any auth | Messages |
| POST | /chat/rooms/:id/messages | Any auth | Send message |
| POST | /suggestions | None | Submit suggestion |
| POST | /volunteers | None | Register volunteer |
| GET | /faq | None | FAQ list |
| GET | /leadership | None | Leadership list |
| POST | /auth/login | None | Login |
| POST | /referrals/generate | Token | Generate code |
| POST | /referrals/regenerate | Token | Regenerate code |
| POST | /referrals/claim | None | Claim reward |
| GET | /referrals/stats | Token | Get stats |

## Existing Data Models (PostgreSQL via Drizzle)

**13 tables**: users, news, courses, members, colleges, library, planner, chat_rooms, chat_messages, faq, leadership, referrals, suggestions, volunteers

**Users table fields**: id, identifier, password, name, role (text), referralCode, points, createdAt

**No tables for**: permissions, roles (as entity), audit logs, announcements, admin settings, integrations, moderation, activity events

## Existing UI Component Library

**56+ reusable components** including: Button (5 variants), Card (6 sub-components), Badge (4 variants), Table (8 sub-components), Dialog (full set), Sidebar (full-featured ~727 lines), Tabs, Select, Input, Form (react-hook-form), DropdownMenu, Chart (Recharts), Skeleton, Pagination, Sheet, Toast/Sonner, ScrollArea, Avatar, etc.

**Custom components**: LottieAnimation, Empty, Spinner, referral components

## Existing Real-Time Infrastructure

**NONE**. Chat uses TanStack Query polling. No socket.io, WebSocket, SSE.

## Key Integration Points for Admin System

1. **App.tsx**: Add admin routes with guard component wrapping
2. **AuthContext.tsx**: Add permission checking utilities
3. **api-server routes/index.ts**: Mount admin route modules
4. **api-server middlewares/auth.ts**: Extend for granular permissions
5. **Frontend components/layout**: Create AdminLayout with sidebar
6. **DB schema**: Add new tables for admin-specific data
7. **API client**: Add admin-specific API endpoints and hooks
8. **New deps**: socket.io (client + server), node-telegram-bot-api
