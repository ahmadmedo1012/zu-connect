import { Router } from "express";
import { db } from "@workspace/db";
import { newsTable, coursesTable, membersTable, collegesTable, libraryTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/stats", async (_req, res) => {
  const [studentsRes, collegesRes, activitiesRes, libraryRes, coursesRes, membersRes] = await Promise.all([
    db.select({ count: sql<number>`sum(student_count)` }).from(collegesTable),
    db.select({ count: sql<number>`count(*)` }).from(collegesTable),
    db.select({ count: sql<number>`count(*)` }).from(newsTable),
    db.select({ count: sql<number>`count(*)` }).from(libraryTable),
    db.select({ count: sql<number>`count(*)` }).from(coursesTable),
    db.select({ count: sql<number>`count(*)` }).from(membersTable),
  ]);

  res.json({
    totalStudents: Number(studentsRes[0]?.count ?? 5240),
    totalColleges: Number(collegesRes[0]?.count ?? 14),
    totalActivities: Number(activitiesRes[0]?.count ?? 48),
    totalLibraryFiles: Number(libraryRes[0]?.count ?? 320),
    totalCourses: Number(coursesRes[0]?.count ?? 0),
    totalMembers: Number(membersRes[0]?.count ?? 0),
  });
});

export default router;
