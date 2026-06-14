import { Router } from "express";
import { db, membersTable } from "@workspace/db";
import { ListMembersQueryParams } from "@workspace/api-zod";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.get("/members", optionalAuth, async (req, res) => {
  const query = ListMembersQueryParams.safeParse(req.query);
  let items = await db.select().from(membersTable).orderBy(membersTable.id);
  if (query.success && query.data.category) {
    items = items.filter((m) => m.category === query.data.category);
  }
  if (req.user) {
    res.json(items);
  } else {
    res.json(items.map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category,
    })));
  }
});

export default router;
