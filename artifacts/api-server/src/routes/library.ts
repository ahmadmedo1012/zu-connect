import { Router } from "express";
import { db, libraryTable } from "@workspace/db";
import { ListLibraryQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/library", async (req, res) => {
  const query = ListLibraryQueryParams.safeParse(req.query);
  let items = await db.select().from(libraryTable).orderBy(libraryTable.id);
  if (query.success && query.data.type) {
    items = items.filter((r) => r.type === query.data.type);
  }
  res.json(items);
});

export default router;
