import type { User } from "./user";
import type { Message } from "./message";

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}
