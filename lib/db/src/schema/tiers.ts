import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tiersTable = pgTable("tiers", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  minPoints: integer("min_points").notNull(),
  maxPoints: integer("max_points"),
  color: text("color"),
  icon: text("icon"),
  benefitsAr: jsonb("benefits_ar"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTierSchema = createInsertSchema(tiersTable).omit({
  id: true, createdAt: true,
});

export type InsertTier = z.infer<typeof insertTierSchema>;
export type Tier = typeof tiersTable.$inferSelect;
