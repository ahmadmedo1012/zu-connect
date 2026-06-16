import { pgTable, serial, text, integer, timestamp, boolean, real, unique, foreignKey, index, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const news = pgTable("news", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	body: text().notNull(),
	category: text().notNull(),
	date: text().notNull(),
	viewCount: integer("view_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const courses = pgTable("courses", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	instructor: text().notNull(),
	duration: text().notNull(),
	level: text().notNull(),
	category: text().notNull(),
	totalSeats: integer("total_seats").notNull(),
	enrolledCount: integer("enrolled_count").default(0).notNull(),
	colorScheme: integer("color_scheme").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const members = pgTable("members", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	role: text().notNull(),
	department: text().notNull(),
	year: text().notNull(),
	category: text().notNull(),
	initials: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const colleges = pgTable("colleges", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	studentCount: integer("student_count").default(0).notNull(),
	hasNews: boolean("has_news").default(false).notNull(),
	hasSchedules: boolean("has_schedules").default(false).notNull(),
	hasFiles: boolean("has_files").default(false).notNull(),
	hasActivities: boolean("has_activities").default(false).notNull(),
	icon: text().default('graduation-cap').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const library = pgTable("library", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	subtitle: text().notNull(),
	type: text().notNull(),
	rating: real().default(0).notNull(),
	downloadCount: integer("download_count").default(0).notNull(),
	college: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const planner = pgTable("planner", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	date: text().notNull(),
	month: text().notNull(),
	icon: text().default('calendar').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const chatRooms = pgTable("chat_rooms", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	onlineCount: integer("online_count").default(0).notNull(),
	icon: text().default('message-circle').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const suggestions = pgTable("suggestions", {
	id: serial().primaryKey().notNull(),
	name: text(),
	college: text(),
	type: text().notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const volunteers = pgTable("volunteers", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	college: text().notNull(),
	phone: text().notNull(),
	area: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const faq = pgTable("faq", {
	id: serial().primaryKey().notNull(),
	question: text().notNull(),
	answer: text().notNull(),
	category: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const leadership = pgTable("leadership", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	role: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	identifier: text().notNull(),
	password: text().notNull(),
	name: text().notNull(),
	role: text().default('student').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	referralCode: text("referral_code"),
	points: integer().default(0).notNull(),
}, (table) => [
	unique("users_identifier_unique").on(table.identifier),
	unique("users_referral_code_unique").on(table.referralCode),
]);

export const adminUsers = pgTable("admin_users", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	roleId: integer("role_id").notNull(),
	createdBy: integer("created_by"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "admin_users_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [adminRoles.id],
			name: "admin_users_role_id_admin_roles_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "admin_users_created_by_users_id_fk"
		}).onDelete("set null"),
]);

export const adminEvents = pgTable("admin_events", {
	id: serial().primaryKey().notNull(),
	eventType: text("event_type").notNull(),
	payload: jsonb().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_admin_events_created").using("btree", table.createdAt.desc().nullsLast().op("timestamp_ops")),
]);

export const announcements = pgTable("announcements", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	priority: text().default('normal').notNull(),
	status: text().default('draft').notNull(),
	publishedById: integer("published_by_id"),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.publishedById],
			foreignColumns: [users.id],
			name: "announcements_published_by_id_users_id_fk"
		}),
]);

export const auditLogs = pgTable("audit_logs", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	userName: text("user_name").notNull(),
	action: text().notNull(),
	entity: text().notNull(),
	entityId: integer("entity_id"),
	details: jsonb(),
	ipAddress: text("ip_address"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_audit_logs_action").using("btree", table.action.asc().nullsLast().op("text_ops")),
	index("idx_audit_logs_created").using("btree", table.createdAt.desc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "audit_logs_user_id_users_id_fk"
		}),
]);

export const activityLogs = pgTable("activity_logs", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	userName: text("user_name"),
	action: text().notNull(),
	entity: text(),
	details: jsonb(),
	ipAddress: text("ip_address"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_activity_logs_created").using("btree", table.createdAt.desc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "activity_logs_user_id_users_id_fk"
		}),
]);

export const adminRoles = pgTable("admin_roles", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	label: text().notNull(),
	level: integer().default(0).notNull(),
	permissions: jsonb().default([]).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("admin_roles_name_unique").on(table.name),
]);

export const referrals = pgTable("referrals", {
	id: serial().primaryKey().notNull(),
	referrerId: integer("referrer_id").notNull(),
	refereeId: integer("referee_id"),
	code: text().notNull(),
	status: text().default('pending').notNull(),
	pointsAwarded: integer("points_awarded").default(0).notNull(),
	firstContactAt: timestamp("first_contact_at", { mode: 'string' }),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	rewardedAt: timestamp("rewarded_at", { mode: 'string' }),
	refereeIp: text("referee_ip"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.referrerId],
			foreignColumns: [users.id],
			name: "referrals_referrer_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.refereeId],
			foreignColumns: [users.id],
			name: "referrals_referee_id_users_id_fk"
		}).onDelete("set null"),
]);

export const integrationSettings = pgTable("integration_settings", {
	id: serial().primaryKey().notNull(),
	key: text().notNull(),
	value: text(),
	type: text().default('string').notNull(),
	category: text().notNull(),
	description: text(),
	isSecret: boolean("is_secret").default(false).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("integration_settings_key_unique").on(table.key),
]);

export const systemSettings = pgTable("system_settings", {
	id: serial().primaryKey().notNull(),
	key: text().notNull(),
	value: jsonb().notNull(),
	type: text().default('string').notNull(),
	category: text().default('general').notNull(),
	description: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("system_settings_key_unique").on(table.key),
]);

export const telegramEventMappings = pgTable("telegram_event_mappings", {
	id: serial().primaryKey().notNull(),
	eventType: text("event_type").notNull(),
	enabled: boolean().default(false).notNull(),
	chatId: text("chat_id"),
	template: text(),
	priority: text().default('normal').notNull(),
}, (table) => [
	unique("telegram_event_mappings_event_type_unique").on(table.eventType),
]);

export const telegramLogs = pgTable("telegram_logs", {
	id: serial().primaryKey().notNull(),
	eventType: text("event_type").notNull(),
	chatId: text("chat_id").notNull(),
	message: text().notNull(),
	status: text().notNull(),
	error: text(),
	sentAt: timestamp("sent_at", { mode: 'string' }).defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
	id: serial().primaryKey().notNull(),
	roomId: integer("room_id").notNull(),
	sender: text().notNull(),
	message: text().notNull(),
	isMe: boolean("is_me").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [chatRooms.id],
			name: "chat_messages_room_id_chat_rooms_id_fk"
		}).onDelete("cascade"),
]);
