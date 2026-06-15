# ADMIN IMPLEMENTATION PLAN

## Implementation Order

### Phase 0: Foundation (Estimated: 2-3 hours)

1. **Add new dependencies**
   - Frontend: `socket.io-client`
   - Backend: `socket.io`, `jsonwebtoken`, `node-telegram-bot-api`
   - Install via pnpm:

2. **Database schema additions**
   - Create migration files for new tables:
     - `admin_roles`, `admin_users`, `admin_events`
     - `audit_logs`, `activity_logs`
     - `announcements`, `integration_settings`, `system_settings`
     - `telegram_event_mappings`, `telegram_logs`
   - Run migration

3. **Seed admin roles and first super admin**
   - Seed 3 roles: super_admin, admin, moderator
   - Seed existing admin user (admin@zu.edu.ly) as super_admin

### Phase 1: Route Protection & Layout Shell (Estimated: 2-3 hours)

1. **Backend: Auth upgrade**
   - Add JWT_SECRET to .env.example
   - Update auth middleware to use JWT verify
   - Add `verifyPermission(permissionKey)` middleware
   - Update login route to sign JWT tokens

2. **Backend: Admin route mount**
   - Create `artifacts/api-server/src/routes/admin/` directory
   - Create `index.ts` as admin route aggregator
   - Mount under `/api/admin` in routes/index.ts

3. **Frontend: Admin guard component**
   - Create `AdminGuard.tsx` wrapper
   - Implement auth check + role check + redirect logic

4. **Frontend: Admin layout**
   - Create `admin/AdminLayout.tsx` with sidebar
   - Implement responsive sidebar (desktop fixed, mobile sheet)
   - Add admin topbar with user menu and connection indicator

5. **Frontend: Route registration**
   - Add admin routes to `App.tsx` Router
   - Wrap with AdminGuard + AdminLayout

### Phase 2: Data Models & State (Estimated: 1-2 hours)

1. **Backend: Admin API routes (skeleton)**
   - Create route handler files for each section
   - Implement basic CRUD for each entity
   - Add permission checks

2. **Frontend: Admin API hooks**
   - Create custom hooks or direct fetch utilities for admin API
   - Implement pagination, search, filter state management

3. **Frontend: Admin context**
   - Create `AdminContext.tsx` for admin-specific state
   - Current user permissions
   - Socket connection state
   - Global admin preferences

### Phase 3: Socket.io Realtime (Estimated: 2 hours)

1. **Backend: Socket.io server setup**
   - Initialize socket.io on HTTP server
   - Create admin namespace with auth middleware
   - Implement event emission helpers

2. **Frontend: Socket.io client setup**
   - Create `AdminSocket` service class
   - Implement connection management
   - Auto-connect on admin page mount
   - Reconnection with backoff

3. **Backend: Event wiring**
   - Add emit calls to existing route handlers
   - Create event triggers for new admin actions
   - Event persistence to admin_events table

### Phase 4: Telegram Integration (Estimated: 1-2 hours)

1. **Backend: Telegram service**
   - Create `TelegramService` class
   - Implement send, notifyEvent, throttling
   - Health check endpoint

2. **Backend: Event routing**
   - Wire Telegram notifications to key events
   - Implement message template rendering
   - Add failure handling and logging

3. **Frontend: Telegram settings UI**
   - Configuration form for bot token, chat ID
   - Event mapping configuration
   - Test message button
   - Send history log

### Phase 5: Dashboard Sections (Estimated: 4-6 hours)

1. **Overview Dashboard** - Summary cards, activity feed, charts
2. **Users** - Paginated list, search, role management, detail view
3. **Roles & Permissions** - Role CRUD, permission matrix
4. **Live Events** - Real-time event feed with filters
5. **Moderation Queue** - Tab-based status management, responses
6. **Complaints/Suggestions** - Detailed view with actions
7. **Referrals** - Overview stats, per-user breakdown
8. **Gamification** - Points management, leaderboard
9. **Announcements** - CRUD with publish/unpublish
10. **Files/Uploads** - File listing with metadata
11. **Activity Logs** - Filterable log with search
12. **Analytics** - Recharts dashboards for users, referrals, content
13. **Integrations** - Integration management panel
14. **Telegram Settings** - Bot config, event mapping, test
15. **System Settings** - Key-value settings manager
16. **Audit Trail** - Filterable, paginated audit log

### Phase 6: Permissions & Audit (Estimated: 1-2 hours)

1. **Backend: Permission enforcement**
   - Add permission checks to all admin routes
   - Implement permission caching

2. **Backend: Audit logging**
   - Add audit middleware
   - Wire to all admin mutations
   - Implement audit query API

3. **Frontend: Permission-based rendering**
   - Hide sidebar items without permission
   - Show/hide action buttons based on permissions

### Phase 7: Testing & Polish (Estimated: 1-2 hours)

1. **Access control testing**
   - Test all role levels against all sections
   - Verify public site has no admin exposure
   - Test token expiry and re-auth flow

2. **Responsiveness testing**
   - Test all pages at 480px, 768px, 1024px widths
   - Verify sidebar behavior on mobile

3. **Realtime testing**
   - Test socket.io connection, disconnection, reconnection
   - Verify event emission and receipt

## File Creation Checklist

### Backend (api-server)
- [ ] `src/routes/admin/index.ts` - Route aggregator
- [ ] `src/routes/admin/stats.ts` - Dashboard stats
- [ ] `src/routes/admin/users.ts` - User management
- [ ] `src/routes/admin/roles.ts` - Role management
- [ ] `src/routes/admin/moderation.ts` - Moderation queue
- [ ] `src/routes/admin/referrals.ts` - Referral management
- [ ] `src/routes/admin/gamification.ts` - Gamification
- [ ] `src/routes/admin/announcements.ts` - Announcements
- [ ] `src/routes/admin/files.ts` - File management
- [ ] `src/routes/admin/activity.ts` - Activity logs
- [ ] `src/routes/admin/analytics.ts` - Analytics data
- [ ] `src/routes/admin/integrations.ts` - Integration settings
- [ ] `src/routes/admin/telegram.ts` - Telegram config
- [ ] `src/routes/admin/settings.ts` - System settings
- [ ] `src/routes/admin/audit.ts` - Audit trail
- [ ] `src/routes/admin/content.ts` - Content CRUD (news, courses, etc.)
- [ ] `src/services/telegram.ts` - Telegram service
- [ ] `src/services/admin-socket.ts` - Socket.io admin namespace
- [ ] `src/middlewares/permission.ts` - Permission check middleware

### Frontend (zu-connect)
- [ ] `src/components/admin/AdminGuard.tsx` - Route guard
- [ ] `src/components/admin/AdminLayout.tsx` - Layout shell
- [ ] `src/components/admin/AdminSidebar.tsx` - Sidebar navigation
- [ ] `src/components/admin/AdminTopbar.tsx` - Topbar
- [ ] `src/components/admin/AdminSocket.ts` - Socket service
- [ ] `src/components/admin/AdminContext.tsx` - Admin state
- [ ] `src/components/admin/MetricCard.tsx` - Summary card
- [ ] `src/components/admin/DataTable.tsx` - Reusable data table
- [ ] `src/components/admin/StatusBadge.tsx` - Status indicators
- [ ] `src/components/admin/ActionDialog.tsx` - Confirm dialog
- [ ] `src/components/admin/LiveFeed.tsx` - Activity feed
- [ ] `src/pages/admin/Dashboard.tsx` - Overview
- [ ] `src/pages/admin/Users.tsx` - User management
- [ ] `src/pages/admin/UserDetail.tsx` - User detail
- [ ] `src/pages/admin/Roles.tsx` - Role management
- [ ] `src/pages/admin/LiveEvents.tsx` - Live events
- [ ] `src/pages/admin/Moderation.tsx` - Moderation queue
- [ ] `src/pages/admin/Complaints.tsx` - Complaints/Suggestions
- [ ] `src/pages/admin/Referrals.tsx` - Referral management
- [ ] `src/pages/admin/Gamification.tsx` - Gamification
- [ ] `src/pages/admin/Announcements.tsx` - Announcements
- [ ] `src/pages/admin/Files.tsx` - File management
- [ ] `src/pages/admin/Activity.tsx` - Activity logs
- [ ] `src/pages/admin/Analytics.tsx` - Analytics
- [ ] `src/pages/admin/Integrations.tsx` - Integrations
- [ ] `src/pages/admin/Telegram.tsx` - Telegram settings
- [ ] `src/pages/admin/Settings.tsx` - System settings
- [ ] `src/pages/admin/Audit.tsx` - Audit trail
