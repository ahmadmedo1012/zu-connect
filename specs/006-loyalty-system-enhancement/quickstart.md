# Quickstart: Loyalty System Enhancement

**Validation scenarios** to prove the feature works end-to-end.

## Prerequisites

- Running PostgreSQL database (NeonDB)
- Running API server (`pnpm --filter @workspace/api-server run dev`)
- Running frontend dev server (`pnpm --filter @workspace/zu-connect run dev`)
- Admin user seeded (admin@zu.edu.ly / admin123)
- Test user account

## Setup

```bash
# 1. Push new schema tables
cd lib/db && npx drizzle-kit push --config ./drizzle.config.ts

# 2. Seed default earning actions, tiers, achievements, config
pnpm --filter @workspace/db seed

# 3. Restart API server to pick up new routes
# (dev mode auto-restarts)
```

## Validation Scenarios

### Scenario 1: User earns daily login points

```bash
# Login as test user
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"2021001","password":"student123","role":"student"}'
# → Save token, note dailyLoginPoints field

# Verify login grants points
curl http://localhost:3001/api/loyalty/stats \
  -H "Authorization: Bearer <token>"
# → "points" > 0, "recentTransactions" contains daily_login entry
```

**Expected outcome:** User's points increase by `earning_actions.daily_login.point_value` (default 5) on first login of the day. Subsequent logins on the same day do not award points.

### Scenario 2: User views points history

```bash
curl "http://localhost:3001/api/loyalty/transactions?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

**Expected outcome:** Chronological list of transactions with action type, points change, balance after, and timestamp. Each entry shows whether points were earned, spent, or expired.

### Scenario 3: User redeems a digital reward

```bash
# Verify sufficient points
curl http://localhost:3001/api/loyalty/stats -H "Authorization: Bearer <token>"

# Redeem a reward (use a reward ID from GET /api/loyalty/rewards)
curl -X POST http://localhost:3001/api/loyalty/rewards/1/redeem \
  -H "Authorization: Bearer <token>"

# Verify points deducted and reward shows in history
curl http://localhost:3001/api/loyalty/transactions?actionType=reward_redemption \
  -H "Authorization: Bearer <token>"
```

**Expected outcome:** Points decrease by `reward.point_cost`. A new `reward_redemption` transaction appears in history. For digital rewards, `status: "fulfilled"` is returned immediately. For physical rewards, `status: "pending"` is returned.

### Scenario 4: User earns an achievement badge

```bash
# Trigger first_referral achievement by completing a referral
# Then check achievements
curl http://localhost:3001/api/loyalty/stats \
  -H "Authorization: Bearer <token>"
```

**Expected outcome:** The `first_referral` badge appears in `recentAchievements`. If the achievement has a `point_reward`, those points are also credited.

### Scenario 5: User checks leaderboard

```bash
curl "http://localhost:3001/api/loyalty/leaderboard?sortBy=points&limit=10" \
  -H "Authorization: Bearer <token>"
```

**Expected outcome:** Top 10 users by points displayed. `myRank` field in response shows logged-in user's rank even if outside top 10.

### Scenario 6: Admin adjusts user points

```bash
# Login as admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@zu.edu.ly","password":"admin123","role":"admin"}'
# → Save admin token

# Adjust points
curl -X POST http://localhost:3001/api/admin/loyalty/users/1/adjust \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"points": 100, "reason": "مكافأة"}'

# Verify the transaction appears in user's history
curl http://localhost:3001/api/loyalty/transactions?actionType=admin_adjustment \
  -H "Authorization: Bearer <user-token>"
```

**Expected outcome:** User's points increase by 100. An `admin_adjustment` transaction appears with the admin note "مكافأة".

### Scenario 7: Admin configures earning action

```bash
# Change daily login points from 5 to 10
curl -X PUT http://localhost:3001/api/admin/loyalty/actions/daily_login \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"pointValue": 10}'

# Verify new logins award 10 points
```

**Expected outcome:** Next daily login awards 10 points instead of 5. Past transactions are unaffected.

## Frontend Verification

| Page | Route | What to check |
|------|-------|---------------|
| Loyalty Dashboard | `/loyalty` | Points balance, tier display, progress bar, recent transactions, achievements |
| Points History | `/loyalty/history` | Filter by action type, date picker, pagination, correct sorting |
| Rewards Catalog | `/loyalty/rewards` | Reward cards with cost, stock indicator, redeem button, insufficient points handling |
| Leaderboard | `/leaderboard` | Top users, sort tabs, own rank highlighted, responsive layout |
| Admin Loyalty | `/admin/loyalty` | Analytics cards, earning actions list, rewards management, achievements CRUD, tiers config, redemptions queue |

## Test Commands

```bash
# Run backend tests
pnpm --filter @workspace/api-server run test -- --related=loyalty

# Run frontend typecheck
pnpm --filter @workspace/zu-connect run typecheck

# Full project typecheck
pnpm run typecheck
```

## Rollback

```bash
# To revert schema changes (if migration is reversible):
pnpm --filter @workspace/db run db:drop -- 006_migration_name

# To disable loyalty features without data loss:
# Set all earning_actions.enabled = false
# Set all rewards.is_active = false
```
