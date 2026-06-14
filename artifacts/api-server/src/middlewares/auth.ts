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

function decodeToken(header: string) {
  const payload = JSON.parse(Buffer.from(header.slice(7), "base64url").toString());
  if (!payload.role || !payload.id || !payload.name) {
    return null;
  }
  return payload as Request["user"];
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const user = decodeToken(header);
      if (!user) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      if (roles.length > 0 && !roles.includes(user.role as Role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      req.user = user;
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next();
    return;
  }
  try {
    const user = decodeToken(header);
    if (user) {
      req.user = user;
    }
  } catch {
    // ignore invalid tokens
  }
  next();
}
