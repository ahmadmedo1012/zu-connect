import { db, usersTable, pointsTransactionsTable, earningActionsTable, tiersTable, achievementsTable, userAchievementsTable, loyaltyConfigTable } from "@workspace/db";
import { eq, and, sql, gte, lt, desc } from "drizzle-orm";

export async function awardPoints(
  userId: number,
  actionType: string,
  referenceId?: number,
  idempotencyKey?: string,
  adminNote?: string,
): Promise<{ success: boolean; pointsAwarded: number; newBalance: number; message: string }> {
  if (idempotencyKey) {
    const [existing] = await db
      .select()
      .from(pointsTransactionsTable)
      .where(eq(pointsTransactionsTable.idempotencyKey, idempotencyKey))
      .limit(1);
    if (existing) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
      return { success: true, pointsAwarded: existing.pointsChange, newBalance: user.points, message: "تمت المكافأة مسبقاً" };
    }
  }

  const [action] = await db
    .select()
    .from(earningActionsTable)
    .where(eq(earningActionsTable.actionKey, actionType))
    .limit(1);
  if (!action) {
    return { success: false, pointsAwarded: 0, newBalance: 0, message: "نوع الإجراء غير موجود" };
  }
  if (!action.enabled) {
    return { success: false, pointsAwarded: 0, newBalance: 0, message: "هذا الإجراء غير مفعل حالياً" };
  }

  const pointValue = action.pointValue;

  if (action.dailyLimit > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [countResult] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(pointsTransactionsTable)
      .where(
        and(
          eq(pointsTransactionsTable.userId, userId),
          eq(pointsTransactionsTable.actionType, actionType),
          gte(pointsTransactionsTable.createdAt, today),
        ),
      );
    if (countResult.count >= action.dailyLimit) {
      return { success: false, pointsAwarded: 0, newBalance: 0, message: "لقد وصلت للحد اليومي لهذا الإجراء" };
    }
  }

  const cooldown = action.cooldownMinutes;
  if (cooldown && cooldown > 0) {
    const cutoff = new Date(Date.now() - cooldown * 60 * 1000);
    const [recent] = await db
      .select()
      .from(pointsTransactionsTable)
      .where(
        and(
          eq(pointsTransactionsTable.userId, userId),
          eq(pointsTransactionsTable.actionType, actionType),
          gte(pointsTransactionsTable.createdAt, cutoff),
        ),
      )
      .limit(1);
    if (recent) {
      const waitMinutes = cooldown - Math.floor((Date.now() - recent.createdAt.getTime()) / 60000);
      return { success: false, pointsAwarded: 0, newBalance: 0, message: `يرجى الانتظار ${waitMinutes} دقيقة قبل تكرار هذا الإجراء` };
    }
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!user) {
    return { success: false, pointsAwarded: 0, newBalance: 0, message: "المستخدم غير موجود" };
  }

  const newBalance = user.points + pointValue;
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx.insert(pointsTransactionsTable).values({
      userId,
      actionType,
      pointsChange: pointValue,
      balanceAfter: newBalance,
      referenceId,
      adminNote,
      idempotencyKey,
    });

    await tx
      .update(usersTable)
      .set({ points: newBalance, lastActivityAt: now })
      .where(eq(usersTable.id, userId));
  });

  return { success: true, pointsAwarded: pointValue, newBalance, message: `تم إضافة ${pointValue} نقطة` };
}

export async function computeTier(points: number) {
  const tiers = await db
    .select()
    .from(tiersTable)
    .orderBy(tiersTable.sortOrder);
  let currentTier = tiers[0];
  for (const tier of tiers) {
    if (points >= tier.minPoints && (tier.maxPoints === null || points <= tier.maxPoints)) {
      currentTier = tier;
      break;
    }
  }
  const nextTier = tiers.find(t => t.sortOrder > currentTier.sortOrder);
  return {
    currentTier,
    nextTier: nextTier ?? null,
    pointsToNextTier: nextTier ? nextTier.minPoints - points : 0,
    progress: nextTier
      ? Math.min(100, Math.max(0, ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100))
      : 100,
  };
}

export async function getUserStats(userId: number) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!user) return null;

  const tier = await computeTier(user.points);

  const recentTransactions = await db
    .select()
    .from(pointsTransactionsTable)
    .where(eq(pointsTransactionsTable.userId, userId))
    .orderBy(desc(pointsTransactionsTable.createdAt))
    .limit(10);

  const recentAchievements = await db
    .select({
      id: userAchievementsTable.id,
      awardedAt: userAchievementsTable.awardedAt,
      notified: userAchievementsTable.notified,
      achievement: achievementsTable,
    })
    .from(userAchievementsTable)
    .innerJoin(achievementsTable, eq(userAchievementsTable.achievementId, achievementsTable.id))
    .where(eq(userAchievementsTable.userId, userId))
    .orderBy(desc(userAchievementsTable.awardedAt))
    .limit(5);

  const [transactionsResult] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(pointsTransactionsTable)
    .where(eq(pointsTransactionsTable.userId, userId));

  return {
    points: user.points,
    lastActivityAt: user.lastActivityAt?.toISOString() ?? null,
    tier,
    transactionsCount: transactionsResult.count,
    recentTransactions: recentTransactions.map(tx => ({
      ...tx,
      createdAt: tx.createdAt.toISOString(),
    })),
    recentAchievements: recentAchievements.map(ua => ({
      id: ua.id,
      awardedAt: ua.awardedAt.toISOString(),
      notified: ua.notified,
      achievement: {
        key: ua.achievement.key,
        nameAr: ua.achievement.nameAr,
        nameEn: ua.achievement.nameEn,
        icon: ua.achievement.icon,
      },
    })),
  };
}

export async function getEarningActions() {
  return db
    .select()
    .from(earningActionsTable)
    .where(eq(earningActionsTable.enabled, true))
    .orderBy(earningActionsTable.actionKey);
}

export async function checkAchievements(userId: number) {
  const allAchievements = await db
    .select()
    .from(achievementsTable)
    .where(eq(achievementsTable.isActive, true));

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!user) return [];

  const awardedIds = new Set(
    (await db
      .select({ achievementId: userAchievementsTable.achievementId })
      .from(userAchievementsTable)
      .where(eq(userAchievementsTable.userId, userId))
    ).map(r => r.achievementId),
  );

  const newlyAwarded: typeof achievementsTable.$inferSelect[] = [];

  for (const achievement of allAchievements) {
    if (awardedIds.has(achievement.id)) continue;

    let earned = false;
    const criteria = achievement.criteria as Record<string, any>;
    switch (criteria.type) {
      case "action_count": {
        const [result] = await db
          .select({ count: sql<number>`COUNT(*)::int` })
          .from(pointsTransactionsTable)
          .where(
            and(
              eq(pointsTransactionsTable.userId, userId),
              eq(pointsTransactionsTable.actionType, criteria.actionKey),
            ),
          );
        earned = result.count >= criteria.count;
        break;
      }
      case "streak": {
        const txns = await db
          .select({ createdAt: pointsTransactionsTable.createdAt })
          .from(pointsTransactionsTable)
          .where(
            and(
              eq(pointsTransactionsTable.userId, userId),
              eq(pointsTransactionsTable.actionType, criteria.actionKey),
            ),
          )
          .orderBy(desc(pointsTransactionsTable.createdAt));
        if (txns.length >= criteria.streak) {
          earned = true;
        }
        break;
      }
      case "login_hour":
        earned = true;
        break;
    }

    if (earned) {
      await db.insert(userAchievementsTable).values({
        userId,
        achievementId: achievement.id,
      });
      if (achievement.pointReward > 0) {
        await awardPoints(userId, "achievement_reward", achievement.id, `ach_${userId}_${achievement.id}`);
      }
      newlyAwarded.push(achievement);
    }
  }

  return newlyAwarded;
}
