import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const REFERRAL_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  REWARDED: "rewarded",
  EXPIRED: "expired",
} as const;

export type ReferralStatus = (typeof REFERRAL_STATUS)[keyof typeof REFERRAL_STATUS];

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  refereeId: integer("referee_id")
    .references(() => usersTable.id, { onDelete: "set null" }),
  code: text("code").notNull(),
  status: text("status")
    .notNull()
    .default(REFERRAL_STATUS.PENDING),
  pointsAwarded: integer("points_awarded").notNull().default(0),
  firstContactAt: timestamp("first_contact_at"),
  completedAt: timestamp("completed_at"),
  rewardedAt: timestamp("rewarded_at"),
  refereeIp: text("referee_ip"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertReferralSchema = createInsertSchema(referralsTable).omit({
  id: true, createdAt: true, updatedAt: true,
});

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referralsTable.$inferSelect;
