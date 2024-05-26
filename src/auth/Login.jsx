import { Card, Flex, Form, Typography, Input, Button, Alert, Spin } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const { error, loading, loginUser } = useLogin();

  const handleLogin = (values) => {
    loginUser(values);
  };

  return (
    <div className="login-page">
      <Card className="form-container">
        <Flex>
          {/* Form */}
          <Flex vertical flex={1}>
            <Typography.Title level={3} strong className="title">
              Sign In
            </Typography.Title>
            <Typography.Text type="secondary" strong className="slogan">
              Manage story & audio.
            </Typography.Text>
            <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email",
                  },
                  {
                    type: "email",
                    message: "The input is not valid Email",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                />
              </Form.Item>

              {error && (
                <Alert
                  description={error}
                  type="error"
                  showIcon
                  closable
                  className="alert"
                />
              )}
              <Form.Item>
                <Button
                  type={`${loading ? "" : "primary"}`}
                  htmlType="submit"
                  size="large"
                  className="btn"
                >
                  {loading ? <Spin /> : "Sign In"}
                  {/* Sign In */}
                </Button>
              </Form.Item>
            </Form>
          </Flex>

          {/* Image */}
          <Flex></Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default Login;
