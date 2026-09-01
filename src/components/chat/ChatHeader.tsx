import { Avatar, Typography } from "antd";

const ChatHeader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 20px",
        background: "#ffffff",
        borderBottom: "1px solid #eeeeee",
      }}
    >
      <Avatar size={42}>A</Avatar>

      <div>
        <Typography.Text strong>Nguyễn Văn A</Typography.Text>

        <br />

        <Typography.Text type="success" style={{ fontSize: 12 }}>
          ● Online
        </Typography.Text>
      </div>
    </div>
  );
};

export default ChatHeader;
