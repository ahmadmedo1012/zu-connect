import { Router } from "express";
import { db, systemSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";

const router = Router();

router.get("/admin/settings", requireRole("admin"), requirePermission("admin.settings"), async (_req, res) => {
  const settings = await db.select().from(systemSettingsTable);
  res.json(settings);
});

router.put("/admin/settings/:key", requireRole("admin"), requirePermission("admin.settings"), async (req, res) => {
  const key = req.params.key as string;
  const { value } = req.body;
  if (value === undefined) { res.status(400).json({ error: "value is required" }); return; }

  const [existing] = await db.select().from(systemSettingsTable).where(eq(systemSettingsTable.key, key));
  if (!existing) { res.status(404).json({ error: "Setting not found" }); return; }

  const [updated] = await db.update(systemSettingsTable).set({ value: JSON.parse(JSON.stringify(value)), updatedAt: new Date() }).where(eq(systemSettingsTable.key, key)).returning();

  await logAudit(req, "update", "system_setting", undefined, { key, previousValue: existing.value, newValue: value });

  res.json(updated);
});

export default router;
