import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import type { ChatMessage } from "../services/chatApi";

interface PendingMessage {
  id: string;

  clientMessageId: string;

  conversationId: string;

  content: string;

  type: "text";

  createdAt: string;

  status: "pending" | "failed";
}

interface ChatDBSchema extends DBSchema {
  messages: {
    key: string;

    value: ChatMessage;

    indexes: {
      "by-conversation": string;
    };
  };

  pendingMessages: {
    key: string;

    value: PendingMessage;

    indexes: {
      "by-conversation": string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<ChatDBSchema>>;

export const getChatDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<ChatDBSchema>("realtime-chat-db", 1, {
      upgrade(db) {
        /**
         * Messages
         */
        const messageStore = db.createObjectStore("messages", {
          keyPath: "_id",
        });

        messageStore.createIndex("by-conversation", "conversationId");

        /**
         * Pending messages
         */
        const pendingStore = db.createObjectStore("pendingMessages", {
          keyPath: "id",
        });

        pendingStore.createIndex("by-conversation", "conversationId");
      },
    });
  }

  return dbPromise;
};
