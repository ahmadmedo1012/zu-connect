import { Router } from "express";
import { db, suggestionsTable } from "@workspace/db";
import { CreateSuggestionBody } from "@workspace/api-zod";

const router = Router();

router.post("/suggestions", async (req, res) => {
  const body = CreateSuggestionBody.parse(req.body);
  const [item] = await db.insert(suggestionsTable).values({
    name: body.name ?? null,
    college: body.college ?? null,
    type: body.type,
    message: body.message,
  }).returning();
  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

export default router;
