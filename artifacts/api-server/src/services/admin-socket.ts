import { Server as SocketIOServer } from "socket.io";
import type http from "http";
import { logger } from "../lib/logger";

let adminNamespace: ReturnType<SocketIOServer["of"]> | null = null;

export function initAdminSocket(httpServer: http.Server) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  adminNamespace = io.of("/admin");

  adminNamespace.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Admin socket connected");

    socket.on("admin:catch_up", async ({ since }) => {
      const { db, adminEventsTable } = await import("@workspace/db");
      const { gt, asc } = await import("drizzle-orm");

      try {
        const missedEvents = await db
          .select()
          .from(adminEventsTable)
          .where(gt(adminEventsTable.createdAt, new Date(since)))
          .orderBy(asc(adminEventsTable.createdAt))
          .limit(100);

        for (const event of missedEvents) {
          socket.emit(event.eventType, {
            type: event.eventType,
            payload: event.payload,
            _meta: {
              event: event.eventType,
              emittedAt: event.createdAt,
              catchUp: true,
            },
          });
        }
      } catch (err) {
        logger.error({ err }, "Error caught up admin events");
      }
    });

    socket.on("disconnect", (reason) => {
      logger.info({ socketId: socket.id, reason }, "Admin socket disconnected");
    });
  });

  io.engine.on("connection_error", (err) => {
    logger.error({ err }, "Socket.io connection error");
  });

  logger.info("Admin socket.io namespace initialized");
  return io;
}

export function emitAdminEvent(eventType: string, payload: Record<string, any>) {
  if (!adminNamespace) return;

  const event = {
    type: eventType,
    payload,
    _meta: {
      event: eventType,
      emittedAt: new Date().toISOString(),
    },
  };

  adminNamespace.emit(eventType, event);

  persistAdminEvent(eventType, payload).catch((err) => {
    logger.error({ err, eventType }, "Failed to persist admin event");
  });
}

async function persistAdminEvent(eventType: string, payload: Record<string, any>) {
  const { db, adminEventsTable } = await import("@workspace/db");
  await db.insert(adminEventsTable).values({
    eventType,
    payload: payload as any,
  });
}

export function getAdminNamespace() {
  return adminNamespace;
}
