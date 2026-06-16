import { Router } from "express";
import { db, usersTable, referralsTable, activityLogsTable, suggestionsTable, announcementsTable } from "@workspace/db";
import { sql, gte } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";

const router = Router();

router.get("/admin/analytics", requireRole("admin"), requirePermission("admin.analytics"), async (req, res) => {
  const now = new Date();
  const days = Math.min(365, Math.max(1, Number(req.query.days) || 30));
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const [userGrowth] = await db
    .select({
      total: sql<number>`count(*)`,
      lastPeriod: sql<number>`count(*) filter (where created_at >= ${since})`,
    })
    .from(usersTable);

  const [referralAnalytics] = await db
    .select({
      total: sql<number>`count(*)`,
      lastPeriod: sql<number>`count(*) filter (where created_at >= ${since})`,
      totalPoints: sql<number>`coalesce(sum(points_awarded), 0)`,
    })
    .from(referralsTable);

  const activityByDay: Array<{ date: string; count: number }> = await db
    .select({
      date: sql<string>`date(created_at)`,
      count: sql<number>`count(*)`,
    })
    .from(activityLogsTable)
    .where(gte(activityLogsTable.createdAt, since))
    .groupBy(sql`date(created_at)`)
    .orderBy(sql`date(created_at)`) as any;

  const [suggestionsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(suggestionsTable)
    .where(gte(suggestionsTable.createdAt, since));

  const [announcementCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(announcementsTable);

  res.json({
    users: {
      total: Number(userGrowth?.total ?? 0),
      newLastPeriod: Number(userGrowth?.lastPeriod ?? 0),
    },
    referrals: {
      total: Number(referralAnalytics?.total ?? 0),
      newLastPeriod: Number(referralAnalytics?.lastPeriod ?? 0),
      totalPointsAwarded: Number(referralAnalytics?.totalPoints ?? 0),
    },
    activity: activityByDay.map((a: any) => ({
      date: a.date,
      count: Number(a.count),
    })),
    suggestions: Number(suggestionsCount?.count ?? 0),
    announcements: Number(announcementCount?.count ?? 0),
    periodDays: days,
  });
});

export default router;
