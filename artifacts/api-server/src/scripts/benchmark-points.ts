import { db, pointsTransactionsTable, usersTable } from "@workspace/db";
import { eq, desc, count, sql, and, gte, lte } from "drizzle-orm";

async function benchmark() {
  console.log("=== Points History Performance Test ===");
  console.log("Target: 100k transactions in under 2s");

  const [total] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(pointsTransactionsTable);
  console.log(`Total transactions in DB: ${total.count}`);

  if (total.count < 1000) {
    console.log("⚠️  Insufficient data for benchmark (need 100k+ for SC-008)");
    console.log("Seeding additional test data...");
    const users = await db.select({ id: usersTable.id }).from(usersTable).limit(10);
    const types = ["daily_login", "referral", "course_enroll", "library_download", "feedback_submit"];
    const batchSize = 1000;
    let inserted = total.count;
    const target = Math.max(total.count + 100000, 100000);
    while (inserted < target) {
      const batch = [];
      for (let i = 0; i < batchSize; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const pts = Math.floor(Math.random() * 100) + 1;
        batch.push({
          userId: user.id,
          actionType: type,
          pointsChange: pts,
          balanceAfter: pts,
        });
      }
      await db.insert(pointsTransactionsTable).values(batch);
      inserted += batchSize;
      console.log(`  Inserted ${inserted} transactions...`);
    }
  }

  const start = performance.now();

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(pointsTransactionsTable);
  console.log(`Count query: ${(performance.now() - start).toFixed(2)}ms`);

  const queryStart = performance.now();
  const items = await db
    .select()
    .from(pointsTransactionsTable)
    .where(and(
      eq(pointsTransactionsTable.actionType, "daily_login"),
      gte(pointsTransactionsTable.createdAt, new Date("2026-01-01")),
    ))
    .orderBy(desc(pointsTransactionsTable.createdAt))
    .limit(20)
    .offset(0);
  const queryTime = performance.now() - queryStart;
  console.log(`Paginated query (20 items + filter): ${queryTime.toFixed(2)}ms`);
  console.log(`Result: ${queryTime < 2000 ? "✅ PASS" : "❌ FAIL"} (threshold: 2000ms)`);

  console.log("=== Benchmark Complete ===");
}

benchmark().catch(console.error);
