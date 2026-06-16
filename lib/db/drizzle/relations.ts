import { relations } from "drizzle-orm/relations";
import { users, adminUsers, adminRoles, announcements, auditLogs, activityLogs, referrals, chatRooms, chatMessages } from "./schema";

export const adminUsersRelations = relations(adminUsers, ({one}) => ({
	user_userId: one(users, {
		fields: [adminUsers.userId],
		references: [users.id],
		relationName: "adminUsers_userId_users_id"
	}),
	adminRole: one(adminRoles, {
		fields: [adminUsers.roleId],
		references: [adminRoles.id]
	}),
	user_createdBy: one(users, {
		fields: [adminUsers.createdBy],
		references: [users.id],
		relationName: "adminUsers_createdBy_users_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	adminUsers_userId: many(adminUsers, {
		relationName: "adminUsers_userId_users_id"
	}),
	adminUsers_createdBy: many(adminUsers, {
		relationName: "adminUsers_createdBy_users_id"
	}),
	announcements: many(announcements),
	auditLogs: many(auditLogs),
	activityLogs: many(activityLogs),
	referrals_referrerId: many(referrals, {
		relationName: "referrals_referrerId_users_id"
	}),
	referrals_refereeId: many(referrals, {
		relationName: "referrals_refereeId_users_id"
	}),
}));

export const adminRolesRelations = relations(adminRoles, ({many}) => ({
	adminUsers: many(adminUsers),
}));

export const announcementsRelations = relations(announcements, ({one}) => ({
	user: one(users, {
		fields: [announcements.publishedById],
		references: [users.id]
	}),
}));

export const auditLogsRelations = relations(auditLogs, ({one}) => ({
	user: one(users, {
		fields: [auditLogs.userId],
		references: [users.id]
	}),
}));

export const activityLogsRelations = relations(activityLogs, ({one}) => ({
	user: one(users, {
		fields: [activityLogs.userId],
		references: [users.id]
	}),
}));

export const referralsRelations = relations(referrals, ({one}) => ({
	user_referrerId: one(users, {
		fields: [referrals.referrerId],
		references: [users.id],
		relationName: "referrals_referrerId_users_id"
	}),
	user_refereeId: one(users, {
		fields: [referrals.refereeId],
		references: [users.id],
		relationName: "referrals_refereeId_users_id"
	}),
}));

export const chatMessagesRelations = relations(chatMessages, ({one}) => ({
	chatRoom: one(chatRooms, {
		fields: [chatMessages.roomId],
		references: [chatRooms.id]
	}),
}));

export const chatRoomsRelations = relations(chatRooms, ({many}) => ({
	chatMessages: many(chatMessages),
}));