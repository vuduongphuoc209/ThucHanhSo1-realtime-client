import { getChatDB } from "./chatDB";

export const savePendingMessage = async (message: { conversationId: string; content: string; type: "text" }) => {
  const db = await getChatDB();

  const id = crypto.randomUUID();
  const clientMessageId = crypto.randomUUID();

  await db.put("pendingMessages", {
    id,
    clientMessageId,
    ...message,
    createdAt: new Date().toISOString(),
    status: "pending",
  });

  return id;
};

export const getPendingMessages = async () => {
  const db = await getChatDB();

  return db.getAll("pendingMessages");
};

export const deletePendingMessage = async (id: string) => {
  const db = await getChatDB();

  await db.delete("pendingMessages", id);
};
