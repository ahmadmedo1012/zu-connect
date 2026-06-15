# ADMIN ROUTE AND ACCESS MAP

## Frontend Routes (Wouter)

All admin routes are mounted under `/admin` and gated by an `AdminGuard` component.

### Route Table

| Path | Section | Permission Required | Page Component |
|------|---------|-------------------|----------------|
| /admin | Dashboard Overview | admin.view | AdminDashboard |
| /admin/users | User Management | admin.users | AdminUsers |
| /admin/users/:id | User Detail | admin.users | AdminUserDetail |
| /admin/roles | Roles & Permissions | admin.roles | AdminRoles |
| /admin/live | Live Events | admin.live | AdminLiveEvents |
| /admin/moderation | Moderation Queue | admin.moderation | AdminModeration |
| /admin/complaints | Complaints/Suggestions | admin.complaints | AdminComplaints |
| /admin/referrals | Referral Management | admin.referrals | AdminReferrals |
| /admin/gamification | Gamification | admin.gamification | AdminGamification |
| /admin/announcements | Announcements | admin.announcements | AdminAnnouncements |
| /admin/files | Files/Uploads | admin.files | AdminFiles |
| /admin/activity | Activity Logs | admin.activity | AdminActivity |
| /admin/analytics | Analytics | admin.analytics | AdminAnalytics |
| /admin/integrations | Integrations | admin.integrations | AdminIntegrations |
| /admin/telegram | Telegram Settings | admin.telegram | AdminTelegram |
| /admin/settings | System Settings | admin.settings | AdminSettings |
| /admin/audit | Audit Trail | admin.audit | AdminAudit |

### Route Guard Logic

```
AdminGuard:
  if (user === null) → redirect to /login
  if (user.role !== "admin" && user.role !== "super_admin") → redirect to /
  if (requiredPermission && !hasPermission(user, requiredPermission)) → show 403
  else → render children (admin layout + page)
```

### API Routes (Backend)

All admin API routes are mounted under `/api/admin` and protected by `requireRole("admin")` (or granular permission check).

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | /api/admin/stats | admin.view | Dashboard summary stats |
| GET | /api/admin/users | admin.users | List users (paginated) |
| GET | /api/admin/users/:id | admin.users | Get user detail |
| PUT | /api/admin/users/:id/role | admin.users | Update user role |
| GET | /api/admin/users/:id/referrals | admin.users | User referral details |
| GET | /api/admin/roles | admin.roles | List roles |
| POST | /api/admin/roles | admin.roles | Create role |
| PUT | /api/admin/roles/:id | admin.roles | Update role |
| DELETE | /api/admin/roles/:id | admin.roles | Delete role |
| GET | /api/admin/permissions | admin.roles | List all permissions |
| GET | /api/admin/live/events | admin.live | Recent live events |
| GET | /api/admin/moderation | admin.moderation | List moderation items |
| PUT | /api/admin/moderation/:id | admin.moderation | Update moderation status |
| POST | /api/admin/moderation/:id/respond | admin.moderation | Respond to item |
| GET | /api/admin/referrals | admin.referrals | All referrals (paginated) |
| GET | /api/admin/referrals/stats | admin.referrals | Referral summary stats |
| GET | /api/admin/gamification | admin.gamification | Gamification stats |
| POST | /api/admin/gamification/points | admin.gamification | Adjust user points |
| GET | /api/admin/announcements | admin.announcements | List announcements |
| POST | /api/admin/announcements | admin.announcements | Create announcement |
| PUT | /api/admin/announcements/:id | admin.announcements | Update announcement |
| DELETE | /api/admin/announcements/:id | admin.announcements | Delete announcement |
| GET | /api/admin/files | admin.files | List uploaded files |
| GET | /api/admin/activity | admin.activity | Activity log (paginated) |
| GET | /api/admin/analytics | admin.analytics | Analytics data |
| GET | /api/admin/integrations | admin.integrations | List integrations |
| PUT | /api/admin/integrations/:key | admin.integrations | Update integration |
| GET | /api/admin/telegram/config | admin.telegram | Get Telegram config |
| PUT | /api/admin/telegram/config | admin.telegram | Update Telegram config |
| POST | /api/admin/telegram/test | admin.telegram | Send test message |
| GET | /api/admin/settings | admin.settings | List system settings |
| PUT | /api/admin/settings/:key | admin.settings | Update setting |
| GET | /api/admin/audit | admin.audit | Audit trail (paginated) |
| POST | /api/admin/news | admin.content | Create news |
| PUT | /api/admin/news/:id | admin.content | Update news |
| DELETE | /api/admin/news/:id | admin.content | Delete news |
| POST | /api/admin/courses | admin.content | Create course |
| PUT | /api/admin/courses/:id | admin.content | Update course |
| DELETE | /api/admin/courses/:id | admin.content | Delete course |
| POST | /api/admin/members | admin.content | Create member |
| PUT | /api/admin/members/:id | admin.content | Update member |
| DELETE | /api/admin/members/:id | admin.content | Delete member |
| POST | /api/admin/colleges | admin.content | Create college |
| PUT | /api/admin/colleges/:id | admin.content | Update college |
| DELETE | /api/admin/colleges/:id | admin.content | Delete college |
| POST | /api/admin/library | admin.content | Create library item |
| PUT | /api/admin/library/:id | admin.content | Update library item |
| DELETE | /api/admin/library/:id | admin.content | Delete library item |
| POST | /api/admin/planner | admin.content | Create planner event |
| PUT | /api/admin/planner/:id | admin.content | Update planner event |
| DELETE | /api/admin/planner/:id | admin.content | Delete planner event |
| POST | /api/admin/faq | admin.content | Create FAQ |
| PUT | /api/admin/faq/:id | admin.content | Update FAQ |
| DELETE | /api/admin/faq/:id | admin.content | Delete FAQ |
| POST | /api/admin/leadership | admin.content | Create leadership entry |
| PUT | /api/admin/leadership/:id | admin.content | Update leadership |
| DELETE | /api/admin/leadership/:id | admin.content | Delete leadership |
