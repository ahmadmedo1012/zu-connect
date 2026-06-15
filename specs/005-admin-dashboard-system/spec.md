# Feature Specification: Admin Dashboard System

**Feature Branch**: `005-admin-dashboard-system`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Build a complete private admin system at the /admin route for the Zawiya Student Union platform. Must be hidden from public navigation, with role-based permissions, real-time updates via socket.io, Telegram notifications, activity monitoring, moderation queues, user management, content management, gamification, referral management, announcements, analytics, system logs, integrations, and audit trail."

## User Scenarios & Testing

### User Story 1 - Admin Accesses Private Console (Priority: P1)

An authorized admin user navigates to `/admin` and sees a full operations dashboard without any public site chrome (navbar, public footer). The admin route is completely invisible to non-admin users and does not appear in public navigation.

**Why this priority**: Core requirement — without private access, the admin system is not secure. This is the foundation for all other features.

**Independent Test**: Can be fully tested by logging in as admin, navigating to `/admin`, and verifying the dashboard renders with admin-specific layout. Logging in as student/teacher and accessing `/admin` should redirect to public pages or show forbidden.

**Acceptance Scenarios**:

1. **Given** a user is logged in with role "admin", **When** they navigate to `/admin`, **Then** they see the admin dashboard with sidebar navigation
2. **Given** a user is logged in with role "student", **When** they navigate to `/admin`, **Then** they are redirected to the home page
3. **Given** an unauthenticated user, **When** they navigate to `/admin`, **Then** they are redirected to the login page
4. **Given** an admin user on any public page, **When** inspecting page navigation, **Then** no link to `/admin` is visible

---

### User Story 2 - Admin Manages Platform Content (Priority: P1)

An admin can view, create, edit, and delete platform content (news, courses, members, colleges, library resources, planner events, FAQ, leadership) through the admin console without accessing the database directly.

**Why this priority**: Content management is the primary operational need for union administrators to keep the platform up to date.

**Independent Test**: Can be tested by logging in as admin, navigating to content sections, performing CRUD operations, and verifying changes appear on the public site.

**Acceptance Scenarios**:

1. **Given** an admin is on the News management page, **When** they create a new news item, **Then** it appears on the public news page
2. **Given** an admin is on the Courses management page, **When** they update a course's details, **Then** the public course page reflects the change
3. **Given** an admin is on the Members management page, **When** they delete a member, **Then** that member no longer appears on the public members page
4. **Given** a non-admin user, **When** they attempt to POST to content endpoints, **Then** they receive a 403 Forbidden response

---

### User Story 3 - Admin Monitors User Activity and Referrals (Priority: P2)

An admin can view all registered users, their roles, activity logs, and referral statistics. The admin can manage user roles and view detailed user profiles.

**Why this priority**: User oversight is critical for a student union platform to ensure proper access and track engagement.

**Independent Test**: Can be tested by viewing the Users section with admin role, verifying user data is displayed accurately.

**Acceptance Scenarios**:

1. **Given** an admin is on the Users management page, **When** they view the users list, **Then** they see all users with name, role, points, and join date
2. **Given** an admin is on a specific user's detail page, **When** they view referral stats, **Then** they see referral code, count, and points earned
3. **Given** an admin wants to change a user's role, **When** they update the role, **Then** the change takes effect immediately
4. **Given** an admin views the activity log, **When** filtering by date range, **Then** only relevant activities are shown

---

### User Story 4 - Admin Receives Real-Time Notifications (Priority: P2)

The admin dashboard shows live updates for new registrations, referrals, complaints, and system events. The admin does not need to refresh the page to see new activity.

**Why this priority**: Real-time awareness is essential for responsive platform management.

**Independent Test**: Can be tested by performing actions as a non-admin user (e.g., submitting a complaint) and verifying the admin dashboard updates in real-time.

**Acceptance Scenarios**:

1. **Given** an admin is viewing the admin dashboard, **When** a new user registers, **Then** a live event card appears in the activity feed
2. **Given** an admin is viewing the moderation queue, **When** a new complaint is submitted, **Then** it appears in the queue without page refresh
3. **Given** socket.io connection drops, **When** reconnection occurs, **Then** missed events are caught up and displayed

---

### User Story 5 - Admin Manages Moderation Queue (Priority: P2)

An admin can view, review, and respond to complaints and suggestions submitted by users. Items can be marked as resolved, escalated, or archived.

**Why this priority**: The complaints/suggestions system is a core feature of the union platform that requires active moderation.

**Independent Test**: Can be tested by submitting a complaint as a public user, then reviewing and resolving it as an admin.

**Acceptance Scenarios**:

1. **Given** an admin is on the Moderation page, **When** they view pending items, **Then** they see a list of unresolved complaints/suggestions
2. **Given** an admin reviews a complaint, **When** they mark it as resolved, **Then** the status updates and the item moves to the resolved tab
3. **Given** an admin wants to respond, **When** they submit a reply, **Then** the user sees the response when viewing their complaint

---

### User Story 6 - Admin Receives Telegram Notifications (Priority: P3)

Critical events (new user registration, referral reward, complaint escalation) trigger notifications sent to a configured Telegram chat or group.

**Why this priority**: Telegram is the primary communication channel for the union; instant notifications enable rapid response.

**Independent Test**: Can be tested by triggering a critical event and verifying the Telegram message appears in the configured group chat.

**Acceptance Scenarios**:

1. **Given** Telegram integration is configured, **When** a new user registers, **Then** a notification is sent to the configured Telegram chat
2. **Given** a complaint is filed with specific keywords, **When** the complaint is flagged as urgent, **Then** an alert is sent via Telegram
3. **Given** Telegram API is unavailable, **When** a notification should be sent, **Then** the failure is logged and the system continues without disruption

---

### User Story 7 - Admin Views Analytics and Reports (Priority: P3)

The admin dashboard displays charts and metrics for platform usage, user growth, referral performance, content popularity, and engagement trends.

**Why this priority**: Data-driven decisions require visibility into platform metrics, but the analytics can be added incrementally.

**Independent Test**: Can be tested by navigating to the Analytics section and verifying charts render with accurate data from the database.

**Acceptance Scenarios**:

1. **Given** an admin is on the Analytics page, **When** the page loads, **Then** they see summary cards (total users, active users, referrals, content items)
2. **Given** an admin views the users chart, **When** they select a date range, **Then** the chart updates to show registrations over that period
3. **Given** an admin exports analytics data, **When** they click export, **Then** a CSV file is downloaded with the current data

---

### Edge Cases

- What happens when an admin session expires while on the dashboard? Redirect to login with a message.
- How does the system handle Telegram API rate limits? Messages are queued and throttled.
- What happens when socket.io connection is lost? Dashboard shows a "Reconnecting..." indicator and retries with exponential backoff.
- How are permissions enforced when a user's role changes mid-session? Token-based permissions require re-login; the system checks server-side on each API call.
- What if an admin navigates directly to a section they don't have permission for? A 403 error page is shown with navigation back to the dashboard.
- How does pagination work for large datasets (users, logs, referrals)? Server-side pagination with configurable page size (default 20).
- What happens when the database is unavailable? The dashboard shows a maintenance mode message with the last cached data where possible.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a private `/admin` route that is inaccessible to non-admin users
- **FR-002**: Admin layout MUST be separate from the public AppLayout (no public navbar, topbar, or footer)
- **FR-003**: Admin sidebar MUST contain navigation to all admin sections
- **FR-004**: System MUST support role-based access control with at least 3 levels: super-admin, admin, moderator
- **FR-005**: Each admin section MUST check permissions before rendering content
- **FR-006**: System MUST support CRUD operations for news, courses, members, colleges, library, planner, FAQ, and leadership
- **FR-007**: System MUST display a paginated list of all registered users with search and filter
- **FR-008**: Admin MUST be able to view and update user roles
- **FR-009**: System MUST display referral statistics per user and overall
- **FR-010**: System MUST show a moderation queue for complaints and suggestions with status management
- **FR-011**: System MUST support marking items as pending, in-review, resolved, or rejected
- **FR-012**: System MUST include a real-time activity feed using socket.io
- **FR-013**: Socket.io connection MUST handle reconnection with exponential backoff
- **FR-014**: System MUST support Telegram notifications for configurable event types
- **FR-015**: Telegram integration MUST handle API failures gracefully
- **FR-016**: System MUST log all admin actions in an audit trail
- **FR-017**: Audit logs MUST include user, action, target, timestamp, and IP address
- **FR-018**: System MUST provide summary cards on the dashboard overview (users, content, referrals, events)
- **FR-019**: System MUST support announcement creation and publishing
- **FR-020**: System MUST track and display gamification statistics
- **FR-021**: System MUST provide analytics with charts for user growth, referrals, and content engagement
- **FR-022**: Admin settings MUST support configuring integration credentials (Telegram bot token, chat ID)
- **FR-023**: System settings MUST be manageable through the admin interface
- **FR-024**: System MUST show a live events page with recent platform activity
- **FR-025**: Admin MUST be able to view and manage file uploads
- **FR-026**: All admin API routes MUST be protected with `requireRole` middleware
- **FR-027**: Admin UI MUST be fully responsive for mobile and desktop
- **FR-028**: Admin pages MUST use the existing design system (CSS variables, shadcn components)
- **FR-029**: System MUST NOT expose admin navigation or links in the public-facing site
- **FR-030**: Admin dashboard MUST be RTL-compatible with Arabic language support

### Key Entities

- **AdminUser**: User with administrative role; extends the base User with permission flags and access level
- **Role**: Access level definition (super-admin, admin, moderator) with associated permission set
- **Permission**: Granular access right for specific admin sections/actions
- **AuditLog**: Record of admin actions including user, action type, target, details, timestamp, IP address
- **RealtimeEvent**: Event emitted via socket.io for live updates; includes type, payload, timestamp
- **TelegramNotification**: Configuration for which events trigger Telegram messages and message templates
- **ModerationItem**: Complaint or suggestion with status tracking (pending, in-review, resolved, rejected)
- **DashboardMetric**: Cached or computed summary statistic for dashboard display
- **IntegrationSetting**: External service configuration (Telegram bot token, chat ID, API keys)
- **SystemSetting**: Platform configuration key-value pairs managed through admin interface
- **Announcement**: Platform-wide announcement with publish/unpublish, priority, and expiration
- **GamificationStats**: Points, ranks, badges, and achievement data across all users

## Success Criteria

### Measurable Outcomes

- **SC-001**: Authorized admin users can access the full dashboard within 2 seconds of navigating to `/admin`
- **SC-002**: Real-time events appear in the admin activity feed within 1 second of occurring on the platform
- **SC-003**: Admin can complete a content CRUD operation (create news item) in under 30 seconds
- **SC-004**: Unauthorized users cannot access any admin page or API endpoint (100% of attempts blocked)
- **SC-005**: Telegram notifications for critical events are delivered within 5 seconds
- **SC-006**: Admin dashboard loads and functions correctly on mobile viewports (320px-480px width)
- **SC-007**: No admin links or navigation appear in the public site after thorough accessibility audit
- **SC-008**: All admin API endpoints return appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- **SC-009**: Socket.io reconnection succeeds within 10 seconds of connection loss
- **SC-010**: Audit trail captures 100% of admin mutations with complete metadata

## Assumptions

- Admin users are created via database seed or direct DB access (no self-registration for admin)
- Existing base64url token authentication system will be used for admin auth (future upgrade to JWT noted)
- The existing Drizzle ORM + PostgreSQL database will host new admin-related tables
- Existing shadcn UI components (Button, Card, Table, Dialog, Badge, Sidebar, Tabs, Select, Input) will be reused
- Recharts library (already in dependencies) will be used for analytics charts
- Socket.io will be added as new dependency to both frontend and backend
- Telegram bot token will be stored as environment variable (not in database)
- The existing Sidebar component will be adapted for the admin layout
- Admin-specific routes will be added to the existing Wouter-based routing setup
- The existing AuthContext will be extended to support permission checking
- Existing API routes index will be extended with admin-specific route modules
- Mobile responsiveness will follow the existing CSS breakpoints (980px, 720px, 480px)
- The existing `requireRole` middleware will be adapted for granular permission checks
- The feature uses `sequential` numbering — previous specs: 001-local-setup-polish, 002-education-visual-enhancement, 003-access-control, 004-blue-color-scheme
