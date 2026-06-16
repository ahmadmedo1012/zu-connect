import { Router } from "express";
import { db, db as adminDb, usersTable, activityLogsTable, telegramEventMappingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { emitAdminEvent } from "../services/admin-socket";
import { telegramService } from "../services/telegram";

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

  res.json({ token, name: user.name, role: user.role });
});

export default router;
