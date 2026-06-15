import { Router } from "express";
import { db, announcementsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";
import { emitAdminEvent } from "../../services/admin-socket";

const router = Router();

router.get("/admin/announcements", requireRole("admin"), requirePermission("admin.announcements"), async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const [total, announcements] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(announcementsTable),
    db.select().from(announcementsTable).orderBy(desc(announcementsTable.createdAt)).limit(limit).offset(offset),
  ]);

  res.json({
    announcements,
    pagination: { page, limit, total: Number(total[0]?.count ?? 0), totalPages: Math.ceil(Number(total[0]?.count ?? 0) / limit) },
  });
});

router.post("/admin/announcements", requireRole("admin"), requirePermission("admin.announcements"), async (req, res) => {
  const { title, content, priority } = req.body;
  if (!title || !content) { res.status(400).json({ error: "title and content are required" }); return; }

  const [announcement] = await db.insert(announcementsTable).values({
    title, content, priority: priority || "normal",
  }).returning();

  await logAudit(req, "create", "announcement", announcement.id, { title, priority });

  res.status(201).json(announcement);
});

router.put("/admin/announcements/:id", requireRole("admin"), requirePermission("admin.announcements"), async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [existing] = await db.select().from(announcementsTable).where(eq(announcementsTable.id, id));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }

  const updates: Record<string, any> = {};
  if (req.body.title) updates.title = req.body.title;
  if (req.body.content) updates.content = req.body.content;
  if (req.body.priority) updates.priority = req.body.priority;
  if (req.body.status) updates.status = req.body.status;

  if (req.body.status === "published" && existing.status !== "published") {
    updates.publishedById = req.user!.id;
    updates.publishedAt = new Date();
    emitAdminEvent("admin:announcement_published", {
      announcementId: id, title: existing.title, priority: existing.priority,
      publishedBy: req.user!.id, publishedByName: req.user!.name,
      timestamp: new Date().toISOString(),
    });
  }

  updates.updatedAt = new Date();

  const [updated] = await db.update(announcementsTable).set(updates).where(eq(announcementsTable.id, id)).returning();

  await logAudit(req, "update", "announcement", id, updates);

  res.json(updated);
});

router.delete("/admin/announcements/:id", requireRole("admin"), requirePermission("admin.announcements"), async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [existing] = await db.select().from(announcementsTable).where(eq(announcementsTable.id, id));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }

  await db.delete(announcementsTable).where(eq(announcementsTable.id, id));

  await logAudit(req, "delete", "announcement", id, { title: existing.title });

  res.json({ deleted: true });
});

export default router;
