import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const { identifier, password, role } = req.body;
  if (!identifier || !password || !role) {
    res.status(400).json({ error: "identifier, password, and role are required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.identifier, identifier))
    .limit(1);

  if (!user || user.password !== password || user.role !== role) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    role: user.role,
    identifier: user.identifier,
  })).toString("base64url");

  res.json({ token, name: user.name, role: user.role });
});

export default router;
