import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Space,
  Button,
  Badge,
  Drawer
} from 'antd';
import {
  DashboardOutlined,
  SearchOutlined,
  BookOutlined,
  HistoryOutlined,
  UserOutlined,
  StarOutlined,
  MessageOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const CustomerLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: 'Search Flights',
    },
    {
      key: '/bookings',
      icon: <BookOutlined />,
      label: 'My Bookings',
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: 'Flight History',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: '/ratings',
      icon: <StarOutlined />,
      label: 'My Ratings',
    },
    {
      key: '/grievances',
      icon: <MessageOutlined />,
      label: 'Grievances',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
    },
    {
      key: 'settings',
      icon: <UserOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      navigate(key);
    }
    setMobileMenuVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        className="desktop-sider"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#001529',
          borderBottom: '1px solid #1890ff'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {collapsed ? 'AFB' : 'Ariano Flights'}
          </Title>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        title="Ariano Flights"
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        bodyStyle={{ padding: 0 }}
        width={280}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Drawer>

      <Layout style={{ marginLeft: collapsed ? 0 : 200 }}>
        {/* Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? 0 : 200,
          zIndex: 100,
          width: collapsed ? '100%' : 'calc(100% - 200px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              style={{ display: 'none', marginRight: '16px' }}
              className="mobile-menu-button"
            />

            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              Customer Portal
            </Title>
          </div>

          <Space>
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>

            <Dropdown
              menu={{ items: userMenuItems, onClick: handleMenuClick }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text strong style={{ lineHeight: '1.2' }}>{user?.userId}</Text>
                  <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.2' }}>
                    Customer
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content */}
        <Content style={{
          marginTop: '64px',
          padding: '24px',
          background: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </Content>
      </Layout>

      <style jsx>{`
        @media (max-width: 992px) {
          .desktop-sider {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default CustomerLayout;
