import { Router } from "express";
import { db, usersTable, pointsTransactionsTable, earningActionsTable, rewardsTable, redemptionsTable, achievementsTable, tiersTable, loyaltyConfigTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";
import { emitAdminEvent } from "../../services/admin-socket";
import { awardPoints, checkAchievements } from "../../services/loyalty";

const router = Router();

router.get("/admin/loyalty/stats", requireRole("admin"), requirePermission("admin.gamification"), async (_req, res) => {
  try {
    const [userStats] = await db
      .select({
        totalUsers: sql<number>`count(*)`,
        usersWithPoints: sql<number>`count(*) filter (where points > 0)`,
        totalPoints: sql<number>`coalesce(sum(points), 0)`,
        averagePoints: sql<number>`coalesce(avg(points), 0)`,
      })
      .from(usersTable);

    const tiers = await db.select().from(tiersTable).orderBy(tiersTable.sortOrder);
    const tierDistribution = [];
    for (const tier of tiers) {
      const [count] = await db
        .select({ count: sql<number>`count(*)` })
        .from(usersTable)
        .where(sql`points >= ${tier.minPoints}${tier.maxPoints ? sql` AND points <= ${tier.maxPoints}` : sql``}`);
      tierDistribution.push({ name: tier.nameAr, key: tier.key, count: Number(count?.count ?? 0) });
    }

    const [txSummary] = await db
      .select({
        totalTransactions: sql<number>`count(*)`,
        totalPointsEarned: sql<number>`coalesce(sum(points_change) filter (where points_change > 0), 0)`,
        totalPointsSpent: sql<number>`coalesce(sum(abs(points_change)) filter (where points_change < 0), 0)`,
      })
      .from(pointsTransactionsTable);

    const [recentRedemptions] = await db
      .select({ count: sql<number>`count(*)` })
      .from(redemptionsTable)
      .where(eq(redemptionsTable.status, "pending"));

    const [achievementsAwarded] = await db
      .select({ count: sql<number>`count(*)` })
      .from(pointsTransactionsTable)
      .where(eq(pointsTransactionsTable.actionType, "achievement_reward"));

    res.json({
      users: {
        total: Number(userStats?.totalUsers ?? 0),
        withPoints: Number(userStats?.usersWithPoints ?? 0),
        totalPoints: Number(userStats?.totalPoints ?? 0),
        averagePoints: Math.round(Number(userStats?.averagePoints ?? 0)),
      },
      tierDistribution,
      transactions: {
        total: Number(txSummary?.totalTransactions ?? 0),
        earned: Number(txSummary?.totalPointsEarned ?? 0),
        spent: Number(txSummary?.totalPointsSpent ?? 0),
      },
      pendingRedemptions: Number(recentRedemptions?.count ?? 0),
      achievementsAwarded: Number(achievementsAwarded?.count ?? 0),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ADMIN_STATS_FAILED" });
  }
});

router.get("/admin/loyalty/actions", requireRole("admin"), requirePermission("admin.gamification"), async (_req, res) => {
  try {
    const items = await db.select().from(earningActionsTable).orderBy(earningActionsTable.actionKey);
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ACTIONS_LOAD_FAILED" });
  }
});

router.put("/admin/loyalty/actions/:key", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const key = String(req.params.key);
    const { pointValue, dailyLimit, cooldownMinutes, enabled, icon } = req.body;
    const [updated] = await db
      .update(earningActionsTable)
      .set({
        ...(pointValue !== undefined && { pointValue }),
        ...(dailyLimit !== undefined && { dailyLimit }),
        ...(cooldownMinutes !== undefined && { cooldownMinutes }),
        ...(enabled !== undefined && { enabled }),
        ...(icon !== undefined && { icon }),
      })
      .where(eq(earningActionsTable.actionKey, key))
      .returning();
    if (!updated) { res.status(404).json({ error: "الإجراء غير موجود", code: "NOT_FOUND" }); return; }
    await logAudit(req, "update", "earning_action", updated.id, { key, changes: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ACTION_UPDATE_FAILED" });
  }
});

router.post("/admin/loyalty/actions", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const { actionKey, nameAr, nameEn, descriptionAr, pointValue, dailyLimit, cooldownMinutes, enabled, icon } = req.body;
    if (!actionKey || !nameAr || !descriptionAr) {
      res.status(400).json({ error: "actionKey, nameAr, descriptionAr مطلوبة", code: "MISSING_FIELDS" }); return;
    }
    const [inserted] = await db.insert(earningActionsTable).values({
      actionKey, nameAr, nameEn, descriptionAr, pointValue, dailyLimit, cooldownMinutes, enabled, icon,
    }).returning();
    await logAudit(req, "create", "earning_action", inserted.id, { actionKey });
    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ACTION_CREATE_FAILED" });
  }
});

router.get("/admin/loyalty/rewards", requireRole("admin"), requirePermission("admin.gamification"), async (_req, res) => {
  try {
    const items = await db.select().from(rewardsTable).orderBy(rewardsTable.sortOrder);
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "REWARDS_LOAD_FAILED" });
  }
});

router.post("/admin/loyalty/rewards", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const { nameAr, nameEn, descriptionAr, pointCost, imageUrl, stock, rewardType, fulfillmentInstructions, isActive, expiresAt } = req.body;
    if (!nameAr || !descriptionAr || pointCost === undefined) {
      res.status(400).json({ error: "nameAr, descriptionAr, pointCost مطلوبة", code: "MISSING_FIELDS" }); return;
    }
    const [inserted] = await db.insert(rewardsTable).values({
      nameAr, nameEn, descriptionAr, pointCost, imageUrl, stock, rewardType, fulfillmentInstructions, isActive, expiresAt,
    }).returning();
    await logAudit(req, "create", "reward", inserted.id, { nameAr });
    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "REWARD_CREATE_FAILED" });
  }
});

router.put("/admin/loyalty/rewards/:id", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح", code: "INVALID_ID" }); return; }
    const { nameAr, nameEn, descriptionAr, pointCost, imageUrl, stock, rewardType, fulfillmentInstructions, isActive, expiresAt } = req.body;
    const [updated] = await db.update(rewardsTable).set({
      ...(nameAr !== undefined && { nameAr }),
      ...(nameEn !== undefined && { nameEn }),
      ...(descriptionAr !== undefined && { descriptionAr }),
      ...(pointCost !== undefined && { pointCost }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(stock !== undefined && { stock }),
      ...(rewardType !== undefined && { rewardType }),
      ...(fulfillmentInstructions !== undefined && { fulfillmentInstructions }),
      ...(isActive !== undefined && { isActive }),
      ...(expiresAt !== undefined && { expiresAt }),
    }).where(eq(rewardsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "المكافأة غير موجودة", code: "NOT_FOUND" }); return; }
    await logAudit(req, "update", "reward", id, { changes: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "REWARD_UPDATE_FAILED" });
  }
});

router.delete("/admin/loyalty/rewards/:id", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح", code: "INVALID_ID" }); return; }
    const [deleted] = await db.delete(rewardsTable).where(eq(rewardsTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "المكافأة غير موجودة", code: "NOT_FOUND" }); return; }
    await logAudit(req, "delete", "reward", id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "REWARD_DELETE_FAILED" });
  }
});

router.get("/admin/loyalty/achievements", requireRole("admin"), requirePermission("admin.gamification"), async (_req, res) => {
  try {
    const items = await db.select().from(achievementsTable).orderBy(achievementsTable.sortOrder);
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ACHIEVEMENTS_LOAD_FAILED" });
  }
});

router.post("/admin/loyalty/achievements", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const { key, nameAr, nameEn, descriptionAr, icon, criteria, pointReward, isHidden, isActive } = req.body;
    if (!key || !nameAr || !descriptionAr) {
      res.status(400).json({ error: "key, nameAr, descriptionAr مطلوبة", code: "MISSING_FIELDS" }); return;
    }
    const [inserted] = await db.insert(achievementsTable).values({
      key, nameAr, nameEn, descriptionAr, icon, criteria, pointReward, isHidden, isActive,
    }).returning();
    await logAudit(req, "create", "achievement", inserted.id, { key });
    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ACHIEVEMENT_CREATE_FAILED" });
  }
});

router.put("/admin/loyalty/achievements/:id", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح", code: "INVALID_ID" }); return; }
    const { key, nameAr, nameEn, descriptionAr, icon, criteria, pointReward, isHidden, isActive } = req.body;
    const [updated] = await db.update(achievementsTable).set({
      ...(key !== undefined && { key }),
      ...(nameAr !== undefined && { nameAr }),
      ...(nameEn !== undefined && { nameEn }),
      ...(descriptionAr !== undefined && { descriptionAr }),
      ...(icon !== undefined && { icon }),
      ...(criteria !== undefined && { criteria }),
      ...(pointReward !== undefined && { pointReward }),
      ...(isHidden !== undefined && { isHidden }),
      ...(isActive !== undefined && { isActive }),
    }).where(eq(achievementsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "الإنجاز غير موجود", code: "NOT_FOUND" }); return; }
    await logAudit(req, "update", "achievement", id, { changes: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ACHIEVEMENT_UPDATE_FAILED" });
  }
});

router.delete("/admin/loyalty/achievements/:id", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح", code: "INVALID_ID" }); return; }
    const [deleted] = await db.delete(achievementsTable).where(eq(achievementsTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "الإنجاز غير موجود", code: "NOT_FOUND" }); return; }
    await logAudit(req, "delete", "achievement", id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ACHIEVEMENT_DELETE_FAILED" });
  }
});

router.post("/admin/loyalty/achievements/:id/retroactively-award", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح", code: "INVALID_ID" }); return; }
    const allUsers = await db.select({ id: usersTable.id }).from(usersTable);
    let awarded = 0;
    for (const user of allUsers) {
      const result = await checkAchievements(user.id);
      if (result.length > 0) awarded++;
    }
    await logAudit(req, "update", "achievement", id, { retroactiveAwarded: awarded });
    res.json({ awarded });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "RETROACTIVE_FAILED" });
  }
});

router.get("/admin/loyalty/tiers", requireRole("admin"), requirePermission("admin.gamification"), async (_req, res) => {
  try {
    const items = await db.select().from(tiersTable).orderBy(tiersTable.sortOrder);
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "TIERS_LOAD_FAILED" });
  }
});

router.put("/admin/loyalty/tiers/:key", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const key = String(req.params.key);
    const { nameAr, nameEn, minPoints, maxPoints, color, icon, benefitsAr, sortOrder } = req.body;
    const [updated] = await db.update(tiersTable).set({
      ...(nameAr !== undefined && { nameAr }),
      ...(nameEn !== undefined && { nameEn }),
      ...(minPoints !== undefined && { minPoints }),
      ...(maxPoints !== undefined && { maxPoints }),
      ...(color !== undefined && { color }),
      ...(icon !== undefined && { icon }),
      ...(benefitsAr !== undefined && { benefitsAr }),
      ...(sortOrder !== undefined && { sortOrder }),
    }).where(eq(tiersTable.key, key)).returning();
    if (!updated) { res.status(404).json({ error: "المستوى غير موجود", code: "NOT_FOUND" }); return; }
    await logAudit(req, "update", "tier", updated.id, { key });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "TIER_UPDATE_FAILED" });
  }
});

router.get("/admin/loyalty/config", requireRole("admin"), requirePermission("admin.settings"), async (_req, res) => {
  try {
    const items = await db.select().from(loyaltyConfigTable);
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "CONFIG_LOAD_FAILED" });
  }
});

router.put("/admin/loyalty/config/:key", requireRole("admin"), requirePermission("admin.settings"), async (req, res) => {
  try {
    const key = String(req.params.key);
    const { value } = req.body;
    if (value === undefined) { res.status(400).json({ error: "value مطلوب", code: "MISSING_FIELDS" }); return; }
    const [updated] = await db.update(loyaltyConfigTable).set({ value }).where(eq(loyaltyConfigTable.key, key)).returning();
    if (!updated) { res.status(404).json({ error: "الإعداد غير موجود", code: "NOT_FOUND" }); return; }
    await logAudit(req, "update", "loyalty_config", undefined, { key, value });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "CONFIG_UPDATE_FAILED" });
  }
});

router.post("/admin/loyalty/users/:userId/adjust", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const userId = parseInt(String(req.params.userId), 10);
    if (isNaN(userId)) { res.status(400).json({ error: "معرف مستخدم غير صالح", code: "INVALID_USER_ID" }); return; }
    const { points, reason } = req.body;
    if (points === undefined || !reason) {
      res.status(400).json({ error: "points و reason مطلوبان", code: "MISSING_FIELDS" }); return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) { res.status(404).json({ error: "المستخدم غير موجود", code: "USER_NOT_FOUND" }); return; }

    const result = await awardPoints(userId, "admin_adjustment", undefined, `admin_adj_${userId}_${Date.now()}`, reason);
    if (!result.success) {
      res.status(400).json({ error: result.message, code: "ADJUSTMENT_FAILED" }); return;
    }

    await logAudit(req, "update", "user_points", userId, { previousPoints: user.points, newPoints: result.newBalance, change: points, reason });
    emitAdminEvent("admin:points_adjusted", { userId, byUserId: req.user?.id, points, reason, timestamp: new Date().toISOString() });

    res.json({ userId, previousPoints: user.points, newBalance: result.newBalance, change: points, reason });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "ADJUSTMENT_FAILED" });
  }
});

router.get("/admin/loyalty/redemptions", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const status = (req.query.status as string) || "pending";
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const filter = status === "all" ? undefined : eq(redemptionsTable.status, status);
    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(redemptionsTable)
      .where(filter);

    const items = await db
      .select({
        id: redemptionsTable.id,
        userId: redemptionsTable.userId,
        rewardId: redemptionsTable.rewardId,
        pointsSpent: redemptionsTable.pointsSpent,
        status: redemptionsTable.status,
        adminNote: redemptionsTable.adminNote,
        fulfilledAt: redemptionsTable.fulfilledAt,
        createdAt: redemptionsTable.createdAt,
        userName: usersTable.name,
        rewardName: rewardsTable.nameAr,
      })
      .from(redemptionsTable)
      .leftJoin(usersTable, eq(redemptionsTable.userId, usersTable.id))
      .leftJoin(rewardsTable, eq(redemptionsTable.rewardId, rewardsTable.id))
      .where(filter)
      .orderBy(desc(redemptionsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      items: items.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), fulfilledAt: r.fulfilledAt?.toISOString() ?? null })),
      pagination: { page, limit, total: countResult.count, totalPages: Math.ceil(countResult.count / limit) },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "REDEMPTIONS_LOAD_FAILED" });
  }
});

router.put("/admin/loyalty/redemptions/:id/fulfill", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح", code: "INVALID_ID" }); return; }
    const { adminNote } = req.body;
    const [updated] = await db.update(redemptionsTable).set({
      status: "fulfilled", adminNote, fulfilledAt: new Date(),
    }).where(eq(redemptionsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "الاستبدال غير موجود", code: "NOT_FOUND" }); return; }
    await logAudit(req, "update", "redemption", id, { status: "fulfilled", note: adminNote });
    emitAdminEvent("admin:redemption_fulfilled", { redemptionId: id, timestamp: new Date().toISOString() });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "FULFILL_FAILED" });
  }
});

router.put("/admin/loyalty/redemptions/:id/cancel", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح", code: "INVALID_ID" }); return; }
    const { adminNote } = req.body;

    const [redemption] = await db.select().from(redemptionsTable).where(eq(redemptionsTable.id, id)).limit(1);
    if (!redemption) { res.status(404).json({ error: "الاستبدال غير موجود", code: "NOT_FOUND" }); return; }

    await db.transaction(async (tx) => {
      await tx.update(redemptionsTable).set({ status: "cancelled", adminNote, fulfilledAt: new Date() })
        .where(eq(redemptionsTable.id, id));

      await tx.insert(pointsTransactionsTable).values({
        userId: redemption.userId,
        actionType: "admin_adjustment",
        pointsChange: redemption.pointsSpent,
        balanceAfter: 0,
        referenceId: redemption.id,
        adminNote: `إلغاء استبدال #${id} - استرداد النقاط`,
      });

      await tx.update(usersTable).set({ points: sql`points + ${redemption.pointsSpent}` })
        .where(eq(usersTable.id, redemption.userId));

      if (redemption.rewardId) {
        await tx.update(rewardsTable).set({ stock: sql`stock + 1` })
          .where(eq(rewardsTable.id, redemption.rewardId));
      }
    });

    await logAudit(req, "update", "redemption", id, { status: "cancelled", note: adminNote, refunded: redemption.pointsSpent });
    emitAdminEvent("admin:redemption_cancelled", { redemptionId: id, timestamp: new Date().toISOString() });
    res.json({ success: true, refunded: redemption.pointsSpent });
  } catch (err: any) {
    res.status(500).json({ error: err.message, code: "CANCEL_FAILED" });
  }
});

export default router;
