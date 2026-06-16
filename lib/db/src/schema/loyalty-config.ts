import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const loyaltyConfigTable = pgTable("loyalty_config", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLoyaltyConfigSchema = createInsertSchema(loyaltyConfigTable);
export type InsertLoyaltyConfig = z.infer<typeof insertLoyaltyConfigSchema>;
export type LoyaltyConfig = typeof loyaltyConfigTable.$inferSelect;
