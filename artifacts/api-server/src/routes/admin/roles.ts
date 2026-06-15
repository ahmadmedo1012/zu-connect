import { Router } from "express";
import { db, adminRolesTable, adminUsersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireRole, requirePermission, clearPermissionCache } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";

const router = Router();

const ALL_PERMISSIONS = [
  "admin.view", "admin.users", "admin.roles", "admin.live",
  "admin.moderation", "admin.complaints", "admin.referrals",
  "admin.gamification", "admin.announcements", "admin.files",
  "admin.activity", "admin.analytics", "admin.integrations",
  "admin.telegram", "admin.settings", "admin.audit", "admin.content",
  "admin.content.create", "admin.content.edit", "admin.content.delete",
  "admin.users.ban", "admin.users.edit_role",
  "admin.moderation.resolve", "admin.moderation.escalate",
  "admin.announcements.publish", "admin.settings.system",
  "admin.settings.integrations",
];

router.get("/admin/roles", requireRole("admin"), requirePermission("admin.roles"), async (req, res) => {
  const roles = await db.select().from(adminRolesTable).orderBy(desc(adminRolesTable.level));
  res.json(roles);
});

router.get("/admin/permissions", requireRole("admin"), requirePermission("admin.roles"), async (_req, res) => {
  res.json(ALL_PERMISSIONS);
});

router.post("/admin/roles", requireRole("admin"), requirePermission("admin.roles"), async (req, res) => {
  const { name, label, level, permissions } = req.body;
  if (!name || !label) { res.status(400).json({ error: "name and label are required" }); return; }

  const [existing] = await db.select().from(adminRolesTable).where(eq(adminRolesTable.name, name));
  if (existing) { res.status(409).json({ error: "Role already exists" }); return; }

  const [role] = await db.insert(adminRolesTable).values({
    name, label, level: level ?? 0, permissions: permissions ?? [],
  }).returning();

  await logAudit(req, "create", "role", role.id, { name, label, level, permissions });

  res.status(201).json(role);
});

router.put("/admin/roles/:id", requireRole("admin"), requirePermission("admin.roles"), async (req, res) => {
  const roleId = Number(req.params.id);
  if (isNaN(roleId)) { res.status(400).json({ error: "Invalid role ID" }); return; }

  const [existing] = await db.select().from(adminRolesTable).where(eq(adminRolesTable.id, roleId));
  if (!existing) { res.status(404).json({ error: "Role not found" }); return; }

  const updates: Record<string, any> = {};
  if (req.body.label) updates.label = req.body.label;
  if (req.body.level !== undefined) updates.level = req.body.level;
  if (req.body.permissions) updates.permissions = req.body.permissions;

  const [updated] = await db.update(adminRolesTable).set(updates).where(eq(adminRolesTable.id, roleId)).returning();

  // Clear permission cache for all users with this role
  const adminUsers = await db.select().from(adminUsersTable).where(eq(adminUsersTable.roleId, roleId));
  for (const au of adminUsers) {
    clearPermissionCache(au.userId);
  }

  await logAudit(req, "update", "role", roleId, updates);

  res.json(updated);
});

router.delete("/admin/roles/:id", requireRole("admin"), requirePermission("admin.roles"), async (req, res) => {
  const roleId = Number(req.params.id);
  if (isNaN(roleId)) { res.status(400).json({ error: "Invalid role ID" }); return; }

  const [existing] = await db.select().from(adminRolesTable).where(eq(adminRolesTable.id, roleId));
  if (!existing) { res.status(404).json({ error: "Role not found" }); return; }

  await db.delete(adminRolesTable).where(eq(adminRolesTable.id, roleId));

  await logAudit(req, "delete", "role", roleId, { name: existing.name });

  res.json({ deleted: true });
});

export default router;
