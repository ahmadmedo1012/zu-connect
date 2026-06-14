# Quickstart: Local Setup & Polish

## Prerequisites

- **Node.js** 24+ (check with `node --version`)
- **pnpm** 10+ (install: `npm install -g pnpm` or `corepack enable && corepack prepare pnpm@latest --activate`)
- **PostgreSQL** access to the Neon database (connection string provided)

## Setup Steps

### 1. Clone and Install

```sh
git clone <repo-url> zu-connect
cd zu-connect
pnpm install
```

### 2. Configure Environment

Create `.env` at the repository root:

```sh
PORT=3000
BASE_PATH=/
DATABASE_URL=postgresql://neondb_owner:npg_pP85vKXZhTSU@ep-long-credit-ateodl4n-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. Push Database Schema

```sh
pnpm --filter @workspace/db run push
```

This applies the Drizzle ORM schema to the Neon database.

### 4. Start API Server (terminal 1)

```sh
pnpm --filter @workspace/api-server run dev
```

Expected output: `Server listening on port 3000`

### 5. Start Frontend (terminal 2)

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/zu-connect run dev
```

Expected output: Vite dev server running on `http://localhost:5173`

### 6. Verify

Open `http://localhost:5173` — the homepage should load with:
- Header with "ZU Connect" title and navigation
- Hero section with campus image
- Stats row (student count, colleges, activities, library files)
- Leadership board with navy/gold cards
- Latest news section
- Activity planner sidebar
- AI assistant chat widget

## Validation Scenarios

### Scenario A: Data Persistence
1. Navigate to "اقترح / تواصل" (Suggestions)
2. Fill in name, select "اقتراح", write a message, submit
3. Refresh the page
4. The submission is stored and would appear in admin view

### Scenario B: Course Enrollment
1. Navigate to "الدورات التدريبية" (Courses)
2. Click "تسجيل" on a course with available seats
3. Confirm enrollment
4. Refresh — seat count decremented, user remains enrolled

### Scenario C: Chat Messages
1. Navigate to "غرف النقاش" (Chat)
2. Select a room (e.g., الغرفة العامة)
3. Type a message and send
4. Refresh the page, select the same room
5. Message appears in conversation history

### Scenario D: All Pages Load
1. Click through every navigation link
2. Verify no console errors (F12 → Console tab)
3. Each section renders with content

### Scenario E: Visual Polish
1. Navigate between sections — observe smooth page transitions
2. Hover over cards and buttons — observe visual feedback
3. Scroll through long content lists — observe staggered reveal animations
4. Verify that `prefers-reduced-motion` disables animations

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| Database connection error | `DATABASE_URL` not set or invalid | Check `.env` file and connection string |
| Frontend won't start | `PORT` or `BASE_PATH` missing | Set both env vars before running |
| API server fails | `PORT` conflict or DB unreachable | Check port availability, verify DB |
| Typecheck errors | Stale build artifacts | Run `pnpm run typecheck:libs` first |
