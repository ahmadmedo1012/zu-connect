import { Router } from "express";
import { db, auditLogsTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";

const router = Router();

router.get("/admin/audit", requireRole("admin"), requirePermission("admin.audit"), async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;
  const action = req.query.action as string | undefined;
  const entity = req.query.entity as string | undefined;

  let query = db.select().from(auditLogsTable);
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(auditLogsTable);

  if (action) {
    query = (query as any).where(eq(auditLogsTable.action, action));
    countQuery = (countQuery as any).where(eq(auditLogsTable.action, action));
  }
  if (entity) {
    query = (query as any).where(eq(auditLogsTable.entity, entity));
    countQuery = (countQuery as any).where(eq(auditLogsTable.entity, entity));
  }

  const [total, logs] = await Promise.all([
    countQuery,
    (query as any).orderBy(desc(auditLogsTable.createdAt)).limit(limit).offset(offset),
  ]);

  res.json({
    logs,
    pagination: { page, limit, total: Number(total[0]?.count ?? 0), totalPages: Math.ceil(Number(total[0]?.count ?? 0) / limit) },
  });
});

export default router;
