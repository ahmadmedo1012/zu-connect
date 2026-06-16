import { Router } from "express";
import { db, telegramEventMappingsTable, telegramLogsTable, integrationSettingsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireRole, requirePermission } from "../../middlewares/auth";
import { logAudit } from "../../services/audit";
import { telegramService } from "../../services/telegram";

const router = Router();

router.get("/admin/telegram/config", requireRole("admin"), requirePermission("admin.telegram"), async (_req, res) => {
  const [botToken] = await db.select().from(integrationSettingsTable).where(eq(integrationSettingsTable.key, "telegram_bot_token")).limit(1);
  const [defaultChatId] = await db.select().from(integrationSettingsTable).where(eq(integrationSettingsTable.key, "telegram_default_chat_id")).limit(1);
  const mappings = await db.select().from(telegramEventMappingsTable);

  res.json({
    botTokenConfigured: !!botToken?.value,
    defaultChatId: defaultChatId?.value || null,
    isServiceReady: telegramService.isReady(),
    mappings,
  });
});

router.put("/admin/telegram/config", requireRole("admin"), requirePermission("admin.telegram"), async (req, res) => {
  const { botToken, defaultChatId } = req.body;

  if (botToken !== undefined) {
    const [existing] = await db.select().from(integrationSettingsTable).where(eq(integrationSettingsTable.key, "telegram_bot_token")).limit(1);
    if (existing) {
      await db.update(integrationSettingsTable).set({ value: botToken, updatedAt: new Date() }).where(eq(integrationSettingsTable.key, "telegram_bot_token"));
    } else {
      await db.insert(integrationSettingsTable).values({
        key: "telegram_bot_token", value: botToken, type: "password",
        category: "telegram", description: "Telegram Bot Token", isSecret: true,
      });
    }
    // Reinitialize telegram service with new token
    process.env.TELEGRAM_BOT_TOKEN = botToken;
    await telegramService.initialize(true);
  }

  if (defaultChatId !== undefined) {
    const [existing] = await db.select().from(integrationSettingsTable).where(eq(integrationSettingsTable.key, "telegram_default_chat_id")).limit(1);
    if (existing) {
      await db.update(integrationSettingsTable).set({ value: defaultChatId, updatedAt: new Date() }).where(eq(integrationSettingsTable.key, "telegram_default_chat_id"));
    } else {
      await db.insert(integrationSettingsTable).values({
        key: "telegram_default_chat_id", value: defaultChatId, type: "string",
        category: "telegram", description: "Default Telegram Chat ID",
      });
    }
    process.env.TELEGRAM_DEFAULT_CHAT_ID = defaultChatId;
  }

  await logAudit(req, "update", "telegram_config", undefined, { botTokenConfigured: !!botToken, defaultChatIdConfigured: !!defaultChatId });

  // Update event mappings if provided
  if (req.body.mappings) {
    for (const mapping of req.body.mappings) {
      const [existing] = await db.select().from(telegramEventMappingsTable).where(eq(telegramEventMappingsTable.eventType, mapping.eventType)).limit(1);
      if (existing) {
        await db.update(telegramEventMappingsTable).set({
          enabled: mapping.enabled,
          chatId: mapping.chatId,
          template: mapping.template,
        }).where(eq(telegramEventMappingsTable.eventType, mapping.eventType));
      } else {
        await db.insert(telegramEventMappingsTable).values({
          eventType: mapping.eventType, enabled: mapping.enabled ?? false,
          chatId: mapping.chatId, template: mapping.template, priority: mapping.priority ?? "normal",
        });
      }
    }
  }

  res.json({ success: true });
});

router.post("/admin/telegram/test", requireRole("admin"), requirePermission("admin.telegram"), async (req, res) => {
  const { chatId } = req.body;
  const targetChatId = chatId || process.env.TELEGRAM_DEFAULT_CHAT_ID;

  if (!targetChatId) { res.status(400).json({ error: "No chat ID provided or configured" }); return; }

  const success = await telegramService.sendTest(targetChatId);
  res.json({ success, message: success ? "Test message sent" : "Failed to send test message" });
});

router.get("/admin/telegram/logs", requireRole("admin"), requirePermission("admin.telegram"), async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const [total, logs] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(telegramLogsTable),
    db.select().from(telegramLogsTable).orderBy(desc(telegramLogsTable.sentAt)).limit(limit).offset(offset),
  ]);

  res.json({
    logs,
    pagination: { page, limit, total: Number(total[0]?.count ?? 0), totalPages: Math.ceil(Number(total[0]?.count ?? 0) / limit) },
  });
});

export default router;
