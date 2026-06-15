import { logger } from "../lib/logger";

type TelegramBot = any;

class TelegramService {
  private bot: TelegramBot | null = null;
  private initialized = false;
  private lastSentAt = 0;
  private queue: Array<{ chatId: string; message: string }> = [];
  private processing = false;

  async initialize() {
    if (this.initialized) return;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      logger.warn("TELEGRAM_BOT_TOKEN not set — Telegram notifications disabled");
      this.initialized = true;
      return;
    }

    try {
      const TelegramBot = (await import("node-telegram-bot-api")).default;
      this.bot = new TelegramBot(token, { polling: false });
      this.initialized = true;
      logger.info("Telegram service initialized");
    } catch (err) {
      logger.error({ err }, "Failed to initialize Telegram bot");
    }
  }

  async send(chatId: string, message: string): Promise<boolean> {
    if (!this.bot) return false;

    const now = Date.now();
    const minInterval = 1000 / 30;
    const waitTime = Math.max(0, minInterval - (now - this.lastSentAt));

    if (waitTime > 0) {
      await new Promise((r) => setTimeout(r, waitTime));
    }

    try {
      await this.bot.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
      this.lastSentAt = Date.now();
      return true;
    } catch (error: any) {
      logger.error({ err: error?.message }, "Telegram send failed");
      return false;
    }
  }

  async sendTest(chatId: string): Promise<boolean> {
    return this.send(
      chatId,
      "✅ ✅ ✅\n\nZU Connect — تم توصيل البوت بنجاح\nBot connected successfully"
    );
  }

  async notifyEvent(
    eventType: string,
    payload: Record<string, any>,
    getMapping: (type: string) => Promise<{ enabled: boolean; chatId?: string; template?: string } | null>
  ) {
    if (!this.bot) return;

    try {
      const mapping = await getMapping(eventType);
      if (!mapping || !mapping.enabled) return;

      const chatId = mapping.chatId || process.env.TELEGRAM_DEFAULT_CHAT_ID;
      if (!chatId) return;

      const template = mapping.template || this.getDefaultTemplate(eventType, payload);
      const message = this.renderTemplate(template, payload);

      this.queue.push({ chatId, message });
      this.processQueue();
    } catch (err) {
      logger.error({ err, eventType }, "Telegram notifyEvent failed");
    }
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      const success = await this.send(item.chatId, item.message);
      await this.logEvent("notification", item.chatId, item.message, success ? "sent" : "failed");
    }

    this.processing = false;
  }

  private async logEvent(eventType: string, chatId: string, message: string, status: string) {
    try {
      const { db, telegramLogsTable } = await import("@workspace/db");
      await db.insert(telegramLogsTable).values({
        eventType,
        chatId,
        message,
        status,
      });
    } catch (err) {
      logger.error({ err }, "Failed to log telegram event");
    }
  }

  private getDefaultTemplate(eventType: string, payload: Record<string, any>): string {
    const templates: Record<string, string> = {
      new_registration: `🆕 مستخدم جديد\n\nالاسم: ${payload.name}\nالمعرف: ${payload.identifier}\nالتاريخ: ${payload.timestamp}`,
      new_referral: `🔗 إحالة جديدة\n\nالمُحيل: ${payload.referrerName}\nالمُحال: ${payload.refereeName}\nالرمز: ${payload.code}`,
      referral_rewarded: `🎉 تمت مكافأة إحالة\n\nالمستخدم: ${payload.referrerName}\nالنقاط: +${payload.pointsAwarded}\nالإجمالي: ${payload.totalPoints}`,
      new_complaint: `📝 شكوى جديدة\n\nالاسم: ${payload.name}\nالنوع: ${payload.type}\nالرسالة: ${payload.message?.slice(0, 100)}`,
      new_suggestion: `💡 اقتراح جديد\n\nالاسم: ${payload.name}\nالنوع: ${payload.type}`,
      system_alert: `${payload.level === "error" ? "❌" : "⚠️"} ${payload.message}`,
      announcement_published: `📢 إعلان جديد: ${payload.title}`,
    };
    return templates[eventType] || `📢 حدث جديد: ${eventType}`;
  }

  private renderTemplate(template: string, vars: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => vars[key]?.toString() ?? `{${key}}`);
  }

  isReady(): boolean {
    return this.initialized && this.bot !== null;
  }
}

export const telegramService = new TelegramService();
