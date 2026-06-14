import { Router } from "express";
import { db, libraryTable } from "@workspace/db";
import { ListLibraryQueryParams } from "@workspace/api-zod";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.get("/library", optionalAuth, async (req, res) => {
  const query = ListLibraryQueryParams.safeParse(req.query);
  let items = await db.select().from(libraryTable).orderBy(libraryTable.id);
  if (query.success && query.data.type) {
    items = items.filter((r) => r.type === query.data.type);
  }
  if (req.user) {
    res.json(items);
  } else {
    res.json(items.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      rating: r.rating,
    })));
  }
});

export default router;
