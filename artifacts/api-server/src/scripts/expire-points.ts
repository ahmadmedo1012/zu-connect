import { db, usersTable, pointsTransactionsTable, loyaltyConfigTable } from "@workspace/db";
import { eq, lt, and, sql } from "drizzle-orm";

async function expirePoints() {
  console.log("[Points Expiry] Starting daily check...");

  const [config] = await db
    .select()
    .from(loyaltyConfigTable)
    .where(eq(loyaltyConfigTable.key, "points_expiry_days"))
    .limit(1);

  const expireDays = config ? parseInt((config.value as Record<string, any>)?.en ?? "365", 10) : 365;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - expireDays);

  const expiredUsers = await db
    .select({ id: usersTable.id, points: usersTable.points })
    .from(usersTable)
    .where(
      and(
        lt(usersTable.lastActivityAt, cutoff),
        sql`${usersTable.points} > 0`,
      ),
    );

  let totalExpired = 0;
  for (const user of expiredUsers) {
    await db.transaction(async (tx) => {
      await tx.insert(pointsTransactionsTable).values({
        userId: user.id,
        actionType: "expiration",
        pointsChange: -user.points,
        balanceAfter: 0,
        adminNote: `انتهاء صلاحية النقاط بعد ${expireDays} يوم`,
      });

      await tx
        .update(usersTable)
        .set({ points: 0 })
        .where(eq(usersTable.id, user.id));
    });
    totalExpired += user.points;
  }

  console.log(`[Points Expiry] Done: ${expiredUsers.length} users affected, ${totalExpired} points expired.`);
}

expirePoints().catch((err) => {
  console.error("[Points Expiry] Failed:", err);
  process.exit(1);
});
