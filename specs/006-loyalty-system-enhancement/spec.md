# Feature Specification: Loyalty System Enhancement

**Feature Branch**: `006-loyalty-system-enhancement`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "تخسين نظام الولاء وتطويره ليكون أفضل وأقوى وأوضح واكثر تنظيما" — Improve and develop the loyalty system to be better, stronger, clearer, and more organized.

## User Scenarios & Testing

### User Story 1 — User Earns Points from Multiple Actions (Priority: P1)

A registered user can earn loyalty points through various activities on the platform: referring friends, daily login, submitting suggestions, attending events, sharing content, and completing profile information. Each action has a defined point value visible to the user.

**Why this priority**: Diversifying point-earning opportunities is the foundation of a stronger loyalty system. Currently points are only earned via referrals.

**Independent Test**: Can be tested by performing each eligible action and verifying the correct points are credited to the user's account.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they refer a friend who registers, **Then** they receive referral points and see it in their points history
2. **Given** a logged-in user, **When** they log in daily, **Then** they receive daily login points (once per day)
3. **Given** a logged-in user, **When** they submit a suggestion, **Then** they receive participation points
4. **Given** a logged-in user, **When** they share platform content via a shareable link, **Then** they receive sharing points (limited per day)
5. **Given** a logged-in user, **When** they complete their profile (add college, photo, bio), **Then** they receive onboarding points

---

### User Story 2 — User Views Points History and Progress (Priority: P1)

A user can see a complete history of their points: earned, spent, and expired. Each entry shows the action, points change, date, and remaining balance. The user can also see their current tier, progress toward the next tier, and available rewards.

**Why this priority**: Transparency and clarity are essential for user trust and engagement. The current system offers no history.

**Independent Test**: Can be tested by performing several earning/spending actions and verifying the history page shows accurate entries.

**Acceptance Scenarios**:

1. **Given** a user with points activity, **When** they visit their profile/loyalty page, **Then** they see a chronological list of all point transactions
2. **Given** a user with points activity, **When** they filter history by type (earned, spent, expired), **Then** only matching entries are shown
3. **Given** a user views their tier, **When** they see their current tier and progress bar toward next tier, **Then** the points needed for next tier are clearly displayed
4. **Given** a user has earning actions available, **When** they view the "Ways to Earn" section, **Then** they see all available actions with point values and daily limits

---

### User Story 3 — User Redeems Points for Rewards (Priority: P1)

A user can browse a catalog of rewards and redeem their accumulated points. Rewards may include: platform badges, priority event registration, profile highlights, exclusive content access, and real-world union merchandise (where applicable).

**Why this priority**: The ability to spend points gives them real value and drives continued engagement. Currently points have no spendable purpose.

**Independent Test**: Can be tested by accumulating sufficient points, browsing the rewards catalog, redeeming a reward, and verifying the deduction appears in points history.

**Acceptance Scenarios**:

1. **Given** a user with sufficient points, **When** they browse the rewards catalog, **Then** they see available rewards with point costs and descriptions
2. **Given** a user selects a reward, **When** they confirm redemption, **Then** points are deducted and the reward is applied to their account
3. **Given** a user attempts to redeem a reward they cannot afford, **When** they click redeem, **Then** they see a clear message indicating insufficient points
4. **Given** a user redeems a limited-quantity reward, **When** stock reaches zero, **Then** the reward appears as "out of stock"

---

### User Story 4 — User Receives Achievement Badges (Priority: P2)

A user can earn achievement badges for reaching milestones: first referral, 10 referrals, 100 points, 500 points, daily streak (7 days, 30 days), profile completion, and event attendance. Badges appear on the user's profile and in the leaderboard.

**Why this priority**: Achievements provide recognition and motivate continued participation beyond point accumulation.

**Independent Test**: Can be tested by triggering each achievement condition and verifying the badge appears on the user's profile.

**Acceptance Scenarios**:

1. **Given** a user reaches 100 points, **When** the threshold is crossed, **Then** the "100 Points" badge is awarded and a notification is shown
2. **Given** a user earns a new badge, **When** they visit their profile, **Then** the badge is displayed in their achievements section
3. **Given** a user views another user's profile, **When** they see their badges, **Then** they can see which achievements that user has earned
4. **Given** an admin configures a new achievement, **When** existing users meet the criteria, **Then** the badge is retroactively awarded

---

### User Story 5 — Admin Manages Loyalty System Settings (Priority: P2)

An administrator can configure the loyalty system through the admin panel: adjust point values for actions, create/manage rewards, define achievement criteria, set tier thresholds, view points distribution analytics, and manually adjust user points with audit trail.

**Why this priority**: Admin control is essential for maintaining and evolving the loyalty system over time.

**Independent Test**: Can be tested by logging in as admin, modifying loyalty settings, and verifying the changes take effect for users.

**Acceptance Scenarios**:

1. **Given** an admin is on the Loyalty Settings page, **When** they change point values for an action, **Then** new actions use the updated values
2. **Given** an admin is on the Rewards management page, **When** they create a new reward, **Then** it appears in the user-facing catalog
3. **Given** an admin adjusts a user's points, **When** they submit the change with a reason, **Then** the adjustment appears in the user's points history with the admin note
4. **Given** an admin views loyalty analytics, **When** they see points distribution, **Then** they can filter by tier, date range, and activity type

---

### User Story 6 — User Sees Leaderboard and Compares Progress (Priority: P3)

A user can view a platform-wide leaderboard showing top users by points, top by referrals, and top by achievements earned. Users can see their own rank and how many points they need to reach the next rank.

**Why this priority**: Friendly competition drives engagement and encourages more platform participation.

**Independent Test**: Can be tested by earning points and verifying the leaderboard updates to reflect the new ranking.

**Acceptance Scenarios**:

1. **Given** a user views the leaderboard, **When** the page loads, **Then** they see the top 50 users ranked by points
2. **Given** a user is logged in, **When** they view the leaderboard, **Then** their own rank is highlighted and shown even if outside top 50
3. **Given** a user views the leaderboard, **When** they switch between tabs (points, referrals, achievements), **Then** the ranking updates accordingly

---

### Edge Cases

- What happens when a user earns points offline (network failure)? Points are awarded when the action syncs; duplicate actions are prevented by idempotency keys.
- How are points handled when content is deleted after earning points? Points remain — they are not retroactively deducted unless abuse is detected.
- What happens to unredeemed points when a user deletes their account? Points are forfeited; a warning is shown during account deletion.
- How does the system prevent point farming? Rate limits on action-based points (e.g., max 1 daily login point per day, max 5 sharing points per day).
- What happens when a reward is redeemed but cannot be fulfilled? Admin is notified and the user receives a support message; points may be refunded.
- How are tier thresholds adjusted for existing users? Tier is recalculated on next login or points change based on current thresholds.
- What if points expire while a user is inactive? A notification is sent before expiration; expired points are shown in history with "expired" label.

## Requirements

### Functional Requirements

- **FR-001**: System MUST track a complete points history for each user with action type, points change, timestamp, running balance, and optional admin note
- **FR-002**: System MUST support multiple point-earning actions: referral, daily login, suggestion submission, content sharing, profile completion, event attendance
- **FR-003**: Each earning action MUST have a configurable point value, daily limit, and cooldown period manageable by admin
- **FR-004**: Users MUST be able to view their points history with filtering by type (earned, spent, expired) and date range
- **FR-005**: System MUST display a "Ways to Earn" page showing all available actions, point values, and limits
- **FR-006**: System MUST support a rewards catalog where users can redeem points for rewards
- **FR-007**: Rewards MUST have a name, description, point cost, image URL, stock quantity, and expiration date
- **FR-008**: Redemption MUST deduct points from the user balance, create a redemption record, and update reward stock
- **FR-009**: System MUST prevent redemption when user has insufficient points or reward is out of stock
- **FR-010**: System MUST support achievement badges with name, description, icon, criteria, and optional point reward
- **FR-011**: Badges MUST be automatically awarded when a user meets the criteria
- **FR-012**: Users MUST be able to view their earned badges on their profile and other users' badges on their profiles
- **FR-013**: System MUST support user tiers with name, minimum points, maximum points, color, icon, and benefits description
- **FR-014**: Tiers MUST be recalculated whenever a user earns or spends points
- **FR-015**: Users MUST see their current tier, progress to next tier, and tier benefits on their loyalty dashboard
- **FR-016**: System MUST provide a platform leaderboard ranked by points, redeemable through different sort options (points, referrals, achievements)
- **FR-017**: Leaderboard MUST show the user's own rank even if outside the displayed top N
- **FR-018**: Admin MUST have a dedicated Loyalty Settings page in the admin panel
- **FR-019**: Admin MUST be able to view, create, edit, and delete rewards in the catalog
- **FR-020**: Admin MUST be able to view, create, edit, and delete achievement definitions
- **FR-021**: Admin MUST be able to configure point values for each earning action
- **FR-022**: Admin MUST be able to adjust any user's points with a required reason (audited)
- **FR-023**: Admin MUST be able to view points distribution analytics (by tier, date, action type)
- **FR-024**: System MUST send a notification (in-app) when a user earns a badge, levels up, or has points expiring soon
- **FR-025**: Points MUST expire after a configurable period of inactivity (default 12 months)
- **FR-026**: System MUST prevent abuse through rate limits and idempotency keys on point-earning actions
- **FR-027**: System MUST log all point adjustments and reward redemptions in the audit trail
- **FR-028**: All loyalty pages MUST be RTL-compatible with Arabic language support
- **FR-029**: Admin loyalty settings MUST be responsive for mobile and desktop use
- **FR-030**: Public loyalty components MUST be accessible from the user profile and a dedicated loyalty page

### Key Entities

- **PointsTransaction**: Individual point change record with userId, action type, points change, balance after, timestamp, reference ID, and admin note
- **EarningAction**: Configurable action definition with name, description, point value, daily limit, cooldown period, and enabled flag
- **Reward**: Redeemable item with name, description, point cost, image URL, stock quantity, expiration date, and enabled flag
- **Redemption**: Record of a user redeeming a reward with userId, rewardId, points spent, status (pending, fulfilled, cancelled), and timestamp
- **Achievement**: Badge definition with name, description, icon, criteria, point reward, and enabled flag
- **UserAchievement**: Junction table recording which users earned which badges and when
- **Tier**: Level definition with name, min points, max points, color, icon, benefits description, and sort order
- **PointsExpiration**: Batch record of points expiring on a given date for users with inactivity beyond the threshold
- **LoyaltyConfig**: Key-value configuration for global loyalty system settings (expiration period, default point values, etc.)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can earn points from at least 5 different action types (currently 1 — referrals)
- **SC-002**: Users can view complete points history with filters within 2 seconds of page load
- **SC-003**: Reward redemption completes and updates user balance within 1 second
- **SC-004**: Achievement badges are awarded within 30 seconds of criteria being met
- **SC-005**: Tier status updates immediately when points change
- **SC-006**: Admin can configure all loyalty settings through the admin panel without code changes
- **SC-007**: Leaderboard loads top 50 users within 2 seconds
- **SC-008**: Points history retains at least 100,000 transactions without performance degradation
- **SC-009**: Points expiration notifications are sent at least 30 days before expiration

## Assumptions

- The existing `users.points` column will remain the source of truth; `points_transactions` will maintain history for it
- Points expire based on last activity date (configurable); expired points reduce the running balance
- Achievement criteria are defined as JSON in the database for flexibility
- Rewards catalog items are digital-first (badges, access, highlights) with optional physical merchandise
- The existing referral system (50 points per referral) continues but points become configurable
- Telegram notifications may be extended to cover loyalty events (level up, badge earned) — covered by existing Telegram service notification patterns
- Daily login points require the user to actively log in (not just have an active session)
- Earning action configurations apply prospectively — existing uncredited actions are not backfilled
- Leaderboard caching with a 5-minute TTL is acceptable for performance
- The feature uses `sequential` numbering — previous specs: 001, 002, 005
