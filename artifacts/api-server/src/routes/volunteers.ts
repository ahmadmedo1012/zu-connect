import { Router } from "express";
import { db, volunteersTable } from "@workspace/db";
import { CreateVolunteerBody } from "@workspace/api-zod";

const router = Router();

router.post("/volunteers", async (req, res) => {
  const body = CreateVolunteerBody.parse(req.body);
  const [item] = await db.insert(volunteersTable).values({
    name: body.name,
    college: body.college,
    phone: body.phone,
    area: body.area,
  }).returning();
  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

export default router;
