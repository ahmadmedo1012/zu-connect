# Data Model: Loyalty System Enhancement

**Phase 1 output** — defines all new and modified database entities for the loyalty system.

## 🔶 Modified Tables

### `users` — Add `last_activity_at` column

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `last_activity_at` | `timestamp` (new) | `now()` | Tracks last point-earning activity for expiration logic |

Validation:
- Set to `now()` whenever a points transaction is created for the user
- Used by daily expiration cron to determine inactivity period

## 🆕 New Tables

### `points_transactions` — Immutable point change ledger

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment ID |
| `user_id` | `integer` | FK → users.id, NOT NULL, indexed | User who earned/spent |
| `action_type` | `text` | NOT NULL | One of: `referral`, `daily_login`, `suggestion`, `content_share`, `profile_complete`, `event_attendance`, `reward_redemption`, `admin_adjustment`, `expiration`, `achievement_reward` |
| `points_change` | `integer` | NOT NULL | Positive = earned, Negative = spent/expired |
| `balance_after` | `integer` | NOT NULL | Running balance after this transaction |
| `reference_id` | `integer` | nullable | FK to related entity (referral_id, reward_id, achievement_id, etc.) |
| `admin_note` | `text` | nullable | Required for `admin_adjustment` type |
| `idempotency_key` | `text` | nullable, unique | Prevents duplicate point awards |
| `created_at` | `timestamp` | NOT NULL, default `now()` | Transaction timestamp |

Indexes:
- `idx_points_tx_user` on `(user_id, created_at DESC)` — for history queries
- `idx_points_tx_type` on `(action_type, created_at DESC)` — for analytics
- `unique_idx_idempotency` on `(idempotency_key)` — dedup protection

State: Immutable — no UPDATE or DELETE after creation (soft-delete not needed).

### `earning_actions` — Configurable point-earning action definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment ID |
| `action_key` | `text` | NOT NULL, unique, indexed | Machine key (e.g., `daily_login`) |
| `name_ar` | `text` | NOT NULL | Arabic display name |
| `name_en` | `text` | nullable | English display name |
| `description_ar` | `text` | NOT NULL | Arabic description of how to earn |
| `point_value` | `integer` | NOT NULL, default 10 | Points awarded per action |
| `daily_limit` | `integer` | NOT NULL, default 1 | Max times per day this action can be earned |
| `cooldown_minutes` | `integer` | nullable | Cooldown between same-action awards |
| `enabled` | `boolean` | NOT NULL, default true | Whether this action is active |
| `icon` | `text` | nullable | Icon identifier for UI display |
| `created_at` | `timestamp` | NOT NULL, default `now()` | |
| `updated_at` | `timestamp` | NOT NULL, default `now()` | |

Validation:
- `point_value` > 0 (must award positive points)
- `daily_limit` > 0
- `cooldown_minutes` ≥ 0 or null

### `rewards` — Rewards catalog

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment ID |
| `name_ar` | `text` | NOT NULL | Arabic reward name |
| `name_en` | `text` | nullable | English reward name |
| `description_ar` | `text` | NOT NULL | Arabic description |
| `point_cost` | `integer` | NOT NULL | Points required to redeem |
| `image_url` | `text` | nullable | Reward image/icon URL |
| `stock` | `integer` | NOT NULL, default 0 | Available quantity (0 = out of stock, -1 = unlimited) |
| `reward_type` | `text` | NOT NULL | `digital` (instant) or `physical` (requires fulfillment) |
| `fulfillment_instructions` | `text` | nullable | Internal notes for admin fulfillment |
| `is_active` | `boolean` | NOT NULL, default true | Whether visible in catalog |
| `expires_at` | `timestamp` | nullable | When this reward becomes unavailable |
| `sort_order` | `integer` | NOT NULL, default 0 | Display ordering |
| `created_at` | `timestamp` | NOT NULL, default `now()` | |
| `updated_at` | `timestamp` | NOT NULL, default `now()` | |

Validation:
- `point_cost` > 0
- `reward_type` in (`digital`, `physical`)
- `stock` ≥ -1 (-1 = unlimited)
- `expires_at` > `created_at` if set

### `redemptions` — User reward redemption records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment ID |
| `user_id` | `integer` | FK → users.id, NOT NULL, indexed | User who redeemed |
| `reward_id` | `integer` | FK → rewards.id, NOT NULL | Reward redeemed |
| `points_spent` | `integer` | NOT NULL | Points deducted (snapshot of cost at redemption) |
| `status` | `text` | NOT NULL, default `pending` | One of: `pending`, `fulfilled`, `cancelled` |
| `admin_note` | `text` | nullable | Admin note for fulfilment/cancellation |
| `fulfilled_at` | `timestamp` | nullable | When reward was fulfilled |
| `created_at` | `timestamp` | NOT NULL, default `now()` | Redemption request timestamp |
| `updated_at` | `timestamp` | NOT NULL, default `now()` | |

Validation:
- `status` in (`pending`, `fulfilled`, `cancelled`)
- `points_spent` = reward's `point_cost` at time of creation
- `fulfilled_at` only set when status = `fulfilled`

### `achievements` — Achievement/badge definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | Auto-increment ID |
| `key` | `text` | NOT NULL, unique | Machine key (e.g., `first_referral`, `points_100`) |
| `name_ar` | `text` | NOT NULL | Arabic badge name |
| `name_en` | `text` | nullable | English badge name |
| `description_ar` | `text` | NOT NULL | Arabic description of criteria |
| `icon` | `text` | nullable | Badge icon identifier |
| `criteria` | `jsonb` | NOT NULL | JSON criteria definition (see below) |
| `point_reward` | `integer` | NOT NULL, default 0 | Bonus points awarded when earned |
| `is_hidden` | `boolean` | NOT NULL, default false | Hidden until earned |
| `is_active` | `boolean` | NOT NULL, default true | |
| `sort_order` | `integer` | NOT NULL, default 0 | |
| `created_at` | `timestamp` | NOT NULL, default `now()` | |

Criteria JSON structure:
```json
{
  "type": "referral_count | points_total | daily_streak | profile_complete | event_count | suggestion_count",
  "operator": "gte | eq",
  "value": 1
}
```

Validation:
- Criteria type must be one of the supported types
- `point_reward` ≥ 0
- For hidden achievements, `is_hidden` = true

### `user_achievements` — User achievement awards (junction)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | |
| `user_id` | `integer` | FK → users.id, NOT NULL, indexed | |
| `achievement_id` | `integer` | FK → achievements.id, NOT NULL | |
| `awarded_at` | `timestamp` | NOT NULL, default `now()` | When badge was earned |
| `notified` | `boolean` | NOT NULL, default false | Whether user was notified |

Constraints:
- `UNIQUE(user_id, achievement_id)` — each achievement can be earned once per user

### `tiers` — User tier definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PK | |
| `key` | `text` | NOT NULL, unique | Machine key (e.g., `beginner`, `promoter`) |
| `name_ar` | `text` | NOT NULL | Arabic tier name |
| `name_en` | `text` | nullable | English tier name |
| `min_points` | `integer` | NOT NULL | Minimum points for this tier |
| `max_points` | `integer` | nullable | Maximum points (null = top tier, no cap) |
| `color` | `text` | nullable | CSS color for tier badge |
| `icon` | `text` | nullable | Tier icon identifier |
| `benefits_ar` | `jsonb` | nullable | Array of Arabic benefit descriptions |
| `sort_order` | `integer` | NOT NULL, default 0 | |
| `created_at` | `timestamp` | NOT NULL, default `now()` | |

Benefits JSON structure:
```json
[
  "أولوية في تسجيل الفعاليات",
  "شارة خاصة في الملف الشخصي"
]
```

Validation:
- `min_points` ≥ 0
- `max_points` > `min_points` (if set)
- Tiers must not overlap in point ranges

### `loyalty_config` — Global loyalty system settings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | `text` | PK | Setting key |
| `value` | `jsonb` | NOT NULL | Setting value |
| `updated_at` | `timestamp` | NOT NULL, default `now()` | |

Default seed values:
| Key | Value | Description |
|-----|-------|-------------|
| `points_expire_days` | `365` | Days of inactivity before points expire |
| `expiration_notify_days` | `30` | Days before expiration to send warning |
| `leaderboard_cache_ttl` | `300` | Leaderboard cache TTL in seconds |
| `default_referral_points` | `50` | Default points per successful referral |

## Entity Relationships

```
users ──1:N──> points_transactions
users ──1:N──> redemptions
users ──1:N──> user_achievements
users ──1:1──> (last_activity_at)

earning_actions ── (standalone, referenced by action_type string in points_transactions)

rewards ──1:N──> redemptions

achievements ──1:N──> user_achievements

tiers ── (standalone, referenced by computed tier logic)

loyalty_config ── (standalone key-value store)
```

## State Transitions

### Points Transaction Flow

```
User Action → Eligibility Check → Create points_transaction
                                    ↓
                              Update users.points
                                    ↓
                              Check Achievements → Award if criteria met
                                    ↓
                              Recalculate Tier
                                    ↓
                              Update last_activity_at
```

### Redemption Flow (Digital)

```
User selects reward → Check points >= cost → Check stock > 0
                          ↓
                    Create points_transaction (spend)
                          ↓
                    Create redemption (status: pending)
                          ↓
                    Apply digital reward (instant)
                          ↓
                    Update redemption (status: fulfilled)
                          ↓
                    Decrement stock
```

### Redemption Flow (Physical)

```
User selects reward → Check points >= cost → Check stock > 0
                          ↓
                    Create points_transaction (spend)
                          ↓
                    Create redemption (status: pending)
                          ↓
                    [Admin fulfills via admin panel]
                          ↓
                    Update redemption (status: fulfilled)
                          ↓
                    Decrement stock
```

### Points Expiration Flow

```
[Daily Cron]
  ↓
Query users WHERE last_activity_at < (now - expire_days) AND points > 0
  ↓
For each user:
  Create points_transaction (expiration, points_change = -current_balance)
  Update users.points = 0
  Send notification
```

## Seed Data

### Default Earning Actions

| Action Key | Name (AR) | Points | Daily Limit |
|-----------|-----------|--------|-------------|
| `daily_login` | تسجيل الدخول اليومي | 5 | 1 |
| `referral` | دعوة صديق | 50 | 10 |
| `suggestion` | تقديم اقتراح | 10 | 1 |
| `content_share` | مشاركة محتوى | 3 | 5 |
| `profile_complete` | إكمال الملف الشخصي | 20 | 1 (one-time) |
| `event_attendance` | حضور فعالية | 15 | 1 per event |

### Default Tiers

| Key | Name (AR) | Min | Max | Color | Sort |
|-----|-----------|-----|-----|-------|------|
| `beginner` | المبتدئ | 0 | 99 | `#9CA3AF` | 1 |
| `promoter` | المروج | 100 | 499 | `#60A5FA` | 2 |
| `ambassador` | السفير | 500 | 999 | `#A78BFA` | 3 |
| `influencer` | المؤثر | 1000 | 4999 | `#F59E0B` | 4 |
| `legend` | الأسطورة | 5000 | null | `#EF4444` | 5 |

### Default Achievements

| Key | Name (AR) | Criteria | Points |
|-----|-----------|----------|--------|
| `first_referral` | أول دعوة | referral_count ≥ 1 | 10 |
| `referral_10` | عشرة أصدقاء | referral_count ≥ 10 | 50 |
| `points_100` | 100 نقطة | points_total ≥ 100 | 0 |
| `points_500` | 500 نقطة | points_total ≥ 500 | 0 |
| `points_1000` | 1000 نقطة | points_total ≥ 1000 | 0 |
| `daily_7` | المواظب (7 أيام) | daily_streak ≥ 7 | 20 |
| `daily_30` | المواظب (30 يوم) | daily_streak ≥ 30 | 100 |
| `profile_complete` | مكتمل الملف | profile_complete = true | 0 |
| `first_suggestion` | أول اقتراح | suggestion_count ≥ 1 | 5 |
| `event_5` | حضور 5 فعاليات | event_count ≥ 5 | 25 |
