import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Spin, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // Optionally show an Ant Design message/notification
    }

    if (isSuccess || user) {
      // Redirect based on user role
      switch (user.role) {
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        case 'Airline':
          navigate('/airline/dashboard');
          break;
        case 'Customer':
          navigate('/dashboard');
          break;
        default:
          navigate('/');
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]); // Added dependencies

  const onFinish = (values) => {
    const userData = {
      userId: values.username,
      password: values.password,
    };
    dispatch(login(userData));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title={<Title level={3}>ARIANO Sign On</Title>} style={{ width: 400 }}>
        {isError && <Alert message={message} type="error" showIcon closable />}
        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your User ID!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="User ID" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={isLoading}>
              {isLoading ? <Spin /> : 'Log in'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 