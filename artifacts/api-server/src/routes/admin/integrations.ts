import { Router } from "express";
import { db, integrationSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";

const router = Router();

router.get("/admin/integrations", requireRole("admin"), requirePermission("admin.integrations"), async (_req, res) => {
  const settings = await db.select().from(integrationSettingsTable);
  const safe = settings.map((s) => ({
    ...s,
    value: s.isSecret ? (s.value ? "••••••••" : null) : s.value,
  }));
  res.json(safe);
});

router.put("/admin/integrations/:key", requireRole("admin"), requirePermission("admin.integrations"), async (req, res) => {
  const key = req.params.key as string;
  const { value } = req.body;

  const [existing] = await db.select().from(integrationSettingsTable).where(eq(integrationSettingsTable.key, key));
  if (!existing) { res.status(404).json({ error: "Integration not found" }); return; }

  const [updated] = await db.update(integrationSettingsTable).set({ value, updatedAt: new Date() }).where(eq(integrationSettingsTable.key, key)).returning();

  await logAudit(req, "update", "integration", undefined, { key });

  res.json({ ...updated, value: updated.isSecret ? "••••••••" : updated.value });
});

export default router;
