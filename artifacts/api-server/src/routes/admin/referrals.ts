import { Router } from "express";
import { db, referralsTable, usersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";

const router = Router();

router.get("/admin/referrals", requireRole("admin"), requirePermission("admin.referrals"), async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const [total, referrals] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(referralsTable),
    db.select({
      id: referralsTable.id,
      code: referralsTable.code,
      status: referralsTable.status,
      pointsAwarded: referralsTable.pointsAwarded,
      referrerName: usersTable.name,
      createdAt: referralsTable.createdAt,
    })
      .from(referralsTable)
      .innerJoin(usersTable, eq(referralsTable.referrerId, usersTable.id))
      .orderBy(desc(referralsTable.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  const totalCount = Number(total[0]?.count ?? 0);

  res.json({
    referrals,
    pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
  });
});

router.get("/admin/referrals/stats", requireRole("admin"), requirePermission("admin.referrals"), async (_req, res) => {
  const [totalStats] = await db
    .select({
      total: sql<number>`count(*)`,
      pending: sql<number>`count(*) filter (where status = 'pending')`,
      completed: sql<number>`count(*) filter (where status = 'completed')`,
      rewarded: sql<number>`count(*) filter (where status = 'rewarded')`,
      totalPoints: sql<number>`coalesce(sum(points_awarded), 0)`,
    })
    .from(referralsTable);

  const topReferrers = await db
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      count: sql<number>`count(*)`,
      points: sql<number>`coalesce(sum(${referralsTable.pointsAwarded}), 0)`,
    })
    .from(referralsTable)
    .innerJoin(usersTable, eq(referralsTable.referrerId, usersTable.id))
    .groupBy(usersTable.id, usersTable.name)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  res.json({
    total: Number(totalStats?.total ?? 0),
    pending: Number(totalStats?.pending ?? 0),
    completed: Number(totalStats?.completed ?? 0),
    rewarded: Number(totalStats?.rewarded ?? 0),
    totalPoints: Number(totalStats?.totalPoints ?? 0),
    topReferrers,
  });
});

export default router;
