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
        permissions?: string[];
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

// Permission check middleware for admin granular permissions
import { db, adminUsersTable, adminRolesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

function cacheGet<T>(cache: Map<string, { data: T; expiry: number }>, key: string): T | undefined {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) return entry.data;
  cache.delete(key);
  return undefined;
}

function cacheSet<T>(cache: Map<string, { data: T; expiry: number }>, key: string, data: T, ttlMs: number) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

const permissionsCache = new Map<string, { data: string[]; expiry: number }>();

export async function loadAdminPermissions(userId: number): Promise<string[]> {
  const cached = cacheGet(permissionsCache, `admin_perm_${userId}`);
  if (cached) return cached;

  try {
    const [adminUser] = await db
      .select({ permissions: adminRolesTable.permissions })
      .from(adminUsersTable)
      .innerJoin(adminRolesTable, eq(adminUsersTable.roleId, adminRolesTable.id))
      .where(eq(adminUsersTable.userId, userId))
      .limit(1);

    const perms = (adminUser?.permissions as string[]) ?? [];
    cacheSet(permissionsCache, `admin_perm_${userId}`, perms, 5 * 60 * 1000);
    return perms;
  } catch {
    return [];
  }
}

export function clearPermissionCache(userId: number) {
  permissionsCache.delete(`admin_perm_${userId}`);
}

export function requirePermission(permissionKey: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (req.user.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const permissions = await loadAdminPermissions(req.user.id);
    if (!permissions.includes(permissionKey) && !permissions.includes("*")) {
      res.status(403).json({ error: `Missing permission: ${permissionKey}` });
      return;
    }

    req.user.permissions = permissions;
    next();
  };
}
