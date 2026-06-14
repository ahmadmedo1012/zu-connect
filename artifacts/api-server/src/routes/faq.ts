import { Router } from "express";
import { db, faqTable } from "@workspace/db";

const router = Router();

router.get("/faq", async (_req, res) => {
  const items = await db.select().from(faqTable).orderBy(faqTable.id);
  res.json(items);
});

export default router;
