import { Empty } from "antd";

import { useEffect, useRef } from "react";

import type { ChatMessage } from "../../services/chatApi";

import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  onMessageVisible: (message: ChatMessage) => void;
}

const MessageList = ({
  messages,
  currentUserId,
  onMessageVisible,
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  useEffect(() => {
    const unreadMessages = messages.filter((message) => {
      const senderId =
        typeof message.senderId === "string"
          ? message.senderId
          : message.senderId._id;

      return senderId !== currentUserId && !message.isRead;
    });

    unreadMessages.forEach(onMessageVisible);
  }, [messages, currentUserId, onMessageVisible]);

  if (messages.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Empty description="Hãy bắt đầu cuộc trò chuyện" />
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
      }}
    >
      {messages.map((message) => {
        const senderId =
          typeof message.senderId === "string"
            ? message.senderId
            : message.senderId._id;

        return (
          <MessageBubble
            key={message._id}
            message={message}
            isMine={senderId === currentUserId}
          />
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
