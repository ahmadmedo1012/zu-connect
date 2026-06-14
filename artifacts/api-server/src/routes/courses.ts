import { Router } from "express";
import { db, coursesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { ListCoursesQueryParams, CreateCourseBody, EnrollCourseParams, EnrollCourseBody, UnenrollCourseParams, UnenrollCourseBody } from "@workspace/api-zod";

const router = Router();

router.get("/courses", async (req, res) => {
  const query = ListCoursesQueryParams.safeParse(req.query);
  let items = await db.select().from(coursesTable).orderBy(coursesTable.createdAt);
  if (query.success && query.data.category) {
    items = items.filter((c) => c.category === query.data.category);
  }
  res.json(items);
});

router.post("/courses", async (req, res) => {
  const body = CreateCourseBody.parse(req.body);
  const [item] = await db.insert(coursesTable).values({
    ...body,
    enrolledCount: 0,
  }).returning();
  res.status(201).json(item);
});

router.post("/courses/:id/enroll", async (req, res) => {
  const { id } = EnrollCourseParams.parse({ id: Number(req.params.id) });
  EnrollCourseBody.parse(req.body);
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) { res.status(404).json({ error: "Not found" }); return; }
  if (course.enrolledCount >= course.totalSeats) { res.status(400).json({ error: "Course is full" }); return; }
  const [updated] = await db
    .update(coursesTable)
    .set({ enrolledCount: sql`${coursesTable.enrolledCount} + 1` })
    .where(eq(coursesTable.id, id))
    .returning();
  res.json(updated);
});

router.post("/courses/:id/unenroll", async (req, res) => {
  const { id } = UnenrollCourseParams.parse({ id: Number(req.params.id) });
  UnenrollCourseBody.parse(req.body);
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) { res.status(404).json({ error: "Not found" }); return; }
  const [updated] = await db
    .update(coursesTable)
    .set({ enrolledCount: sql`GREATEST(0, ${coursesTable.enrolledCount} - 1)` })
    .where(eq(coursesTable.id, id))
    .returning();
  res.json(updated);
});

export default router;
