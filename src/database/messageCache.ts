import type { ChatMessage } from "../services/chatApi";

import { getChatDB } from "./chatDB";

export const cacheMessages = async (messages: ChatMessage[]) => {
  const db = await getChatDB();

  const tx = db.transaction("messages", "readwrite");

  for (const message of messages) {
    await tx.store.put(message);
  }

  await tx.done;
};

export const getCachedMessages = async (conversationId: string) => {
  const db = await getChatDB();

  return db.getAllFromIndex("messages", "by-conversation", conversationId);
};

export const cacheMessage = async (message: ChatMessage) => {
  const db = await getChatDB();

  await db.put("messages", message);
};
