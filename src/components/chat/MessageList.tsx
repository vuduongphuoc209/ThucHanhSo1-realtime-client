import { Avatar, Typography } from "antd";

const MessageList = () => {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Avatar>A</Avatar>

        <div>
          <Typography.Text type="secondary">Nguyễn Văn A</Typography.Text>

          <div
            style={{
              marginTop: 4,
              padding: "10px 14px",
              background: "#ffffff",
              borderRadius: 12,
              maxWidth: 400,
            }}
          >
            Xin chào!
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            background: "#1677ff",
            color: "#ffffff",
            borderRadius: 12,
            maxWidth: 400,
          }}
        >
          Chào bạn, mình khỏe!
        </div>
      </div>
    </div>
  );
};

export default MessageList;
