import { Router } from "express";
import { db, usersTable, referralsTable, adminUsersTable, adminRolesTable } from "@workspace/db";
import { eq, desc, like, or, sql, and } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";
import { emitAdminEvent } from "../../services/admin-socket";

const router = Router();

router.get("/admin/users", requireRole("admin"), requirePermission("admin.users"), async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;

  let query = db.select().from(usersTable);
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(usersTable);

  if (search) {
    const searchPattern = `%${search}%`;
    const searchCond = or(like(usersTable.name, searchPattern), like(usersTable.identifier, searchPattern));
    query = (query as any).where(searchCond);
    countQuery = (countQuery as any).where(searchCond);
  }

  const [total, users] = await Promise.all([
    countQuery,
    (query as any).orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset),
  ]);

  const totalCount = Number(total[0]?.count ?? 0);

  res.json({
    users: users.map((u: any) => ({
      id: u.id,
      name: u.name,
      identifier: u.identifier,
      role: u.role,
      points: u.points,
      referralCode: u.referralCode,
      createdAt: u.createdAt,
    })),
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
});

router.get("/admin/users/:id", requireRole("admin"), requirePermission("admin.users"), async (req, res) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) { res.status(400).json({ error: "Invalid user ID" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const [referralStats] = await db
    .select({
      total: sql<number>`count(*)`,
      pending: sql<number>`count(*) filter (where status = 'pending')`,
      completed: sql<number>`count(*) filter (where status = 'completed')`,
      rewarded: sql<number>`count(*) filter (where status = 'rewarded')`,
      totalPoints: sql<number>`coalesce(sum(points_awarded), 0)`,
    })
    .from(referralsTable)
    .where(eq(referralsTable.referrerId, userId));

  res.json({
    id: user.id,
    name: user.name,
    identifier: user.identifier,
    role: user.role,
    points: user.points,
    referralCode: user.referralCode,
    createdAt: user.createdAt,
    referrals: {
      total: Number(referralStats?.total ?? 0),
      pending: Number(referralStats?.pending ?? 0),
      completed: Number(referralStats?.completed ?? 0),
      rewarded: Number(referralStats?.rewarded ?? 0),
      totalPoints: Number(referralStats?.totalPoints ?? 0),
    },
  });
});

router.put("/admin/users/:id/role", requireRole("admin"), requirePermission("admin.users"), async (req, res) => {
  const userId = Number(req.params.id);
  const { role } = req.body;

  if (isNaN(userId)) { res.status(400).json({ error: "Invalid user ID" }); return; }
  if (!["student", "teacher", "admin"].includes(role)) { res.status(400).json({ error: "Invalid role" }); return; }

  const [oldUser] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!oldUser) { res.status(404).json({ error: "User not found" }); return; }

  const [updated] = await db.update(usersTable).set({ role }).where(eq(usersTable.id, userId)).returning();

  await logAudit(req, "update", "user_role", userId, { previousRole: oldUser.role, newRole: role });

  emitAdminEvent("admin:user_role_changed", {
    userId: updated.id,
    name: updated.name,
    previousRole: oldUser.role,
    newRole: updated.role,
    changedBy: req.user!.id,
    changedByName: req.user!.name,
    timestamp: new Date().toISOString(),
  });

  res.json({ id: updated.id, name: updated.name, role: updated.role });
});

export default router;
