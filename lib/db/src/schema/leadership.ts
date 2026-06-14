import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadershipTable = pgTable("leadership", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadershipSchema = createInsertSchema(leadershipTable).omit({ id: true, createdAt: true });
export type InsertLeadership = z.infer<typeof insertLeadershipSchema>;
export type Leadership = typeof leadershipTable.$inferSelect;
