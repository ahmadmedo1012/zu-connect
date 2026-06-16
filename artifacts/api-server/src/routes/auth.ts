import { Router } from "express";
import { db, db as adminDb, usersTable, activityLogsTable, telegramEventMappingsTable, pointsTransactionsTable } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";
import { emitAdminEvent } from "../services/admin-socket";
import { telegramService } from "../services/telegram";
import { awardPoints } from "../services/loyalty";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const { identifier, password, role } = req.body;
  if (!identifier || !password || !role) {
    res.status(400).json({ error: "identifier, password, and role are required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.identifier, identifier))
    .limit(1);

  if (!user || user.password !== password || user.role !== role) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    role: user.role,
    identifier: user.identifier,
  })).toString("base64url");

  // Log login activity
  try {
    await adminDb.insert(activityLogsTable).values({
      userId: user.id,
      userName: user.name,
      action: "login",
      entity: "user",
      ipAddress: req.ip || req.socket.remoteAddress || "unknown",
    });
  } catch { /* non-blocking */ }

  // Award daily login points (once per day)
  let dailyLoginPoints = 0;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [todayLogin] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(pointsTransactionsTable)
      .where(
        and(
          eq(pointsTransactionsTable.userId, user.id),
          eq(pointsTransactionsTable.actionType, "daily_login"),
          gte(pointsTransactionsTable.createdAt, today),
        ),
      );
    if (!todayLogin || todayLogin.count === 0) {
      const result = await awardPoints(user.id, "daily_login", undefined, `daily_${user.id}_${new Date().toISOString().split("T")[0]}`);
      if (result.success) dailyLoginPoints = result.pointsAwarded;
    }
  } catch { /* non-blocking */ }

  // Emit real-time event for admin
  emitAdminEvent("admin:new_login", {
    userId: user.id,
    name: user.name,
    role: user.role,
    identifier: user.identifier,
    ipAddress: req.ip || req.socket.remoteAddress || "unknown",
    timestamp: new Date().toISOString(),
  });

  // Send Telegram notification
  telegramService.notifyEvent("new_registration", {
    name: user.name,
    identifier: user.identifier,
    role: user.role,
    timestamp: new Date().toISOString(),
  }, async (type: string) => {
    const [mapping] = await adminDb.select().from(telegramEventMappingsTable).where(eq(telegramEventMappingsTable.eventType, type)).limit(1);
    return mapping ? { enabled: mapping.enabled, chatId: mapping.chatId ?? undefined, template: mapping.template ?? undefined } : null;
  });

  res.json({ token, name: user.name, role: user.role, dailyLoginPoints });
});

export default router;
