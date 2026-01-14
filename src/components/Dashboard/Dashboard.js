import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { TeamOutlined, BarsOutlined, BookOutlined, LoginOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

const Dashboard = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Students', icon: <TeamOutlined  /> },
    { path: '/semesters', label: 'Semesters', icon: <BarsOutlined /> },
    { path: '/courses', label: 'Courses', icon: <BookOutlined /> },
    { path: '/enrollments', label: 'Enrollments', icon: <LoginOutlined /> },
  ];

  const menuItems = navItems.map(item => ({
    key: item.path,
    icon: item.icon,
    label: <Link to={item.path} style={{ color: 'inherit' }}>{item.label}</Link>,
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={256}
        style={{
          background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '32px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'white', marginBottom: '8px' }}>
            🎓 SMS
          </h1>
          <p style={{ fontSize: '12px', color: 'rgba(156, 163, 175, 1)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Student Management System
          </p>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
          }}
          theme="dark"
        />
      </Sider>
      <Layout style={{ marginLeft: 256 }}>
        <Content style={{ minHeight: '100vh', background: 'rgba(249, 250, 251, 1)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
