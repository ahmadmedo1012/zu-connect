import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const libraryTable = pgTable("library", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  type: text("type").notNull(),
  rating: real("rating").notNull().default(0),
  downloadCount: integer("download_count").notNull().default(0),
  college: text("college").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLibrarySchema = createInsertSchema(libraryTable).omit({ id: true, createdAt: true });
export type InsertLibrary = z.infer<typeof insertLibrarySchema>;
export type Library = typeof libraryTable.$inferSelect;
