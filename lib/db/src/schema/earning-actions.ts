import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const earningActionsTable = pgTable("earning_actions", {
  id: serial("id").primaryKey(),
  actionKey: text("action_key").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  descriptionAr: text("description_ar").notNull(),
  pointValue: integer("point_value").notNull().default(10),
  dailyLimit: integer("daily_limit").notNull().default(1),
  cooldownMinutes: integer("cooldown_minutes"),
  enabled: boolean("enabled").notNull().default(true),
  icon: text("icon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertEarningActionSchema = createInsertSchema(earningActionsTable).omit({
  id: true, createdAt: true, updatedAt: true,
});

export type InsertEarningAction = z.infer<typeof insertEarningActionSchema>;
export type EarningAction = typeof earningActionsTable.$inferSelect;
