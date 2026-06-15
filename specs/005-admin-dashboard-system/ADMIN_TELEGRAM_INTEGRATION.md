# ADMIN TELEGRAM INTEGRATION

## Overview

Telegram bot sends notifications about important platform events to a configured chat or group. Admins can configure which events trigger notifications, the target chat ID, and message templates.

## Environment Variables

```bash
# Required
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Optional (can be set via admin settings UI)
TELEGRAM_DEFAULT_CHAT_ID=-1001234567890
```

## Bot Setup

1. Create bot via [@BotFather](https://t.me/BotFather) on Telegram
2. Get bot token
3. Add bot to target group
4. Get group chat ID (via API or @userinfobot)

## Architecture

```
Platform Event
     │
     ▼
Event Router ──► Telegram Service
                     │
                     ▼
              Throttle Queue
                     │
                     ▼
              Telegram API
                     │
                     ▼
              Configured Chat
```

## Event → Notification Mapping

| Platform Event | Telegram Message | Default Enabled | Priority |
|---------------|-----------------|-----------------|----------|
| New user registration | 🆕 مستخدم جديد: {name} ({identifier}) | Yes | Normal |
| New referral | 🔗 إحالة جديدة: {refereeName} → {referrerName} | Yes | Normal |
| Referral rewarded | 🎉 تمت مكافأة الإحالة: {referrerName} +{points} نقطة | Yes | High |
| Urgent complaint | ⚠️ شكوى عاجلة: {name} - {type} | Yes | Urgent |
| New complaint | 📝 شكوى جديدة: {name} - {type} | No | Normal |
| New suggestion | 💡 اقتراح جديد: {name} - {type} | No | Normal |
| System error | ❌ خطأ في النظام: {message} | Yes | Urgent |
| Announcement published | 📢 إعلان جديد: {title} | Yes | Normal |
| Course enrollment full | 🎯 اكتمل مقاعد الدورة: {courseTitle} | No | Normal |
| Moderation escalation | 🔺 تصعيد مراجعة: {itemType} | Yes | High |

## Message Templates

Templates support variable interpolation:

```
Template: "🆕 مستخدم جديد: {name} ({identifier})"
Variables:
  {name}       - User display name
  {identifier} - User identifier (student ID / email)
  {timestamp}  - Event timestamp
  {platform}   - "ZU Connect"

Template: "⚠️ شكوى عاجلة\n\nالاسم: {name}\nالنوع: {type}\nالرسالة: {messagePreview}\nالتاريخ: {timestamp}"
```

## Throttling / Spam Prevention

| Rule | Limit | Action |
|------|-------|--------|
| Messages per second | 30 | Queue and stagger |
| Messages per minute | 20 per chat | Queue with delay |
| Messages per hour | 100 per bot | Alert admin if approaching |
| Same event type | 1 per 5 seconds | Deduplicate coalesced events |

## Database Schema

```sql
CREATE TABLE telegram_config (
  id              SERIAL PRIMARY KEY,
  bot_token       TEXT,                        -- Stored encrypted, can be env var
  default_chat_id TEXT,
  enabled         BOOLEAN DEFAULT true,
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE telegram_event_mappings (
  id              SERIAL PRIMARY KEY,
  event_type      TEXT NOT NULL UNIQUE,        -- "new_registration", "new_referral", etc.
  enabled         BOOLEAN DEFAULT false,
  chat_id         TEXT,                        -- Override chat for this event type
  template        TEXT,                        -- Custom message template
  priority        TEXT DEFAULT 'normal'        -- "normal", "high", "urgent"
);

CREATE TABLE telegram_logs (
  id              SERIAL PRIMARY KEY,
  event_type      TEXT NOT NULL,
  chat_id         TEXT NOT NULL,
  message         TEXT NOT NULL,
  status          TEXT NOT NULL,               -- "sent", "failed", "queued"
  error           TEXT,
  sent_at         TIMESTAMP DEFAULT NOW()
);
```

## Service Implementation

```typescript
class TelegramService {
  private bot: TelegramBot | null = null;
  private queue: Array<{ chatId: string; message: string }> = [];
  private lastSentAt: number = 0;

  async initialize() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      logger.warn("TELEGRAM_BOT_TOKEN not set, Telegram disabled");
      return;
    }
    // Dynamic import for node-telegram-bot-api
    const TelegramBot = (await import("node-telegram-bot-api")).default;
    this.bot = new TelegramBot(token, { polling: false });
  }

  async send(chatId: string, message: string): Promise<boolean> {
    // Throttle check
    const now = Date.now();
    const minInterval = 1000 / 30; // 30 msg/sec max
    const waitTime = Math.max(0, minInterval - (now - this.lastSentAt));
    
    if (waitTime > 0) {
      await new Promise(r => setTimeout(r, waitTime));
    }

    if (!this.bot) return false;

    try {
      await this.bot.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
      this.lastSentAt = Date.now();
      return true;
    } catch (error) {
      logger.error({ err: error }, "Telegram send failed");
      return false;
    }
  }

  async sendTest(chatId: string): Promise<boolean> {
    return this.send(chatId, "✅ ✅ ✅\n\nZU Connect\nتم توصيل البوت بنجاح\n\nBot connected successfully");
  }

  async notifyEvent(eventType: string, payload: Record<string, any>) {
    const mapping = await getEventMapping(eventType);
    if (!mapping || !mapping.enabled) return;

    const chatId = mapping.chat_id || process.env.TELEGRAM_DEFAULT_CHAT_ID;
    if (!chatId) return;

    const message = this.renderTemplate(mapping.template, payload);
    const success = await this.send(chatId, message);

    await logTelegramEvent(eventType, chatId, message, success ? "sent" : "failed");
  }

  private renderTemplate(template: string, vars: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => vars[key]?.toString() ?? `{${key}}`);
  }
}
```

## Admin Configuration UI

Settings panel under Integrations → Telegram:
- Bot token (password field, masked)
- Default chat ID
- Enable/disable toggle
- Per-event type configuration with enable/disable, custom chat ID, custom template
- Test message button
- Send log history with status indicators

## Fallback Behavior

- Missing bot token: Section shows "غير مكون" (Not configured) with setup instructions
- API failure: Logged to telegram_logs; dashboard shows warning indicator
- Rate limited: Messages queued and retried; if queue exceeds 100 items, oldest dropped
- Bot removed from group: Daily health check; disabled state shown in admin UI
