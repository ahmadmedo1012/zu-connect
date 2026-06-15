# ADMIN SECURITY AND RISK PLAN

## Threat Model

| Threat | Risk Level | Mitigation |
|--------|-----------|------------|
| Unauthorized admin access | Critical | Route guard + middleware + server-side permission check |
| Token forgery | High | Replace base64url encoding with proper JWT + signing + expiry |
| XSS through admin forms | High | Input sanitization, output encoding, Content-Security-Policy |
| CSRF on admin actions | High | CSRF tokens or SameSite cookies |
| SQL injection | Medium | Prevented by Drizzle ORM (parameterized queries) |
| Data exposure via API | High | Verify all admin endpoints require authentication + authorization |
| Session hijacking | High | HTTP-only cookies, short token expiry, IP binding |
| Telegram token leak | Critical | Store in environment variable, never in DB, mask in UI |
| Rate limiting bypass | Medium | Apply rate limiting to auth endpoints and Telegram API |
| Privilege escalation | Critical | Server-side permission verification on every request |
| Audit log tampering | Medium | Append-only audit logs, database-level restrictions |
| Supply chain attack | Low | Existing 1440-min release age policy covers this |

## Token Security Upgrade

### Current State (vulnerable)
```typescript
// Insecure: no signature, no expiry, base64 encoded
const token = Buffer.from(JSON.stringify({ id, name, role })).toString("base64url");
```

### Required Upgrade
```typescript
// Use jsonwebtoken with HS256 signing
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || (() => { throw new Error("JWT_SECRET required"); })();

function signToken(user: { id: number; name: string; role: string; identifier: string }) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role, identifier: user.identifier },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch {
    return null;
  }
}
```

**Migration**: Add JWT_SECRET to .env.example. Update auth middleware to use jwt. Keep backward compatibility during transition.

## Access Control Layers

```
Layer 1: Route Level (Frontend)
├── AdminGuard component wraps all /admin routes
├── Checks: is user logged in? is user admin?
└── Fallback: redirect to /login or /

Layer 2: API Gateway (Backend)
├── requireRole("admin") on all /api/admin routes
├── Checks: valid token? role = admin?
└── Fallback: 401 Unauthorized / 403 Forbidden

Layer 3: Permission Level (Backend)
├── Granular permission check per section
├── Checks: does admin_user have required permission?
└── Fallback: 403 Forbidden

Layer 4: Data Level (Backend)
├── Verify entity ownership where applicable
├── Sanitize inputs with Zod schemas
└── Log all mutations to audit trail
```

## Secrets Management

| Secret | Storage | Access |
|--------|---------|--------|
| JWT_SECRET | .env / environment | Server only |
| TELEGRAM_BOT_TOKEN | .env / environment | Server only |
| DATABASE_URL | .env / environment | Server only |
| Admin passwords | Hashed (bcrypt) | Database (hashed) |
| Integration API keys | Encrypted in DB (AES-256) | Admin settings page |

## Audit Trail Integrity

- Audit logs use an append-only pattern (no UPDATE/DELETE in code)
- Each event includes: userId, action, entity, entityId, details (JSON), ipAddress, timestamp
- Audit table has database-level RLS policy to prevent direct modification
- Regular audit log review scheduled in admin workflow

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /api/auth/login | 5 attempts | 15 minutes |
| POST /api/admin/* | 100 requests | 1 minute |
| GET /api/admin/* | 300 requests | 1 minute |
| Telegram API calls | 30/second | 1 second |

## Session Management

- Admin token expiry: 24 hours (configurable)
- Idle timeout: 8 hours (configurable via system settings)
- Concurrent sessions: Allowed (logged in audit trail)
- Force logout: Available in admin settings (invalidates all tokens)
- Token refresh: Sliding expiration, refresh on each admin API call

## Compliance Checklist

- [ ] All admin routes protected by authentication middleware
- [ ] All admin routes protected by role/permission middleware
- [ ] JWT_SECRET environment variable set and validated on startup
- [ ] Telegram bot token stored as environment variable, not in database
- [ ] Passwords hashed with bcrypt (upgrade from plaintext)
- [ ] Audit trail captures all admin mutations
- [ ] Rate limiting applied to auth endpoints
- [ ] Input validation via Zod schemas on all admin APIs
- [ ] No admin links in public navigation
- [ ] Admin pages return 404 (not 403) for unauthenticated users to hide existence
- [ ] CORS configured to restrict admin API access
- [ ] Content-Security-Policy header applied
- [ ] XSS sanitization on all admin form inputs
- [ ] Database backups configured
- [ ] All admin mutations logged to audit trail
