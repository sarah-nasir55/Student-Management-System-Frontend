import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Card, Spin, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { loginStart, loginSuccess, loginFailure } from "../../redux/authSlice";
import { setLayoutFromResponse } from "../../redux/layoutSlice";
import { authAPI } from "../../services/api";
import { setCookie } from "../../lib/cookies";
import { defaultLayout } from "../../redux/layoutSlice";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    dispatch(loginStart());

    try {
      const response = await authAPI.login(values.email, values.password);

      if (response && response.email) {
        const userData = { email: response.email };

        if (response.token) {
          setCookie("auth_token", response.token, {
            maxAge: 24 * 60 * 60,
            path: "/",
          });
        }

        localStorage.setItem("auth_user", JSON.stringify(userData));

        // Handle layout from login response
        if (response.layout === null || response.layout === undefined) {
          // If layout is null, save default layout to DB and Redux
          const defaultLayoutString = JSON.stringify({
            landingPageLayout: defaultLayout,
          });
          try {
            await authAPI.saveLayout(response.email, defaultLayoutString);
          } catch (layoutError) {
            console.error("Failed to save default layout:", layoutError);
          }
          // Store in persist:root format for layout
          const persistLayoutData = { layout: defaultLayoutString };
          localStorage.setItem(
            "persist:root",
            JSON.stringify({
              layout: persistLayoutData,
              auth: JSON.stringify(
                JSON.stringify({
                  isLoggedIn: true,
                  user: userData,
                  loading: false,
                  error: null,
                })
              ),
              _persist: JSON.stringify({ version: -1, rehydrated: true }),
            })
          );
          dispatch(setLayoutFromResponse(defaultLayoutString));
        } else {
          // If layout exists, use the returned layout
          // Store in persist:root format for layout
          const persistLayoutData = { layout: response.layout };
          localStorage.setItem(
            "persist:root",
            JSON.stringify({
              layout: persistLayoutData,
              auth: JSON.stringify(
                JSON.stringify({
                  isLoggedIn: true,
                  user: userData,
                  loading: false,
                  error: null,
                })
              ),
              _persist: JSON.stringify({ version: -1, rehydrated: true }),
            })
          );
          dispatch(setLayoutFromResponse(response.layout));
        }

        dispatch(loginSuccess(userData));
        navigate("/");
      }
    } catch (err) {
      dispatch(loginFailure(err.message || "Invalid email or password"));
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
          Welcome Back 👋
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
              rules={[{ required: true }]}
            >
              <Input.Password
                size="large"
                placeholder="••••••••"
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
              Login
            </Button>
          </Form>
        </Spin>

        <div className="text-center mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
