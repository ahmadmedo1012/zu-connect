import { pgTable, serial, integer, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const TRANSACTION_TYPES = [
  "referral", "daily_login", "suggestion", "content_share",
  "profile_complete", "event_attendance", "reward_redemption",
  "admin_adjustment", "expiration", "achievement_reward",
] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const pointsTransactionsTable = pgTable("points_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  actionType: text("action_type").notNull(),
  pointsChange: integer("points_change").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  referenceId: integer("reference_id"),
  adminNote: text("admin_note"),
  idempotencyKey: text("idempotency_key").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdx: index("idx_points_tx_user").on(table.userId, table.createdAt),
  typeIdx: index("idx_points_tx_type").on(table.actionType, table.createdAt),
}));

export const insertPointsTransactionSchema = createInsertSchema(pointsTransactionsTable).omit({
  id: true, createdAt: true,
});

export type InsertPointsTransaction = z.infer<typeof insertPointsTransactionSchema>;
export type PointsTransaction = typeof pointsTransactionsTable.$inferSelect;
