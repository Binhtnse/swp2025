import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Modal,
  Tabs,
  Radio,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Image } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";
import TabPane from "antd/es/tabs/TabPane";

const { Title } = Typography;

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setRole, setUserName } = useAuthState();
  const [resetEmail, setResetEmail] = useState("");
  const [isResetFormVisible, setIsResetFormVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resetForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handlePasswordReset = async () => {
    try {
      const response = await axios.get(
        `https://sep490-backend-production.up.railway.app/api/v1/user/password/request-reset?email=${encodeURIComponent(
          resetEmail
        )}`
      );
      message.success(
        "Mã đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn."
      );
      console.log(response);
      setIsResetFormVisible(true);
    } catch (error) {
      console.error("Password reset request failed:", error);
      message.error(
        "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại!"
      );
    }
  };

  const handleRegister = async (values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await axios.post(
        "https://sep490-backend-production.up.railway.app/api/v1/user/register",
        {
          username: values.username,
          email: values.email,
          password: values.password,
        }
      );
      console.log(response);
      message.success("Đăng ký thành công!");
      registerForm.resetFields();
    } catch (error) {
      console.error("Registration failed:", error);
      message.error("Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  const handleResetSubmit = async (values: {
    resetTokenCode: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await axios.put(
        "https://sep490-backend-production.up.railway.app/api/v1/user/password/reset",
        {
          email: resetEmail,
          resetTokenCode: values.resetTokenCode,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }
      );
      message.success("Mật khẩu đã được đặt lại thành công!");
      console.log(response);
      setIsModalVisible(false);
      setIsResetFormVisible(false);
    } catch (error) {
      console.error("Password reset failed:", error);
      message.error("Không thể đặt lại mật khẩu. Vui lòng thử lại!");
    }
  };

  const onFinish = async (values: { account: string; password: string }) => {
    try {
      const response = await axios.post(
        "https://sep490-backend-production.up.railway.app/api/v1/user/login",
        {
          account: values.account,
          password: values.password,
        }
      );
      console.log("Login successful:", response.data);
      message.success("Đăng nhập thành công!");

      if (response.data.data && response.data.data.userLogin) {
        localStorage.setItem(
          "userLogin",
          JSON.stringify(response.data.data.userLogin)
        );
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
      } else {
        console.error("Unexpected response structure:", response.data);
      }

      setIsLoggedIn(true);
      const userRole =
        response.data.data.userLogin.roleName?.toUpperCase() || "";
      setRole(userRole);
      const leaderType = response.data.data.userLogin.leaderType || "";
      localStorage.setItem("leaderType", leaderType);
      setUserName(response.data.data.userLogin.name || "");
      if (userRole === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

  const renderLoginForm = () => (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="account"
        rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        className="mb-1"
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>
      <div className="text-right mb-6">
        <a onClick={() => setIsModalVisible(true)}>Quên mật khẩu?</a>
      </div>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form
      form={registerForm}
      name="register"
      onFinish={handleRegister}
      layout="vertical"
    >
      <Form.Item
        name="role"
        rules={[{ required: true, message: "Vui lòng chọn loại tài khoản!" }]}
      >
        <Radio.Group>
          <Radio.Button value="student">Học sinh</Radio.Button>
          <Radio.Button value="parent">Phụ huynh</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Xác nhận mật khẩu"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2">
        <Image
          src="https://img.freepik.com/free-vector/mental-health-awareness-concept_23-2148514643.jpg"
          alt="Mental health"
          className="object-cover w-full"
          style={{ height: "100vh" }}
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md">
          <Title level={2} className="text-center mb-8">
            Chào mừng
          </Title>
          <Tabs defaultActiveKey="login" centered>
            <TabPane tab="Đăng nhập" key="login">
              {renderLoginForm()}
            </TabPane>
            <TabPane tab="Đăng ký" key="register">
              {renderRegisterForm()}
            </TabPane>
          </Tabs>
        </div>
        <Modal
          title="Đặt lại mật khẩu"
          visible={isModalVisible}
          onOk={() =>
            isResetFormVisible ? resetForm.submit() : handlePasswordReset()
          }
          onCancel={() => {
            setIsModalVisible(false);
            setIsResetFormVisible(false);
            resetForm.resetFields();
          }}
        >
          {!isResetFormVisible ? (
            <Input
              placeholder="Nhập email của bạn"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          ) : (
            <Form
              form={resetForm}
              onFinish={handleResetSubmit}
              layout="vertical"
            >
              <Form.Item
                name="resetTokenCode"
                label="Mã đặt lại mật khẩu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã đặt lại mật khẩu!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng xác nhận mật khẩu mới!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default LoginScreen;
