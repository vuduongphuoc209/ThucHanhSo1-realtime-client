import { getSocket } from "./socket";

import { getPendingMessages, deletePendingMessage } from "../database/pendingMessages";

let syncing = false;

export const syncPendingMessages = async () => {
  if (syncing) {
    return;
  }

  if (!navigator.onLine) {
    return;
  }

  const socket = getSocket();

  if (!socket || !socket.connected) {
    return;
  }

  syncing = true;

  try {
    const pending = await getPendingMessages();

    console.log(`Found ${pending.length} pending messages`);

    for (const message of pending) {
      socket.emit("send_message", {
        conversationId: message.conversationId,
        content: message.content,
        type: message.type,
        clientMessageId: message.clientMessageId,
      });

      await deletePendingMessage(message.id);
    }
  } catch (error) {
    console.error("Offline sync error:", error);
  } finally {
    syncing = false;
  }
};
