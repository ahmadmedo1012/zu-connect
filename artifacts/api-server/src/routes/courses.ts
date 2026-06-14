import { Router } from "express";
import { db, coursesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { ListCoursesQueryParams, CreateCourseBody, EnrollCourseParams, EnrollCourseBody, UnenrollCourseParams, UnenrollCourseBody } from "@workspace/api-zod";
import { optionalAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/courses", optionalAuth, async (req, res) => {
  const query = ListCoursesQueryParams.safeParse(req.query);
  let items = await db.select().from(coursesTable).orderBy(coursesTable.createdAt);
  if (query.success && query.data.category) {
    items = items.filter((c) => c.category === query.data.category);
  }
  if (req.user) {
    res.json(items);
  } else {
    res.json(items.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      level: c.level,
      duration: c.duration,
    })));
  }
});

router.post("/courses", requireRole("admin"), async (req, res) => {
  const body = CreateCourseBody.parse(req.body);
  const [item] = await db.insert(coursesTable).values({
    ...body,
    enrolledCount: 0,
  }).returning();
  res.status(201).json(item);
});

router.post("/courses/:id/enroll", requireRole("student", "teacher", "admin"), async (req, res) => {
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

router.post("/courses/:id/unenroll", requireRole("student", "teacher", "admin"), async (req, res) => {
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
