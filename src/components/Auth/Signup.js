import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Card, Spin, Alert } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  signupStart,
  signupSuccess,
  signupFailure,
  clearAuthError,
} from "../../redux/authSlice";
import { setLayoutFromResponse } from "../../redux/layoutSlice";
import { authAPI } from "../../services/api";
import { defaultLayout } from "../../redux/layoutSlice";
import { message } from "antd";

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onFinish = async (values) => {
    dispatch(signupStart());

    try {
      const response = await authAPI.signup(values.email, values.password);

      // Save default layout to DB and Redux for new user
      const defaultLayoutString = JSON.stringify({
        landingPageLayout: defaultLayout,
      });
      try {
        await authAPI.saveLayout(values.email, defaultLayoutString);
      } catch (layoutError) {
        console.error("Failed to save default layout on signup:", layoutError);
      }

      // Update Redux with default layout
      dispatch(setLayoutFromResponse(defaultLayoutString));

      dispatch(signupSuccess());

      message.success(response.message);
      navigate("/login");
    } catch (err) {
      dispatch(
        signupFailure(err.message || "Signup failed. Please try again.")
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-[#5FC0DB] via-[#2c2c2c] to-black"
    >
      <Card className="w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border-0">
        {/* Header */}
        <div className="text-center mb-4 pb-5 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-800">🎓 SMS</h1>
          <p className="mt-1 text-xs text-gray-500 uppercase tracking-wider">
            Student Management System
          </p>
        </div>

        <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Create Account
        </h2>

        {error && (
          <Alert message={error} type="error" showIcon className="mb-6" />
        )}

        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input
                size="large"
                placeholder="you@example.com"
                prefix={<MailOutlined className="text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true }, { min: 4 }]}
            >
              <Input.Password
                size="large"
                placeholder="Create a strong password"
                prefix={<LockOutlined className="text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>

            {/* Confirm */}
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Re-enter your password"
                prefix={<LockOutlined className="text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="!h-12 !rounded-lg text-base font-semibold"
            >
              Sign Up
            </Button>
          </Form>
        </Spin>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
