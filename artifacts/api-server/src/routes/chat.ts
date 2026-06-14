import { Router } from "express";
import { db, chatRoomsTable, chatMessagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListChatMessagesParams, SendChatMessageParams, SendChatMessageBody } from "@workspace/api-zod";

const router = Router();

router.get("/chat/rooms", async (_req, res) => {
  const rooms = await db.select().from(chatRoomsTable).orderBy(chatRoomsTable.id);
  res.json(rooms);
});

router.get("/chat/rooms/:roomId/messages", async (req, res) => {
  const { roomId } = ListChatMessagesParams.parse({ roomId: Number(req.params.roomId) });
  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.roomId, roomId))
    .orderBy(chatMessagesTable.createdAt);
  res.json(messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  })));
});

router.post("/chat/rooms/:roomId/messages", async (req, res) => {
  const { roomId } = SendChatMessageParams.parse({ roomId: Number(req.params.roomId) });
  const body = SendChatMessageBody.parse(req.body);
  const [message] = await db.insert(chatMessagesTable).values({
    roomId,
    sender: body.sender,
    message: body.message,
    isMe: body.isMe,
  }).returning();
  res.status(201).json({ ...message, createdAt: message.createdAt.toISOString() });
});

export default router;
