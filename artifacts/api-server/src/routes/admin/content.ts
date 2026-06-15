import { Router } from "express";
import { db, newsTable, coursesTable, membersTable, collegesTable, libraryTable, plannerTable, faqTable, leadershipTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";
import { emitAdminEvent } from "../../services/admin-socket";

const router = Router();

function crudRoutes(entityName: string, table: any, allowedFields: string[]) {
  const r = Router();

  r.get(`/admin/content/${entityName}`, requireRole("admin"), requirePermission("admin.content"), async (req, res) => {
    const items = await db.select().from(table).orderBy(desc(table.createdAt));
    res.json(items);
  });

  r.post(`/admin/content/${entityName}`, requireRole("admin"), requirePermission("admin.content"), async (req, res) => {
    const values: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) values[field] = req.body[field];
    }
    const items = await db.insert(table).values(values).returning() as any[];
    const item = items[0];
    await logAudit(req, "create", entityName, item.id, values);
    emitAdminEvent("admin:content_created", { entity: entityName, entityId: item.id, createdBy: req.user!.id, createdByName: req.user!.name, timestamp: new Date().toISOString() });
    res.status(201).json(item);
  });

  r.put(`/admin/content/${entityName}/:id`, requireRole("admin"), requirePermission("admin.content"), async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const values: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) values[field] = req.body[field];
    }
    const [existing] = await db.select().from(table).where(eq(table.id, id));
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    const items = await db.update(table).set(values).where(eq(table.id, id)).returning() as any[];
    const item = items[0];
    await logAudit(req, "update", entityName, id, values);
    emitAdminEvent("admin:content_updated", { entity: entityName, entityId: id, updatedBy: req.user!.id, updatedByName: req.user!.name, timestamp: new Date().toISOString() });
    res.json(item);
  });

  r.delete(`/admin/content/${entityName}/:id`, requireRole("admin"), requirePermission("admin.content"), async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [existing] = await db.select().from(table).where(eq(table.id, id));
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    await db.delete(table).where(eq(table.id, id));
    await logAudit(req, "delete", entityName, id, {});
    emitAdminEvent("admin:content_deleted", { entity: entityName, entityId: id, deletedBy: req.user!.id, deletedByName: req.user!.name, timestamp: new Date().toISOString() });
    res.json({ deleted: true });
  });

  return r;
}

const newsFields = ["title", "body", "category", "date"];
const courseFields = ["title", "description", "instructor", "duration", "level", "category", "totalSeats", "colorScheme"];
const memberFields = ["name", "role", "department", "year", "category", "initials"];
const collegeFields = ["name", "studentCount", "hasNews", "hasSchedules", "hasFiles", "hasActivities", "icon"];
const libraryFields = ["title", "subtitle", "type", "rating", "college"];
const plannerFields = ["title", "description", "date", "month", "icon"];
const faqFields = ["question", "answer", "category"];
const leadershipFields = ["name", "role"];

router.use(crudRoutes("news", newsTable, newsFields));
router.use(crudRoutes("courses", coursesTable, courseFields));
router.use(crudRoutes("members", membersTable, memberFields));
router.use(crudRoutes("colleges", collegesTable, collegeFields));
router.use(crudRoutes("library", libraryTable, libraryFields));
router.use(crudRoutes("planner", plannerTable, plannerFields));
router.use(crudRoutes("faq", faqTable, faqFields));
router.use(crudRoutes("leadership", leadershipTable, leadershipFields));

export default router;
