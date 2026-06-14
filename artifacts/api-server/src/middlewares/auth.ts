import type { Request, Response, NextFunction } from "express";

export type Role = "student" | "teacher" | "admin";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        role: Role;
        identifier: string;
      };
    }
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const payload = JSON.parse(Buffer.from(header.slice(7), "base64url").toString());
      if (!payload.role || !payload.id || !payload.name) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      if (roles.length > 0 && !roles.includes(payload.role as Role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
}
