import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { rewardsTable } from "./rewards";

export const REDEMPTION_STATUS = ["pending", "fulfilled", "cancelled"] as const;
export type RedemptionStatus = (typeof REDEMPTION_STATUS)[number];

export const redemptionsTable = pgTable("redemptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  rewardId: integer("reward_id")
    .notNull()
    .references(() => rewardsTable.id, { onDelete: "restrict" }),
  pointsSpent: integer("points_spent").notNull(),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  fulfilledAt: timestamp("fulfilled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertRedemptionSchema = createInsertSchema(redemptionsTable).omit({
  id: true, createdAt: true, updatedAt: true,
});

export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;
export type Redemption = typeof redemptionsTable.$inferSelect;
