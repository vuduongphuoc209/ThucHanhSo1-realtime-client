import api from "./api";

export interface ChatUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: "online" | "offline";
  lastSeen?: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId:
    | string
    | {
        _id: string;
        username: string;
        email: string;
        avatar?: string;
      };
  content: string;
  type: "text" | "image" | "file";
  isRead: boolean;
  status?: "pending" | "sent" | "read";
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: ChatUser[];
  type: "private" | "group";
  name?: string;
  avatar?: string;
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
}

export const getUsersApi = async (search = "") => {
  const response = await api.get<{
    success: boolean;
    data: {
      users: ChatUser[];
    };
  }>("/users", {
    params: {
      search,
    },
  });

  return response.data;
};

export const getConversationsApi = async () => {
  const response = await api.get<{
    success: boolean;
    data: {
      conversations: Conversation[];
    };
  }>("/conversations");

  return response.data;
};

export const createPrivateConversationApi = async (userId: string) => {
  const response = await api.post<{
    success: boolean;
    data: {
      conversation: Conversation;
    };
  }>("/conversations/private", {
    userId,
  });

  return response.data;
};

export const getMessagesApi = async (conversationId: string) => {
  const response = await api.get<{
    success: boolean;
    data: {
      messages: ChatMessage[];
    };
  }>(`/messages/${conversationId}`);

  return response.data;
};

export const createMessageApi = async (conversationId: string, content: string) => {
  const response = await api.post<{
    success: boolean;
    data: {
      message: ChatMessage;
    };
  }>(`/messages/${conversationId}`, {
    content,
    type: "text",
  });

  return response.data;
};
