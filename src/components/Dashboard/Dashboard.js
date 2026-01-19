import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Divider } from "antd";
import {
  TeamOutlined,
  DashboardOutlined,
  BarsOutlined,
  BookOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout, restoreAuth } from "../../redux/authSlice";

const { Sider, Content } = Layout;

const Dashboard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser && !isLoggedIn) {
      dispatch(restoreAuth(JSON.parse(storedUser)));
    }
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardOutlined /> },
    { path: "/students", label: "Students", icon: <TeamOutlined /> },
    { path: "/semesters", label: "Semesters", icon: <BarsOutlined /> },
    { path: "/courses", label: "Courses", icon: <BookOutlined /> },
    { path: "/enrollments", label: "Enrollments", icon: <LoginOutlined /> },
  ];

  const menuItems = navItems.map((item) => ({
    key: item.path,
    icon: item.icon,
    label: <Link to={item.path}>{item.label}</Link>,
  }));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={256}
        style={{
          background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "16px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h1 style={{ color: "white", margin: 0 }}>🎓 SMS</h1>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>
            Student Management System
          </p>
        </div>

        {/* Navigation */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme="dark"
          style={{ background: "transparent", border: "none" }}
        />

        {/* User Section */}
        {isLoggedIn && (
          <div className="absolute bottom-0 left-0">
            <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

            <div
              style={{
                padding: "16px",
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Avatar size={40} icon={<UserOutlined />} />
                <div>
                  <div style={{ color: "white", fontWeight: 500 }}>
                    {user?.email}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    Logged in
                  </div>
                </div>
              </div>

              <Button
                type="primary"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                block
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: 256 }}>
        <Content style={{ background: "#f9fafb", minHeight: "100vh" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
