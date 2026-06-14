import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListNewsQueryParams, CreateNewsBody, GetNewsParams } from "@workspace/api-zod";

const router = Router();

router.get("/news", async (req, res) => {
  const query = ListNewsQueryParams.safeParse(req.query);
  let items = await db.select().from(newsTable).orderBy(newsTable.createdAt);
  if (query.success && query.data.category) {
    items = items.filter((n) => n.category === query.data.category);
  }
  res.json(items.map((n) => ({ ...n, date: n.date, viewCount: n.viewCount })));
});

router.post("/news", async (req, res) => {
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

router.get("/news/:id", async (req, res) => {
  const { id } = GetNewsParams.parse({ id: Number(req.params.id) });
  const [item] = await db.select().from(newsTable).where(eq(newsTable.id, id));
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

export default router;
