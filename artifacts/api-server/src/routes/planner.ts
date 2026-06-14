import { Router } from "express";
import { db, plannerTable } from "@workspace/db";
import { ListPlannerQueryParams } from "@workspace/api-zod";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.get("/planner", optionalAuth, async (req, res) => {
  const query = ListPlannerQueryParams.safeParse(req.query);
  let items = await db.select().from(plannerTable).orderBy(plannerTable.date);
  if (query.success && query.data.month) {
    items = items.filter((e) => e.month === query.data.month);
  }
  if (req.user) {
    res.json(items);
  } else {
    res.json(items.map((e) => ({
      id: e.id,
      title: e.title,
      month: e.month,
      icon: e.icon,
    })));
  }
});

export default router;
