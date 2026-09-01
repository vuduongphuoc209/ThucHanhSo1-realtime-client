import { BellOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Layout, Space, Typography } from "antd";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#ffffff",
        borderBottom: "1px solid #eeeeee",
      }}
    >
      <Typography.Title
        level={4}
        style={{
          margin: 0,
        }}
      >
        Realtime Chat
      </Typography.Title>

      <Space size="large">
        <Badge count={3} size="small">
          <BellOutlined
            style={{
              fontSize: 20,
              cursor: "pointer",
            }}
          />
        </Badge>

        <Badge count={1} size="small">
          <MessageOutlined
            style={{
              fontSize: 20,
              cursor: "pointer",
            }}
          />
        </Badge>

        <Avatar icon={<UserOutlined />} />
      </Space>
    </Header>
  );
};

export default Navbar;
