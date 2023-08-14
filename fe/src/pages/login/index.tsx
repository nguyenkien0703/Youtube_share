import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../stores/auth/slice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stores";
import { EActionStatus } from "../../stores/type";
const { Title } = Typography;

interface Values {
  username: string;
  password: string;
}

const LoginPage: FC = () => {
  const { status } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = (values: Values) => {
    const { username, password } = values;
    if (username && password) dispatch(signIn({ username, password }));
  };

  useEffect(() => {
    if (status === EActionStatus.Succeeded) navigate("/");
  }, [status]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card hoverable style={{ width: 500 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Title level={3}>Login Account </Title>
        </div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            username: "huy1",
            password: "huy1",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              Log in
            </Button>
            <div style={{ paddingTop: "5px" }}>
              Don't have an account{" "}
              <Link to="/register" style={{ color: "#1677ff" }}>
                sign up
              </Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
