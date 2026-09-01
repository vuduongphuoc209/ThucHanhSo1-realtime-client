import { SendOutlined } from "@ant-design/icons";

import { Button, Input } from "antd";

import { useEffect, useRef, useState } from "react";

import { getSocket } from "../../services/socket";

interface MessageInputProps {
  conversationId: string;
  onSend: (content: string) => void;
}

const MessageInput = ({ conversationId, onSend }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTyping = useRef(false);

  const stopTyping = () => {
    const socket = getSocket();

    if (socket && isTyping.current) {
      socket.emit("typing_stop", conversationId);

      isTyping.current = false;
    }
  };

  const handleChange = (value: string) => {
    setMessage(value);

    const socket = getSocket();

    if (!socket) {
      return;
    }

    if (value.trim() && !isTyping.current) {
      socket.emit("typing_start", conversationId);

      isTyping.current = true;
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 1200);
  };

  const handleSend = () => {
    const content = message.trim();

    if (!content) {
      return;
    }

    onSend(content);

    setMessage("");

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    stopTyping();
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      stopTyping();
    };
  }, [conversationId]);

  return (
    <div
      style={{
        padding: 16,
        borderTop: "1px solid #eeeeee",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Input.TextArea
          value={message}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Nhập tin nhắn..."
          autoSize={{
            minRows: 1,
            maxRows: 4,
          }}
          onPressEnter={(event) => {
            if (!event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
        />

        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<SendOutlined />}
          onClick={handleSend}
        />
      </div>

      <div
        style={{
          marginTop: 5,
          fontSize: 11,
          color: "#aaa",
        }}
      >
        Enter để gửi · Shift + Enter để xuống dòng
      </div>
    </div>
  );
};

export default MessageInput;
