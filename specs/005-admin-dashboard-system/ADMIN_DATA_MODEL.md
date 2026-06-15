# ADMIN DATA MODEL

## Database Tables (New, to be added to Drizzle schema)

### 1. admin_roles

```typescript
export const adminRolesTable = pgTable("admin_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),       // "super_admin", "admin", "moderator"
  label: text("label").notNull(),              // "مدير عام", "مدير", "مشرف"
  level: integer("level").notNull().default(0),
  permissions: jsonb("permissions").notNull().default([]),  // string[]
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 2. admin_users

```typescript
export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  roleId: integer("role_id").notNull().references(() => adminRolesTable.id),
  createdBy: integer("created_by").references(() => usersTable.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 3. admin_events (realtime event persistence)

```typescript
export const adminEventsTable = pgTable("admin_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Index
export const adminEventsIndex = index("idx_admin_events_created").on(adminEventsTable.createdAt);
```

### 4. audit_logs

```typescript
export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  userName: text("user_name").notNull(),
  action: text("action").notNull(),            // "create", "update", "delete", "login", "publish"
  entity: text("entity").notNull(),            // "news", "user", "role", "announcement", etc.
  entityId: integer("entity_id"),
  details: jsonb("details"),                    // Change details / metadata
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogsActionIndex = index("idx_audit_logs_action").on(auditLogsTable.action);
export const auditLogsCreatedIndex = index("idx_audit_logs_created").on(auditLogsTable.createdAt.desc());
```

### 5. announcements

```typescript
export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority").notNull().default("normal"), // "low", "normal", "high", "urgent"
  status: text("status").notNull().default("draft"),      // "draft", "published", "archived"
  publishedById: integer("published_by_id").references(() => usersTable.id),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### 6. integration_settings

```typescript
export const integrationSettingsTable = pgTable("integration_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),        // "telegram_bot_token", "telegram_chat_id"
  value: text("value"),                        // Encrypted for secrets
  type: text("type").notNull().default("string"), // "string", "password", "number", "boolean"
  category: text("category").notNull(),        // "telegram", "email", "storage"
  description: text("description"),
  isSecret: boolean("is_secret").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### 7. system_settings

```typescript
export const systemSettingsTable = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),        // "site_name", "maintenance_mode", "max_upload_size"
  value: jsonb("value").notNull(),
  type: text("type").notNull().default("string"), // "string", "number", "boolean", "json"
  category: text("category").notNull().default("general"), // "general", "security", "features"
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### 8. telegram_event_mappings

```typescript
export const telegramEventMappingsTable = pgTable("telegram_event_mappings", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull().unique(),
  enabled: boolean("enabled").notNull().default(false),
  chatId: text("chat_id"),
  template: text("template"),
  priority: text("priority").notNull().default("normal"),
});
```

### 9. telegram_logs

```typescript
export const telegramLogsTable = pgTable("telegram_logs", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  chatId: text("chat_id").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull(),           // "sent", "failed", "queued"
  error: text("error"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});
```

### 10. activity_logs

```typescript
export const activityLogsTable = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  userName: text("user_name"),
  action: text("action").notNull(),           // "login", "register", "refer", "enroll", "submit"
  entity: text("entity"),                      // "user", "referral", "course", "suggestion"
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## TypeScript Types (Frontend Models)

```typescript
// Admin state types
interface AdminUser {
  id: number;
  userId: number;
  name: string;
  identifier: string;
  role: string;
  roleId: number;
  roleName: string;
  roleLabel: string;
  points: number;
  referralCode: string | null;
  isActive: boolean;
  createdAt: string;
}

interface AdminRole {
  id: number;
  name: string;
  label: string;
  level: number;
  permissions: string[];
}

interface AdminEvent {
  id: number;
  eventType: string;
  payload: Record<string, any>;
  createdAt: string;
}

interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  entity: string;
  entityId?: number;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "draft" | "published" | "archived";
  publishedById?: number;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationSetting {
  id: number;
  key: string;
  value?: string;
  type: "string" | "password" | "number" | "boolean";
  category: string;
  description?: string;
  isSecret: boolean;
}

interface SystemSetting {
  key: string;
  value: any;
  type: "string" | "number" | "boolean" | "json";
  category: string;
  description?: string;
}

interface TelegramEventMapping {
  id: number;
  eventType: string;
  enabled: boolean;
  chatId?: string;
  template?: string;
  priority: "normal" | "high" | "urgent";
}

interface DashboardMetric {
  label: string;
  value: number;
  change: number;       // Percent change from previous period
  trend: "up" | "down" | "stable";
  icon: string;
}

interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  rewardedReferrals: number;
  totalPointsAwarded: number;
  topReferrers: Array<{
    userId: number;
    name: string;
    count: number;
    points: number;
  }>;
}

interface GamificationStats {
  totalUsers: number;
  usersWithPoints: number;
  totalPointsDistributed: number;
  averagePoints: number;
  topUsers: Array<{
    userId: number;
    name: string;
    points: number;
    rank: number;
  }>;
  tierDistribution: Record<string, number>;
}
```
