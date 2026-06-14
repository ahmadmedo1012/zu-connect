import { Router } from "express";
import { db, plannerTable } from "@workspace/db";
import { ListPlannerQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/planner", async (req, res) => {
  const query = ListPlannerQueryParams.safeParse(req.query);
  let items = await db.select().from(plannerTable).orderBy(plannerTable.date);
  if (query.success && query.data.month) {
    items = items.filter((e) => e.month === query.data.month);
  }
  res.json(items);
});

export default router;
