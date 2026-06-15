# ADMIN EVENT SCHEMA

## Event Format (Standard)

Every event emitted via socket.io or stored in the admin_events table follows this structure:

```typescript
interface AdminEvent {
  /** Unique event type identifier */
  type: AdminEventType;
  
  /** Event payload (type-specific) */
  payload: Record<string, any>;
  
  /** Metadata */
  _meta: {
    /** Event type for routing */
    event: string;
    /** ISO 8601 timestamp */
    emittedAt: string;
    /** Server instance ID (for multi-instance) */
    instance?: string;
  };
}
```

## Event Catalog

### 1. System Events

#### admin:server_startup
```typescript
{
  type: "admin:server_startup",
  payload: {
    version: string,        // Server version
    uptime: number,         // Seconds since startup
  }
}
```

#### admin:server_shutdown
```typescript
{
  type: "admin:server_shutdown",
  payload: {
    reason?: string,
    scheduled: boolean,
  }
}
```

#### admin:system_alert
```typescript
{
  type: "admin:system_alert",
  payload: {
    level: "info" | "warning" | "error" | "critical",
    message: string,            // Arabic or English
    source: string,             // Component name
    details?: Record<string, any>,
    alertId: string,            // Unique alert ID
  }
}
```

#### admin:database_backup
```typescript
{
  type: "admin:database_backup",
  payload: {
    status: "started" | "completed" | "failed",
    size?: number,              // Bytes
    duration?: number,          // Milliseconds
    error?: string,
    timestamp: string,
  }
}
```

### 2. User Events

#### admin:new_login
```typescript
{
  type: "admin:new_login",
  payload: {
    userId: number,
    name: string,
    role: string,
    identifier: string,
    ipAddress?: string,
    timestamp: string,          // ISO 8601
  }
}
```

#### admin:new_registration
```typescript
{
  type: "admin:new_registration",
  payload: {
    userId: number,
    name: string,
    identifier: string,
    role: string,
    referralCode?: string,
    timestamp: string,
  }
}
```

#### admin:user_role_changed
```typescript
{
  type: "admin:user_role_changed",
  payload: {
    userId: number,
    name: string,
    previousRole: string,
    newRole: string,
    changedBy: number,
    changedByName: string,
    timestamp: string,
  }
}
```

### 3. Referral Events

#### admin:new_referral
```typescript
{
  type: "admin:new_referral",
  payload: {
    referralId: number,
    referrerId: number,
    referrerName: string,
    refereeName?: string,
    code: string,
    status: "pending" | "completed",
    timestamp: string,
  }
}
```

#### admin:referral_rewarded
```typescript
{
  type: "admin:referral_rewarded",
  payload: {
    referralId: number,
    referrerId: number,
    referrerName: string,
    pointsAwarded: number,
    totalPoints: number,
    tier: string,
    timestamp: string,
  }
}
```

### 4. Complaint/Suggestion Events

#### admin:new_complaint
```typescript
{
  type: "admin:new_complaint",
  payload: {
    itemId: number,
    name?: string,
    college?: string,
    type: string,               // Complaint type
    message: string,            // Truncated preview
    isUrgent: boolean,
    timestamp: string,
  }
}
```

#### admin:new_suggestion
```typescript
{
  type: "admin:new_suggestion",
  payload: {
    itemId: number,
    name?: string,
    college?: string,
    type: string,
    message: string,            // Truncated preview
    timestamp: string,
  }
}
```

#### admin:moderation_action
```typescript
{
  type: "admin:moderation_action",
  payload: {
    itemId: number,
    itemType: "complaint" | "suggestion",
    previousStatus: string,
    newStatus: string,          // "pending" | "in_review" | "resolved" | "rejected" | "escalated"
    actionBy: number,
    actionByName: string,
    response?: string,
    timestamp: string,
  }
}
```

### 5. Content Events

#### admin:content_created
```typescript
{
  type: "admin:content_created",
  payload: {
    entity: string,             // "news" | "course" | "member" | "college" | "library" | "planner" | "faq" | "leadership"
    entityId: number,
    title?: string,
    createdBy: number,
    createdByName: string,
    timestamp: string,
  }
}
```

#### admin:content_updated
```typescript
{
  type: "admin:content_updated",
  payload: {
    entity: string,
    entityId: number,
    title?: string,
    updatedBy: number,
    updatedByName: string,
    changes: string[],          // List of changed fields
    timestamp: string,
  }
}
```

#### admin:content_deleted
```typescript
{
  type: "admin:content_deleted",
  payload: {
    entity: string,
    entityId: number,
    title?: string,
    deletedBy: number,
    deletedByName: string,
    timestamp: string,
  }
}
```

### 6. Announcement Events

#### admin:announcement_published
```typescript
{
  type: "admin:announcement_published",
  payload: {
    announcementId: number,
    title: string,
    priority: "low" | "normal" | "high" | "urgent",
    publishedBy: number,
    publishedByName: string,
    timestamp: string,
  }
}
```

#### admin:announcement_expired
```typescript
{
  type: "admin:announcement_expired",
  payload: {
    announcementId: number,
    title: string,
    timestamp: string,
  }
}
```

### 7. Course Events

#### admin:course_enrollment
```typescript
{
  type: "admin:course_enrollment",
  payload: {
    courseId: number,
    courseTitle: string,
    userId: number,
    userName: string,
    enrollmentCount: number,
    totalSeats: number,
    timestamp: string,
  }
}
```

#### admin:course_full
```typescript
{
  type: "admin:course_full",
  payload: {
    courseId: number,
    courseTitle: string,
    enrolledCount: number,
    totalSeats: number,
    timestamp: string,
  }
}
```

### 8. File Events

#### admin:file_uploaded
```typescript
{
  type: "admin:file_uploaded",
  payload: {
    fileId: number,
    fileName: string,
    fileSize: number,           // Bytes
    fileType: string,
    uploadedBy: number,
    uploadedByName: string,
    timestamp: string,
  }
}
```

## Emitter Implementation

```typescript
// Backend event emitter helper
import { adminNamespace } from "../services/admin-socket";

type EventPayload<T extends AdminEventType> = Extract<AdminEvent, { type: T }>["payload"];

export function emitAdminEvent<T extends AdminEventType>(
  type: T,
  payload: EventPayload<T>
) {
  const event: AdminEvent = {
    type,
    payload,
    _meta: {
      event: type,
      emittedAt: new Date().toISOString(),
    },
  };

  // Emit to connected admin clients
  adminNamespace?.emit(type, event);

  // Persist to database (async, non-blocking)
  persistAdminEvent(event).catch((err) => {
    logger.error({ err, eventType: type }, "Failed to persist admin event");
  });
}

async function persistAdminEvent(event: AdminEvent) {
  await db.insert(adminEventsTable).values({
    eventType: event.type,
    payload: event.payload as any,
  });
}
```

## Client Subscription

```typescript
// Frontend React hook for subscribing to admin events
import { useEffect } from "react";
import { adminSocket } from "../AdminSocket";

export function useAdminEvent<T = any>(
  eventType: string,
  handler: (data: T) => void,
  deps: any[] = []
) {
  useEffect(() => {
    const unsubscribe = adminSocket.on(eventType, handler);
    return unsubscribe;
  }, [eventType, ...deps]);
}

// Usage
function LiveFeed() {
  const [events, setEvents] = useState<AdminEvent[]>([]);

  useAdminEvent<AdminEvent>("admin:new_login", (event) => {
    setEvents(prev => [event, ...prev].slice(0, 100));
  });

  useAdminEvent<AdminEvent>("admin:new_referral", (event) => {
    setEvents(prev => [event, ...prev].slice(0, 100));
  });

  // ...
}
```

## Event Retention

- Events in `admin_events` table: 30 days retention
- Events in memory (live feed): last 100 events
- Events in `audit_logs` table: indefinite (permanent)
- Events in `telegram_logs` table: 90 days retention

## Catch-Up on Reconnect

```typescript
// On socket.io reconnection
socket.on("connect", () => {
  // Get last received event timestamp
  const lastEventTime = localStorage.getItem("admin_last_event_time");
  
  if (lastEventTime) {
    socket.emit("admin:catch_up", { since: lastEventTime });
  }
});

// Server handles catch_up
adminNamespace.on("connection", (socket) => {
  socket.on("admin:catch_up", async ({ since }) => {
    const missedEvents = await db
      .select()
      .from(adminEventsTable)
      .where(gt(adminEventsTable.createdAt, new Date(since)))
      .orderBy(asc(adminEventsTable.createdAt))
      .limit(100);
    
    missedEvents.forEach(event => {
      socket.emit(event.eventType, {
        type: event.eventType,
        payload: event.payload,
        _meta: { event: event.eventType, emittedAt: event.createdAt, catchUp: true },
      });
    });
  });
});
```
