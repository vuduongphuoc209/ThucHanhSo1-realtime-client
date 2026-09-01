import { Button, Card, Form, Input, Typography, message } from "antd";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";

import { login } from "../../store/slices/authSlice";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (values: LoginForm) => {
    const result = await dispatch(login(values));

    if (login.fulfilled.match(result)) {
      message.success("Đăng nhập thành công");

      navigate("/chat");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Typography.Title level={2}>Đăng nhập</Typography.Title>

        {error && <Typography.Text type="danger">{error}</Typography.Text>}

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email",
              },
              {
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
          <Button type="link" onClick={() => navigate("/register")}>
            Chưa có tài khoản? Đăng ký
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
