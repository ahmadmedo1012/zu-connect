import { Router } from "express";
import { requireRole, requirePermission } from "../../middlewares/auth";

const router = Router();

router.get("/admin/files", requireRole("admin"), requirePermission("admin.files"), async (_req, res) => {
  res.json({ files: [], message: "File management coming soon" });
});

export default router;
