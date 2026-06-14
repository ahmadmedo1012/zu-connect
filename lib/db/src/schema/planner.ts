import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const plannerTable = pgTable("planner", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  month: text("month").notNull(),
  icon: text("icon").notNull().default("calendar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlannerSchema = createInsertSchema(plannerTable).omit({ id: true, createdAt: true });
export type InsertPlanner = z.infer<typeof insertPlannerSchema>;
export type Planner = typeof plannerTable.$inferSelect;
