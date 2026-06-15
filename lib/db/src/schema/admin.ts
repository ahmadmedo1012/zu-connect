import { pgTable, serial, integer, text, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

// ============================================================
// ADMIN ROLES
// ============================================================
export const adminRolesTable = pgTable("admin_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  label: text("label").notNull(),
  level: integer("level").notNull().default(0),
  permissions: jsonb("permissions").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminRoleSchema = createInsertSchema(adminRolesTable).omit({ id: true, createdAt: true });
export type InsertAdminRole = z.infer<typeof insertAdminRoleSchema>;
export type AdminRole = typeof adminRolesTable.$inferSelect;

// ============================================================
// ADMIN USERS (links users to admin roles)
// ============================================================
export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  roleId: integer("role_id").notNull().references(() => adminRolesTable.id),
  createdBy: integer("created_by").references(() => usersTable.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsersTable).omit({ id: true, createdAt: true });
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsersTable.$inferSelect;

// ============================================================
// ADMIN EVENTS (realtime event persistence)
// ============================================================
export const adminEventsTable = pgTable("admin_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_admin_events_created").on(table.createdAt.desc()),
]);

export type AdminEvent = typeof adminEventsTable.$inferSelect;

// ============================================================
// AUDIT LOGS
// ============================================================
export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  userName: text("user_name").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: integer("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_audit_logs_created").on(table.createdAt.desc()),
  index("idx_audit_logs_action").on(table.action),
]);

export const insertAuditLogSchema = createInsertSchema(auditLogsTable).omit({ id: true, createdAt: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogsTable.$inferSelect;

// ============================================================
// ANNOUNCEMENTS
// ============================================================
export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("draft"),
  publishedById: integer("published_by_id").references(() => usersTable.id),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAnnouncementSchema = createInsertSchema(announcementsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcementsTable.$inferSelect;

// ============================================================
// INTEGRATION SETTINGS
// ============================================================
export const integrationSettingsTable = pgTable("integration_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  type: text("type").notNull().default("string"),
  category: text("category").notNull(),
  description: text("description"),
  isSecret: boolean("is_secret").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIntegrationSettingSchema = createInsertSchema(integrationSettingsTable).omit({ id: true, updatedAt: true });
export type InsertIntegrationSetting = z.infer<typeof insertIntegrationSettingSchema>;
export type IntegrationSetting = typeof integrationSettingsTable.$inferSelect;

// ============================================================
// SYSTEM SETTINGS
// ============================================================
export const systemSettingsTable = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  type: text("type").notNull().default("string"),
  category: text("category").notNull().default("general"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSystemSettingSchema = createInsertSchema(systemSettingsTable).omit({ id: true, updatedAt: true });
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettingsTable.$inferSelect;

// ============================================================
// TELEGRAM EVENT MAPPINGS
// ============================================================
export const telegramEventMappingsTable = pgTable("telegram_event_mappings", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull().unique(),
  enabled: boolean("enabled").notNull().default(false),
  chatId: text("chat_id"),
  template: text("template"),
  priority: text("priority").notNull().default("normal"),
});

export const insertTelegramEventMappingSchema = createInsertSchema(telegramEventMappingsTable).omit({ id: true });
export type InsertTelegramEventMapping = z.infer<typeof insertTelegramEventMappingSchema>;
export type TelegramEventMapping = typeof telegramEventMappingsTable.$inferSelect;

// ============================================================
// TELEGRAM LOGS
// ============================================================
export const telegramLogsTable = pgTable("telegram_logs", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  chatId: text("chat_id").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull(),
  error: text("error"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const insertTelegramLogSchema = createInsertSchema(telegramLogsTable).omit({ id: true, sentAt: true });
export type InsertTelegramLog = z.infer<typeof insertTelegramLogSchema>;
export type TelegramLog = typeof telegramLogsTable.$inferSelect;

// ============================================================
// ACTIVITY LOGS (user-facing activity)
// ============================================================
export const activityLogsTable = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  userName: text("user_name"),
  action: text("action").notNull(),
  entity: text("entity"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_activity_logs_created").on(table.createdAt.desc()),
]);

export const insertActivityLogSchema = createInsertSchema(activityLogsTable).omit({ id: true, createdAt: true });
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogsTable.$inferSelect;
