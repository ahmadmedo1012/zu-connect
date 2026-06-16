import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const REWARD_TYPES = ["digital", "physical"] as const;
export type RewardType = (typeof REWARD_TYPES)[number];

export const rewardsTable = pgTable("rewards", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  descriptionAr: text("description_ar").notNull(),
  pointCost: integer("point_cost").notNull(),
  imageUrl: text("image_url"),
  stock: integer("stock").notNull().default(0),
  rewardType: text("reward_type").notNull().default("digital"),
  fulfillmentInstructions: text("fulfillment_instructions"),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertRewardSchema = createInsertSchema(rewardsTable).omit({
  id: true, createdAt: true, updatedAt: true,
});

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewardsTable.$inferSelect;
