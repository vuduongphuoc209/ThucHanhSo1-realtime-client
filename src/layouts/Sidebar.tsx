import {
  MessageOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Sider width={240} theme="light" breakpoint="md" collapsedWidth="0">
      <Menu
        mode="inline"
        defaultSelectedKeys={["chat"]}
        style={{
          height: "100%",
          borderRight: 0,
          paddingTop: 12,
        }}
        items={[
          {
            key: "chat",
            icon: <MessageOutlined />,
            label: "Messages",
            onClick: () => navigate("/chat"),
          },
          {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile",
            onClick: () => navigate("/profile"),
          },
          {
            key: "posts",
            icon: <ProfileOutlined />,
            label: "Posts",
          },
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
