import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListNewsQueryParams, CreateNewsBody, GetNewsParams } from "@workspace/api-zod";
import { optionalAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/news", optionalAuth, async (req, res) => {
  const query = ListNewsQueryParams.safeParse(req.query);
  let items = await db.select().from(newsTable).orderBy(newsTable.createdAt);
  if (query.success && query.data.category) {
    items = items.filter((n) => n.category === query.data.category);
  }
  if (req.user) {
    res.json(items.map((n) => ({ ...n, date: n.date, viewCount: n.viewCount })));
  } else {
    res.json(items.map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      date: n.date,
      viewCount: n.viewCount,
    })));
  }
});

router.post("/news", requireRole("admin"), async (req, res) => {
  const body = CreateNewsBody.parse(req.body);
  const [item] = await db.insert(newsTable).values({
    title: body.title,
    body: body.body,
    category: body.category,
    date: new Date().toLocaleDateString("ar-EG"),
    viewCount: 0,
  }).returning();
  res.status(201).json(item);
});

router.get("/news/:id", optionalAuth, async (req, res) => {
  const { id } = GetNewsParams.parse({ id: Number(req.params.id) });
  const [item] = await db.select().from(newsTable).where(eq(newsTable.id, id));
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  if (req.user) {
    res.json(item);
  } else {
    res.json({ id: item.id, title: item.title, category: item.category, date: item.date, viewCount: item.viewCount });
  }
});

export default router;
