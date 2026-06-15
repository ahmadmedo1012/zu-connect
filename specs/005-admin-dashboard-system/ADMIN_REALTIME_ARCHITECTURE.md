# ADMIN REALTIME ARCHITECTURE

## Overview

Socket.io powers real-time admin dashboard updates. Events are emitted by the backend when platform actions occur and pushed to connected admin clients.

## Architecture

```
┌─────────────┐     socket.io     ┌──────────────┐
│  Admin UI   │◄─────────────────►│  API Server  │
│  (socket.io │    (ws/wss)       │  (socket.io  │
│   client)   │                   │   server)    │
└─────────────┘                   └──────┬───────┘
                                         │
                              ┌──────────▼──────────┐
                              │  Event Emitters      │
                              │  (route handlers,    │
                              │   services)          │
                              └─────────────────────┘
```

## Server Setup

Socket.io server mounts on the existing Express HTTP server:

```typescript
// In api-server/src/index.ts
import { Server as SocketIOServer } from "socket.io";

const httpServer = app.listen(port, ...);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Admin namespace - only authenticated admins
const adminNamespace = io.of("/admin");

adminNamespace.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const user = decodeToken(token);
    if (user.role !== "admin") return next(new Error("Forbidden"));
    socket.data.user = user;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});
```

## Event Types

### System Events

| Event Name | Payload | Trigger |
|-----------|---------|---------|
| admin:new_login | `{ userId, name, timestamp }` | User login |
| admin:new_registration | `{ userId, name, timestamp }` | New user registration |
| admin:new_referral | `{ referrerId, refereeName, code, timestamp }` | Referral created |
| admin:referral_rewarded | `{ referrerId, points, tier, timestamp }` | Referral completed |
| admin:new_upload | `{ fileName, type, userId, timestamp }` | File upload |
| admin:new_complaint | `{ id, type, name, timestamp }` | Complaint submitted |
| admin:new_suggestion | `{ id, type, name, timestamp }` | Suggestion submitted |
| admin:moderation_action | `{ itemId, action, moderatorId, timestamp }` | Moderation status change |
| admin:announcement_published | `{ id, title, timestamp }` | Announcement published |
| admin:event_registration | `{ eventId, userId, name, timestamp }` | Event registration |
| admin:system_alert | `{ level, message, timestamp }` | System alert (error, warning) |
| admin:course_enrollment | `{ courseId, userId, timestamp }` | Course enrollment |

### Dashboard Events

| Event Name | Payload | Purpose |
|-----------|---------|---------|
| admin:stats_update | `{ users, referrals, complaints, content }` | Update summary cards |
| admin:activity_feed | `{ events: Array }` | New activity items |
| admin:connection_status | `{ connected, timestamp }` | Connection state |

## Client Setup

```typescript
// In zu-connect frontend
import { io, Socket } from "socket.io-client";

class AdminSocket {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    this.socket = io("/admin", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5,
    });

    this.socket.on("connect", () => {
      this.reconnectAttempts = 0;
      this.emit("admin:connection_status", { connected: true });
    });

    this.socket.on("disconnect", (reason) => {
      this.emit("admin:connection_status", { connected: false, reason });
    });

    this.socket.on("connect_error", (error) => {
      this.reconnectAttempts++;
      console.error("Socket connection error:", error.message);
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    this.socket?.on(event, callback as any);
    return () => this.off(event, callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
    this.socket?.off(event, callback as any);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const adminSocket = new AdminSocket();
```

## Reconnection Strategy

| Attempt | Delay | Total Backoff |
|---------|-------|---------------|
| 1 | 1s | 1s |
| 2 | 1.5s | 2.5s |
| 3 | 2.25s | 4.75s |
| 4 | 3.37s | 8.12s |
| 5 | 5.06s | 13.18s |
| 6 | 7.59s | 20.77s |
| 7 | 11.39s | 32.16s |
| 8 | 17.08s | 49.24s |
| 9 | 25.62s | 74.86s |
| 10 | 30s (max) | ~105s |

## Event Emission (Server)

```typescript
// Helper function to emit to all admin clients
function emitAdminEvent(event: string, payload: any) {
  adminNamespace.emit(event, {
    ...payload,
    _meta: { event, emittedAt: new Date().toISOString() }
  });
}

// Usage in route handlers
app.post("/api/auth/login", async (req, res) => {
  // ... login logic ...
  emitAdminEvent("admin:new_login", {
    userId: user.id,
    name: user.name,
    timestamp: new Date().toISOString()
  });
});
```

## Event Persistence

Events are stored in a database table for audit and catch-up:

```sql
CREATE TABLE admin_events (
  id          SERIAL PRIMARY KEY,
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Index for recent event queries
CREATE INDEX idx_admin_events_created ON admin_events(created_at DESC);
```

On reconnection, the client sends its last received event timestamp and the server replays missed events.

## Connection Status UI

Admin sidebar shows a connection indicator:
- Green dot: Connected
- Yellow dot: Reconnecting
- Red dot: Disconnected
- Shows "X events missed" when catching up after reconnection
