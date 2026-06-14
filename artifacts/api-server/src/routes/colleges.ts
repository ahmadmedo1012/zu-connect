import { Router } from "express";
import { db, collegesTable } from "@workspace/db";

const router = Router();

router.get("/colleges", async (_req, res) => {
  const items = await db.select().from(collegesTable).orderBy(collegesTable.id);
  res.json(items);
});

export default router;
