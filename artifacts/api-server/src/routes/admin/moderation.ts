import { Router } from "express";
import { db, suggestionsTable } from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";
import { emitAdminEvent } from "../../services/admin-socket";

const router = Router();

router.get("/admin/moderation", requireRole("admin"), requirePermission("admin.moderation"), async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;
  const status = req.query.status as string | undefined;
  const type = req.query.type as string | undefined;

  const filters: any[] = [];
  if (status) {
    filters.push(eq(suggestionsTable.type, status === "resolved" ? "شكوى" : status));
  }
  if (type) {
    filters.push(eq(suggestionsTable.type, type));
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined;
  let query = whereClause ? (db.select().from(suggestionsTable).where(whereClause) as any) : (db.select().from(suggestionsTable) as any);
  let countQuery = whereClause ? (db.select({ count: sql<number>`count(*)` }).from(suggestionsTable).where(whereClause) as any) : db.select({ count: sql<number>`count(*)` }).from(suggestionsTable);

  const [total, items] = await Promise.all([
    countQuery,
    (query as any).orderBy(desc(suggestionsTable.createdAt)).limit(limit).offset(offset),
  ]);

  const totalCount = Number(total[0]?.count ?? 0);

  res.json({
    items: items.map((i: any) => ({
      id: i.id,
      name: i.name || "مجهول",
      college: i.college,
      type: i.type,
      message: i.message,
      createdAt: i.createdAt,
    })),
    pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
  });
});

router.delete("/admin/moderation/:id", requireRole("admin"), requirePermission("admin.moderation"), async (req, res) => {
  const itemId = Number(req.params.id);
  if (isNaN(itemId)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [item] = await db.select().from(suggestionsTable).where(eq(suggestionsTable.id, itemId));
  if (!item) { res.status(404).json({ error: "Not found" }); return; }

  await db.delete(suggestionsTable).where(eq(suggestionsTable.id, itemId));

  await logAudit(req, "delete", "moderation", itemId, { type: item.type, message: item.message?.slice(0, 100) });

  emitAdminEvent("admin:moderation_action", {
    itemId, action: "deleted", itemType: item.type,
    actionBy: req.user!.id, actionByName: req.user!.name,
    timestamp: new Date().toISOString(),
  });

  res.json({ deleted: true });
});

export default router;
