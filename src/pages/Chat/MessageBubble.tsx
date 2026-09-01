import { CheckOutlined, CheckCircleOutlined } from "@ant-design/icons";

import type { ChatMessage } from "../../services/chatApi";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

const MessageBubble = ({ message, isMine }: MessageBubbleProps) => {
  const sender = typeof message.senderId === "string" ? null : message.senderId;

  const time = new Date(message.createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMine ? "flex-end" : "flex-start",
          maxWidth: "70%",
        }}
      >
        {!isMine && sender && (
          <span
            style={{
              fontSize: 12,
              color: "#8c8c8c",
              marginBottom: 4,
              marginLeft: 8,
            }}
          >
            {sender.username}
          </span>
        )}

        <div
          style={{
            padding: "10px 14px",
            borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",

            background: isMine ? "#1677ff" : "#f1f1f1",

            color: isMine ? "#fff" : "#222",

            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 4,
            padding: "0 5px",
            fontSize: 11,
            color: "#999",
          }}
        >
          <span>{time}</span>

          {isMine && (
            <>
              {message.isRead ? (
                <CheckCircleOutlined
                  style={{
                    color: "#1677ff",
                  }}
                />
              ) : (
                <CheckOutlined />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
