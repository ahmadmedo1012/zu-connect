import { Router } from "express";
import { db, membersTable } from "@workspace/db";
import { ListMembersQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/members", async (req, res) => {
  const query = ListMembersQueryParams.safeParse(req.query);
  let items = await db.select().from(membersTable).orderBy(membersTable.id);
  if (query.success && query.data.category) {
    items = items.filter((m) => m.category === query.data.category);
  }
  res.json(items);
});

export default router;
