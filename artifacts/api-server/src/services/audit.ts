import { db, auditLogsTable } from "@workspace/db";
import type { Request } from "express";

export async function logAudit(
  req: Request,
  action: string,
  entity: string,
  entityId?: number,
  details?: Record<string, any>
) {
  if (!req.user) return;

  try {
    await db.insert(auditLogsTable).values({
      userId: req.user.id,
      userName: req.user.name,
      action,
      entity,
      entityId,
      details: (details ?? {}) as any,
      ipAddress: req.ip || req.socket.remoteAddress || "unknown",
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}
