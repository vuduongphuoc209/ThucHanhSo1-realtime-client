import { Avatar, Badge, Typography } from "antd";

import type { ChatUser } from "../../services/chatApi";

interface ChatHeaderProps {
  user?: ChatUser;
  isTyping: boolean;
}

const ChatHeader = ({ user, isTyping }: ChatHeaderProps) => {
  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        height: 72,
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #eeeeee",
      }}
    >
      <Badge
        dot
        status={user.status === "online" ? "success" : "default"}
        offset={[-3, 34]}
      >
        <Avatar size={44} src={user.avatar}>
          {user.username?.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>

      <div
        style={{
          marginLeft: 12,
        }}
      >
        <Typography.Text
          strong
          style={{
            display: "block",
            fontSize: 15,
          }}
        >
          {user.username}
        </Typography.Text>

        <Typography.Text
          type="secondary"
          style={{
            fontSize: 12,
          }}
        >
          {isTyping
            ? "Đang nhập..."
            : user.status === "online"
              ? "Đang hoạt động"
              : "Ngoại tuyến"}
        </Typography.Text>
      </div>
    </div>
  );
};

export default ChatHeader;
