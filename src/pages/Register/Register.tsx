import { Button, Card, Form, Input, Typography, message } from "antd";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";

import { register } from "../../store/slices/authSlice";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (values: RegisterForm) => {
    const result = await dispatch(
      register({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    );

    if (register.fulfilled.match(result)) {
      message.success("Đăng ký thành công");

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
        <Typography.Title level={2}>Tạo tài khoản</Typography.Title>

        {error && <Typography.Text type="danger">{error}</Typography.Text>}

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập username",
              },
              {
                min: 3,
                message: "Username tối thiểu 3 ký tự",
              },
            ]}
          >
            <Input placeholder="phuoc" />
          </Form.Item>

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
              {
                min: 6,
                message: "Mật khẩu tối thiểu 6 ký tự",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp"),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng ký
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
