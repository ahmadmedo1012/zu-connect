import { Router } from "express";
import { db, adminEventsTable, activityLogsTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";

const router = Router();

router.get("/admin/live/events", requireRole("admin"), requirePermission("admin.live"), async (req, res) => {
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));

  // Combine recent admin events and activity logs for live feed
  const [events, activities] = await Promise.all([
    db.select().from(adminEventsTable).orderBy(desc(adminEventsTable.createdAt)).limit(limit),
    db.select({
      id: activityLogsTable.id,
      eventType: sql<string>`'activity_log'`,
      payload: sql<any>`jsonb_build_object('action', ${activityLogsTable.action}, 'userName', ${activityLogsTable.userName}, 'entity', ${activityLogsTable.entity})`,
      createdAt: activityLogsTable.createdAt,
    }).from(activityLogsTable).orderBy(desc(activityLogsTable.createdAt)).limit(limit),
  ]);

  const feed = [
    ...events.map((e) => ({ id: `event_${e.id}`, type: e.eventType, payload: e.payload, timestamp: e.createdAt })),
    ...activities.map((a: any) => ({ id: `activity_${a.id}`, type: "activity_log", payload: a.payload, timestamp: a.createdAt })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);

  res.json({ events: feed });
});

export default router;
