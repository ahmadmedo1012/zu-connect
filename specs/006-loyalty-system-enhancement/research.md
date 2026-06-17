# Research: Loyalty System Enhancement

**Phase 0 output** — resolves all technical unknowns for the loyalty system feature.

## Technology Decisions

### Points Transaction Storage

**Decision**: Store points transactions in a dedicated `points_transactions` table with immutable append-only records. Each transaction stores the running balance after the change for query efficiency.

**Rationale**: Historical integrity is critical for a loyalty system. An append-only ledger prevents data loss and makes auditing straightforward. Storing the running balance avoids recalculating sum over all prior transactions on every load.

**Alternatives considered**:
- Derive history from existing `referrals` table: rejected because points now come from many action types, not just referrals
- Event sourcing with an event store: over-engineered for this scale (~100k transactions)
- JSON array on the `users` row: violates normalization, poor query performance for filtering/sorting

### Reward Redemption Flow

**Decision**: Two-phase redemption (request → admin fulfillment) for physical rewards; instant digital rewards for badges, highlights, and access grants.

**Rationale**: Union merchandise requires physical fulfillment (inventory, pickup). Digital rewards (profile badges, priority event access) can be applied automatically.

**Alternatives considered**:
- Fully automated redemption: impossible for physical items
- Manual-only redemption: poor UX for digital rewards

### Tier Recalculation Strategy

**Decision**: Recalculate user tier on every points change (earn/spend/expire) as a synchronous database update to the `user_tier` column.

**Rationale**: Tiers affect what users see (benefits, badges). Delayed recalculation could show stale tier information. At ~10k users and ~100 daily points changes, synchronous updates are well within PostgreSQL capacity.

**Alternatives considered**:
- Scheduled batch recalculation (daily cron): acceptable but risks stale tier display between cron runs
- Computed on read (no stored tier): acceptable but adds query complexity for every tier-dependent view

### Points Expiration Mechanism

**Decision**: Store a `last_activity_at` timestamp on the `users` table. A daily cron checks for users with `last_activity_at > config.expiration_period` and creates expiration transaction records, deducting from the running balance.

**Rationale**: Points expiration encourages engagement. A daily batch approach is simple and predictable. Users receive a notification 30 days before expiration.

**Alternatives considered**:
- Real-time expiration check on every login: misses inactive users who never log in
- TTL-based with DB trigger: more complex, harder to audit

### Leaderboard Caching

**Decision**: Cache the leaderboard with a 5-minute TTL in a simple server-side in-memory cache (or Node process cache). Invalidate on points changes.

**Rationale**: Leaderboard is read-heavy but write-light. 5-minute staleness is acceptable for a gamification feature. In-memory cache avoids adding Redis for a single use case.

**Alternatives considered**:
- Real-time leaderboard query: unnecessary DB load for a non-critical feature
- Redis cache: over-engineered for the current scale; can be added later

## Integration Patterns

### Points Attribution Pattern

All point-earning actions follow a consistent pattern:
1. User performs action (e.g., submits suggestion, logs in)
2. Backend validates eligibility (rate limit, cooldown, duplication check)
3. If eligible: create `points_transaction` record with action type, reference ID, and point value
4. Update `users.points` running balance
5. Check and award any applicable achievement badges
6. Recalculate tier
7. Emit loyalty event via socket.io for admin live feed

### Admin Audit Trail

All admin-driven point adjustments, reward creations, and configuration changes are logged to the existing `audit_log` table with before/after values and admin user reference.

## Outstanding Clarifications

None. All technical decisions have been resolved based on existing project patterns and industry best practices for loyalty systems.
