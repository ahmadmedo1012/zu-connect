import { Router } from "express";
import { db, leadershipTable } from "@workspace/db";

const router = Router();

router.get("/leadership", async (_req, res) => {
  const items = await db.select().from(leadershipTable).orderBy(leadershipTable.id);
  res.json(items);
});

export default router;
