import { z } from "zod/v4";

export const pointsClaimSchema = z.object({
  idempotencyKey: z.string().min(1).optional(),
});

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  actionType: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const leaderboardQuerySchema = z.object({
  sortBy: z.enum(["points", "referrals", "achievements"]).default("points"),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export const redeemRewardSchema = z.object({});

export const adminPointsAdjustSchema = z.object({
  userId: z.coerce.number().int().positive(),
  points: z.number().int(),
  reason: z.string().min(1, "السبب مطلوب"),
});

export const adminActionUpdateSchema = z.object({
  pointValue: z.number().int().positive().optional(),
  dailyLimit: z.number().int().positive().optional(),
  cooldownMinutes: z.number().int().min(0).nullable().optional(),
  enabled: z.boolean().optional(),
});

export const adminRedemptionStatusSchema = z.object({
  status: z.enum(["fulfilled", "cancelled"]),
  adminNote: z.string().optional(),
});
