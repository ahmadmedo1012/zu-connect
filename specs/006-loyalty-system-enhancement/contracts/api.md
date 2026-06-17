# API Contracts: Loyalty System Enhancement

## Public Endpoints (User-facing)

### GET /api/loyalty/stats — User's loyalty dashboard data

Returns the current user's points, tier, recent history, available rewards count, and achievements.

**Response:**
```json
{
  "points": 150,
  "tier": { "key": "promoter", "name_ar": "المروج", "color": "#60A5FA", "benefits_ar": ["أولوية في تسجيل الفعاليات"] },
  "nextTier": { "key": "ambassador", "name_ar": "السفير", "pointsNeeded": 350, "progressPercent": 14 },
  "recentTransactions": [
    { "id": 1, "actionType": "daily_login", "pointsChange": 5, "balanceAfter": 150, "createdAt": "2026-06-16T10:00:00Z" }
  ],
  "recentAchievements": [
    { "key": "first_referral", "nameAr": "أول دعوة", "icon": "🎯", "awardedAt": "2026-06-15T08:00:00Z" }
  ],
  "availableRewardsCount": 12
}
```

### GET /api/loyalty/transactions — Points history (paginated)

**Query params:** `page`, `limit`, `actionType` (optional filter), `dateFrom`, `dateTo`

**Response:**
```json
{
  "transactions": [
    { "id": 1, "actionType": "daily_login", "actionLabel": "تسجيل الدخول اليومي", "pointsChange": 5, "balanceAfter": 150, "createdAt": "2026-06-16T10:00:00Z" }
  ],
  "pagination": { "page": 1, "totalPages": 5, "total": 42 }
}
```

### GET /api/loyalty/actions — Available earning actions

**Response:**
```json
{
  "actions": [
    { "key": "daily_login", "nameAr": "تسجيل الدخول اليومي", "descriptionAr": "سجل دخولك يومياً للحصول على نقاط", "pointValue": 5, "dailyLimit": 1, "icon": "login" }
  ]
}
```

### GET /api/loyalty/rewards — Rewards catalog

**Response:**
```json
{
  "rewards": [
    { "id": 1, "nameAr": "شارة المساهم", "descriptionAr": "شارة خاصة في ملفك الشخصي", "pointCost": 100, "imageUrl": "/icons/badge-contributor.svg", "inStock": true, "rewardType": "digital" }
  ]
}
```

### POST /api/loyalty/rewards/:id/redeem — Redeem a reward

**Request body:** (none)

**Response (success):**
```json
{ "success": true, "redemption": { "id": 1, "rewardId": 1, "pointsSpent": 100, "status": "fulfilled" } }
```

**Response (insufficient points):**
```json
{ "success": false, "error": "نقاط غير كافية", "code": "INSUFFICIENT_POINTS" }
```

### GET /api/loyalty/leaderboard — Platform leaderboard

**Query params:** `sortBy` (points|referrals|achievements), `limit`

**Response:**
```json
{
  "leaderboard": [
    { "rank": 1, "userId": 5, "name": "أحمد محمد", "points": 5200, "tierKey": "legend", "achievements": 8, "referrals": 15 }
  ],
  "myRank": { "rank": 42, "points": 150, "outOf": 1500 }
}
```

### GET /api/loyalty/leaderboard/my-rank — Current user's rank

**Response:**
```json
{ "rank": 42, "points": 150, "totalUsers": 1500 }
```

---

## Admin Endpoints

### GET /api/admin/loyalty/stats — Overall loyalty analytics

**Response:**
```json
{
  "totalUsers": 1500,
  "usersWithPoints": 800,
  "totalPoints": 45000,
  "averagePoints": 56,
  "tierDistribution": [
    { "name": "المبتدئ", "count": 700, "percentage": 46.7 },
    { "name": "المروج", "count": 60, "percentage": 4.0 },
    { "name": "السفير", "count": 30, "percentage": 2.0 },
    { "name": "المؤثر", "count": 8, "percentage": 0.5 },
    { "name": "الأسطورة", "count": 2, "percentage": 0.1 }
  ],
  "recentRedemptions": 15,
  "totalAchievementsAwarded": 420,
  "pointsByAction": [
    { "actionType": "referral", "totalPoints": 25000, "count": 500 },
    { "actionType": "daily_login", "totalPoints": 12000, "count": 2400 }
  ]
}
```

### GET /api/admin/loyalty/actions — List earning actions

**Response:** Array of `earning_actions` rows.

### PUT /api/admin/loyalty/actions/:key — Update earning action

**Request body:**
```json
{ "pointValue": 10, "dailyLimit": 2, "enabled": true }
```

### POST /api/admin/loyalty/actions — Create earning action

**Request body:** All `earning_actions` fields.

### GET /api/admin/loyalty/rewards — List rewards

### POST /api/admin/loyalty/rewards — Create reward

### PUT /api/admin/loyalty/rewards/:id — Update reward

### DELETE /api/admin/loyalty/rewards/:id — Delete reward

### GET /api/admin/loyalty/achievements — List achievements

### POST /api/admin/loyalty/achievements — Create achievement

### PUT /api/admin/loyalty/achievements/:id — Update achievement

### DELETE /api/admin/loyalty/achievements/:id — Delete achievement

### GET /api/admin/loyalty/tiers — List tiers

### PUT /api/admin/loyalty/tiers/:key — Update tier

### POST /api/admin/loyalty/tiers — Create tier

### GET /api/admin/loyalty/config — Get loyalty config

### PUT /api/admin/loyalty/config — Update loyalty config

### POST /api/admin/loyalty/users/:userId/adjust — Manual point adjustment

**Request body:**
```json
{ "points": 50, "reason": "مكافأة النشاط المتميز" }
```

**Response:**
```json
{ "userId": 1, "previousPoints": 100, "newPoints": 150, "change": 50 }
```

### GET /api/admin/loyalty/redemptions — List redemptions (paginated)

**Query params:** `page`, `limit`, `status` (pending|fulfilled|cancelled)

### PUT /api/admin/loyalty/redemptions/:id/fulfill — Mark redemption fulfilled

### PUT /api/admin/loyalty/redemptions/:id/cancel — Cancel redemption (refunds points)
