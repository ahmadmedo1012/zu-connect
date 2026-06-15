# ADMIN ROLE AND PERMISSION MATRIX

## Role Hierarchy

```
super_admin (Level 100)
  └── admin (Level 50)
       └── moderator (Level 20)
```

## Built-in Roles

| Role | Level | Description |
|------|-------|-------------|
| super_admin | 100 | Full system access. Can manage roles, settings, and other admins |
| admin | 50 | Full operational access. Cannot manage roles or other admins |
| moderator | 20 | Limited to content moderation, complaints, and basic operations |

## Permission Definitions

Each permission is a string key. Roles have a set of permitted keys.

### Section Permissions

| Key | Description | super_admin | admin | moderator |
|-----|-------------|-------------|-------|-----------|
| admin.view | View dashboard overview | ✓ | ✓ | ✓ |
| admin.users | Manage users | ✓ | ✓ | ✗ |
| admin.roles | Manage roles & permissions | ✓ | ✗ | ✗ |
| admin.live | View live events | ✓ | ✓ | ✓ |
| admin.moderation | Moderate complaints/suggestions | ✓ | ✓ | ✓ |
| admin.complaints | Manage complaints detail | ✓ | ✓ | ✓ |
| admin.referrals | View referral data | ✓ | ✓ | ✗ |
| admin.gamification | Manage gamification | ✓ | ✓ | ✗ |
| admin.announcements | Manage announcements | ✓ | ✓ | ✓ |
| admin.files | View file uploads | ✓ | ✓ | ✗ |
| admin.activity | View activity logs | ✓ | ✓ | ✓ |
| admin.analytics | View analytics | ✓ | ✓ | ✓ |
| admin.integrations | Manage integrations | ✓ | ✗ | ✗ |
| admin.telegram | Manage Telegram settings | ✓ | ✗ | ✗ |
| admin.settings | Manage system settings | ✓ | ✗ | ✗ |
| admin.audit | View audit trail | ✓ | ✓ | ✗ |
| admin.content | Manage public content | ✓ | ✓ | ✗ |

### Action Permissions (Granular)

| Key | Description | super_admin | admin | moderator |
|-----|-------------|-------------|-------|-----------|
| admin.content.create | Create content items | ✓ | ✓ | ✗ |
| admin.content.edit | Edit any content | ✓ | ✓ | ✗ |
| admin.content.delete | Delete content | ✓ | ✓ | ✗ |
| admin.users.ban | Ban/suspend users | ✓ | ✓ | ✗ |
| admin.users.edit_role | Change user roles | ✓ | ✗ | ✗ |
| admin.moderation.resolve | Resolve moderation items | ✓ | ✓ | ✓ |
| admin.moderation.escalate | Escalate items | ✓ | ✓ | ✓ |
| admin.announcements.publish | Publish announcements | ✓ | ✓ | ✓ |
| admin.settings.system | Change system settings | ✓ | ✗ | ✗ |
| admin.settings.integrations | Change integration settings | ✓ | ✗ | ✗ |

## Data Model

### roles Table
```sql
CREATE TABLE admin_roles (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,       -- e.g., "super_admin", "admin", "moderator"
  label       TEXT NOT NULL,              -- Arabic label: "مدير عام", "مدير", "مشرف"
  level       INTEGER NOT NULL DEFAULT 0, -- 100, 50, 20
  permissions JSONB NOT NULL DEFAULT '[]',-- ["admin.view", "admin.users", ...]
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### admin_users Table (extends users)
```sql
CREATE TABLE admin_users (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id     INTEGER NOT NULL REFERENCES admin_roles(id),
  created_by  INTEGER REFERENCES users(id),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

## Permission Check Flow

```
1. User authenticates → token decoded → req.user set
2. Admin API route → requireRole("admin") checks user.role === "admin"
3. For granular checks → lookup admin_users by user_id → get role_id → get permissions from admin_roles
4. Check if required permission key exists in role's permissions JSONB array
5. Return 403 if permission missing
```

## Caching

- Role-permission mappings cached in-memory with 5-minute TTL
- Admin user role assignments cached with 1-minute TTL
- Cache invalidation on role/permission update
