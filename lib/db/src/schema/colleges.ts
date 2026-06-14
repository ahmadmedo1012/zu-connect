import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const collegesTable = pgTable("colleges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  studentCount: integer("student_count").notNull().default(0),
  hasNews: boolean("has_news").notNull().default(false),
  hasSchedules: boolean("has_schedules").notNull().default(false),
  hasFiles: boolean("has_files").notNull().default(false),
  hasActivities: boolean("has_activities").notNull().default(false),
  icon: text("icon").notNull().default("graduation-cap"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCollegeSchema = createInsertSchema(collegesTable).omit({ id: true, createdAt: true });
export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type College = typeof collegesTable.$inferSelect;
