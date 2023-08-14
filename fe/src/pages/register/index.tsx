import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Typography,
  notification,
} from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stores";
import { signUp } from "../../stores/auth/slice";
import { EActionStatus } from "../../stores/type";

const { Title } = Typography;

interface Values {
  username: string;
  email: string;
  password: string;
  phone: string | null;
  dob: string | null;
}

export default function RegisterPage() {
  const { statusSignUp } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values: Values) => {
    dispatch(signUp({ ...values }));
  };

  useEffect(() => {
    if (statusSignUp === EActionStatus.Succeeded) {
      notification.success({
        message: "Sign up successfully!",
      });

      const timeoutId = setTimeout(() => {
        navigate("/login");
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [statusSignUp]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card style={{ width: 500 }} hoverable>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Title level={3}>Register Account</Title>
        </div>
        <Form
          name="register_form"
          className="register-form"
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: null,
            dob: null,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your Username!" },
              { whitespace: true, message: "Username cannot empty!" },
              { min: 3, message: "Username must be at least 3 characters!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
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
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your confirm Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item name="phone">
            <Input
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="Phone"
            />
          </Form.Item>
          <Form.Item name="dob">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
              block
            >
              Register account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
