import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    console.log("Send:", message);

    setMessage("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: 16,
        background: "#ffffff",
        borderTop: "1px solid #eeeeee",
      }}
    >
      <Input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onPressEnter={handleSend}
        placeholder="Nhập tin nhắn..."
      />

      <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
