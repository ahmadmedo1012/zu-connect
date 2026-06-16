import { Router } from "express";
import { db, usersTable, pointsTransactionsTable, rewardsTable, redemptionsTable, userAchievementsTable } from "@workspace/db";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { awardPoints, getEarningActions, checkAchievements, getUserStats } from "../services/loyalty";

const router = Router();

const claimRateMap = new Map<string, { count: number; resetAt: number }>();

function checkClaimRateLimit(userId: number): boolean {
  const key = `user_${userId}`;
  const now = Date.now();
  const entry = claimRateMap.get(key);
  if (!entry || now > entry.resetAt) {
    claimRateMap.set(key, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function decodeToken(token: string): { id: number; name: string; role: string } | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8"),
    );
    if (payload && typeof payload.id === "number") return { id: payload.id, name: payload.name, role: payload.role };
    return null;
  } catch {
    return null;
  }
}

function getUserId(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return decodeToken(auth.slice(7))?.id ?? null;
}

router.get("/loyalty/actions", async (_req, res) => {
  try {
    const actions = await getEarningActions();
    res.json({ actions });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في تحميل الإجراءات", code: "ACTIONS_LOAD_FAILED" });
  }
});

router.post("/loyalty/actions/:key/claim", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "يجب تسجيل الدخول أولاً", code: "UNAUTHORIZED" });
      return;
    }

    if (!checkClaimRateLimit(userId)) {
      res.status(429).json({ error: "طلبات كثيرة جداً، حاول لاحقاً", code: "RATE_LIMITED" });
      return;
    }

    const { key } = req.params;
    const { referenceId, idempotencyKey } = req.body;
    const idempKey = idempotencyKey ?? `claim_${userId}_${key}_${Date.now()}`;

    const result = await awardPoints(userId, key, referenceId, idempKey);
    if (!result.success) {
      res.status(400).json({ error: result.message, code: "CLAIM_FAILED" });
      return;
    }

    const newAchievements = await checkAchievements(userId);

    res.json({
      success: true,
      pointsAwarded: result.pointsAwarded,
      newBalance: result.newBalance,
      message: result.message,
      newAchievements: newAchievements.map(a => ({
        key: a.key,
        nameAr: a.nameAr,
        icon: a.icon,
        pointReward: a.pointReward,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في صرف النقاط", code: "POINTS_CLAIM_FAILED" });
  }
});

router.get("/loyalty/transactions", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "يجب تسجيل الدخول أولاً", code: "UNAUTHORIZED" });
      return;
    }
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;
    const actionType = req.query.actionType as string | undefined;
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;

    const filters = [eq(pointsTransactionsTable.userId, userId)];
    if (actionType) filters.push(eq(pointsTransactionsTable.actionType, actionType));
    if (dateFrom) filters.push(gte(pointsTransactionsTable.createdAt, new Date(dateFrom)));
    if (dateTo) filters.push(lte(pointsTransactionsTable.createdAt, new Date(dateTo)));

    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(pointsTransactionsTable)
      .where(and(...filters));

    const items = await db
      .select()
      .from(pointsTransactionsTable)
      .where(and(...filters))
      .orderBy(desc(pointsTransactionsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      items: items.map(tx => ({ ...tx, createdAt: tx.createdAt.toISOString() })),
      pagination: {
        page,
        limit,
        total: countResult.count,
        totalPages: Math.ceil(countResult.count / limit),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في تحميل المعاملات", code: "TRANSACTIONS_LOAD_FAILED" });
  }
});

router.get("/loyalty/stats", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "يجب تسجيل الدخول أولاً", code: "UNAUTHORIZED" });
      return;
    }
    const stats = await getUserStats(userId);
    if (!stats) {
      res.status(404).json({ error: "المستخدم غير موجود", code: "USER_NOT_FOUND" });
      return;
    }
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في تحميل الإحصائيات", code: "STATS_LOAD_FAILED" });
  }
});

router.get("/loyalty/rewards", async (_req, res) => {
  try {
    const items = await db
      .select()
      .from(rewardsTable)
      .where(eq(rewardsTable.isActive, true))
      .orderBy(rewardsTable.sortOrder);
    res.json({
      items: items.map(r => ({
        ...r,
        inStock: r.stock > 0 || r.stock === -1,
        expiresAt: r.expiresAt?.toISOString() ?? null,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في تحميل المكافآت", code: "REWARDS_LOAD_FAILED" });
  }
});

router.post("/loyalty/rewards/:id/redeem", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "يجب تسجيل الدخول أولاً", code: "UNAUTHORIZED" });
      return;
    }

    const rewardId = parseInt(req.params.id, 10);
    if (isNaN(rewardId)) {
      res.status(400).json({ error: "معرف المكافأة غير صالح", code: "INVALID_REWARD_ID" });
      return;
    }

    const [reward] = await db
      .select()
      .from(rewardsTable)
      .where(and(eq(rewardsTable.id, rewardId), eq(rewardsTable.isActive, true)))
      .limit(1);

    if (!reward) {
      res.status(404).json({ error: "المكافأة غير موجودة", code: "REWARD_NOT_FOUND" });
      return;
    }

    if (reward.stock <= 0 && reward.stock !== -1) {
      res.status(400).json({ error: "المكافأة نفدت من المخزون", code: "OUT_OF_STOCK" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "المستخدم غير موجود", code: "USER_NOT_FOUND" });
      return;
    }

    if (user.points < reward.pointCost) {
      res.status(400).json({
        error: "نقاط غير كافية", code: "INSUFFICIENT_POINTS",
        needed: reward.pointCost, current: user.points,
      });
      return;
    }

    const result = await db.transaction(async (tx) => {
      const [redemption] = await tx.insert(redemptionsTable).values({
        userId,
        rewardId,
        pointsSpent: reward.pointCost,
        status: "pending",
      }).returning();

      await tx.insert(pointsTransactionsTable).values({
        userId,
        actionType: "reward_redemption",
        pointsChange: -reward.pointCost,
        balanceAfter: user.points - reward.pointCost,
        referenceId: redemption.id,
      });

      await tx
        .update(usersTable)
        .set({ points: user.points - reward.pointCost })
        .where(eq(usersTable.id, userId));

      if (reward.stock > 0) {
        await tx
          .update(rewardsTable)
          .set({ stock: reward.stock - 1 })
          .where(eq(rewardsTable.id, rewardId));
      }

      return redemption;
    });

    res.status(201).json({
      success: true,
      redemption: { ...result, createdAt: result.createdAt.toISOString() },
      newBalance: user.points - reward.pointCost,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في استبدال المكافأة", code: "REDEEM_FAILED" });
  }
});

router.get("/loyalty/leaderboard", async (req, res) => {
  try {
    const sortBy = (req.query.sortBy as string) || "points";
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const userId = getUserId(req);

    let orderCol;
    switch (sortBy) {
      case "referrals":
        orderCol = desc(sql`(select count(*) from referrals where referrer_id = users.id and status in ('rewarded', 'completed'))`);
        break;
      case "achievements":
        orderCol = desc(sql`(select count(*) from user_achievements where user_id = users.id)`);
        break;
      default:
        orderCol = desc(usersTable.points);
    }

    const items = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        points: usersTable.points,
        referralCount: sql<number>`(select count(*) from referrals where referrer_id = users.id and status in ('rewarded', 'completed'))`,
        achievementCount: sql<number>`(select count(*) from user_achievements where user_id = users.id)`,
      })
      .from(usersTable)
      .orderBy(orderCol)
      .limit(limit);

    let myRank = null;
    if (userId) {
      const allRanked = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .orderBy(orderCol);
      const idx = allRanked.findIndex(u => u.id === userId);
      if (idx !== -1) myRank = idx + 1;
    }

    const ranked = items.map((u, i) => ({ ...u, rank: i + 1 }));
    res.json({ items: ranked, myRank, sortBy, totalUsers: items.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "حدث خطأ في تحميل لوحة المتصدرين", code: "LEADERBOARD_LOAD_FAILED" });
  }
});

export default router;
