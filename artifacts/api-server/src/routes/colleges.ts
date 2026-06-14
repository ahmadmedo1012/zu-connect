import { Router } from "express";
import { db, collegesTable } from "@workspace/db";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.get("/colleges", optionalAuth, async (req, res) => {
  const items = await db.select().from(collegesTable).orderBy(collegesTable.id);
  if (req.user) {
    res.json(items);
  } else {
    res.json(items.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
    })));
  }
});

export default router;
