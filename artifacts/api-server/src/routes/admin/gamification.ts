import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";

const router = Router();

router.get("/admin/gamification", requireRole("admin"), requirePermission("admin.gamification"), async (_req, res) => {
  const [stats] = await db
    .select({
      totalUsers: sql<number>`count(*)`,
      usersWithPoints: sql<number>`count(*) filter (where points > 0)`,
      totalPoints: sql<number>`coalesce(sum(points), 0)`,
      averagePoints: sql<number>`coalesce(avg(points), 0)`,
    })
    .from(usersTable);

  const topUsers = await db
    .select({ id: usersTable.id, name: usersTable.name, points: usersTable.points })
    .from(usersTable)
    .orderBy(desc(usersTable.points))
    .limit(20);

  const tiers = [
    { name: "المبتدئ", minPoints: 0, maxPoints: 99 },
    { name: "المروج", minPoints: 100, maxPoints: 499 },
    { name: "السفير", minPoints: 500, maxPoints: 999 },
    { name: "المؤثر", minPoints: 1000, maxPoints: 4999 },
    { name: "الأسطورة", minPoints: 5000, maxPoints: Infinity },
  ];

  const tierDistribution = [];
  for (const tier of tiers) {
    const [count] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usersTable)
      .where(
        tier.maxPoints === Infinity
          ? sql`points >= ${tier.minPoints}`
          : sql`points >= ${tier.minPoints} AND points <= ${tier.maxPoints}`
      );
    tierDistribution.push({ name: tier.name, count: Number(count?.count ?? 0) });
  }

  res.json({
    totalUsers: Number(stats?.totalUsers ?? 0),
    usersWithPoints: Number(stats?.usersWithPoints ?? 0),
    totalPoints: Number(stats?.totalPoints ?? 0),
    averagePoints: Math.round(Number(stats?.averagePoints ?? 0)),
    topUsers,
    tierDistribution,
  });
});

router.post("/admin/gamification/points", requireRole("admin"), requirePermission("admin.gamification"), async (req, res) => {
  const { userId, points, reason } = req.body;
  if (!userId || points === undefined) { res.status(400).json({ error: "userId and points required" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const newPoints = Math.max(0, user.points + points);
  await db.update(usersTable).set({ points: newPoints }).where(eq(usersTable.id, userId));

  await logAudit(req, "update", "gamification", userId, { previousPoints: user.points, newPoints, change: points, reason });

  res.json({ userId, previousPoints: user.points, newPoints, change: points });
});

export default router;
