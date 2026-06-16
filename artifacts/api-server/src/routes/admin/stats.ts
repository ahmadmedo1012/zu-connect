import { Router } from "express";
import { db, usersTable, newsTable, coursesTable, membersTable, collegesTable, libraryTable, referralsTable, suggestionsTable, announcementsTable, activityLogsTable } from "@workspace/db";
import { sql, eq, and, gte } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";

const router = Router();

router.get("/admin/stats", requireRole("admin"), requirePermission("admin.view"), async (req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    usersCount,
    newsCount,
    coursesCount,
    membersCount,
    collegesCount,
    libraryCount,
    referralsCount,
    suggestionsCount,
    announcementsCount,
    recentLogins,
    recentReferrals,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(usersTable),
    db.select({ count: sql<number>`count(*)` }).from(newsTable),
    db.select({ count: sql<number>`count(*)` }).from(coursesTable),
    db.select({ count: sql<number>`count(*)` }).from(membersTable),
    db.select({ count: sql<number>`count(*)` }).from(collegesTable),
    db.select({ count: sql<number>`count(*)` }).from(libraryTable),
    db.select({ count: sql<number>`count(*)` }).from(referralsTable),
    db.select({ count: sql<number>`count(*)` }).from(suggestionsTable),
    db.select({ count: sql<number>`count(*)` }).from(announcementsTable),
    db.select({ count: sql<number>`count(*)` }).from(activityLogsTable).where(and(gte(activityLogsTable.createdAt, thirtyDaysAgo), eq(activityLogsTable.action, "login"))),
    db.select({ count: sql<number>`count(*)` }).from(referralsTable).where(gte(referralsTable.createdAt, thirtyDaysAgo)),
  ]);

  res.json({
    users: Number(usersCount[0]?.count ?? 0),
    news: Number(newsCount[0]?.count ?? 0),
    courses: Number(coursesCount[0]?.count ?? 0),
    members: Number(membersCount[0]?.count ?? 0),
    colleges: Number(collegesCount[0]?.count ?? 0),
    library: Number(libraryCount[0]?.count ?? 0),
    referrals: Number(referralsCount[0]?.count ?? 0),
    suggestions: Number(suggestionsCount[0]?.count ?? 0),
    announcements: Number(announcementsCount[0]?.count ?? 0),
    recentLogins30d: Number(recentLogins[0]?.count ?? 0),
    recentReferrals30d: Number(recentReferrals[0]?.count ?? 0),
  });
});

export default router;
