import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select,
  DatePicker,
  Radio,
  Space,
  Alert,
  Spin,
  Row,
  Col,
  Divider
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      // Format date
      const formattedValues = {
        ...values,
        dob: values.dob.format('YYYY-MM-DD'),
      };

      const response = await axios.post('/api/auth/register', formattedValues);

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_, value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!value || regex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Password must be at least 8 characters with uppercase, lowercase, number and special character'));
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Passwords do not match'));
    },
  });

  const validateAadhar = (_, value) => {
    if (!value || /^\d{12}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Aadhar number must be 12 digits'));
  };

  const validateMobile = (_, value) => {
    if (!value || /^[6-9]\d{9}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Invalid mobile number'));
  };

  if (success) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Alert
            message="Registration Successful!"
            description="Your account has been created successfully. You will be redirected to login page."
            type="success"
            showIcon
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          Customer Registration
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: '20px' }}
          />
        )}

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Divider orientation="left">Login Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userId"
                label="User ID"
                rules={[
                  { required: true, message: 'Please input your User ID!' },
                  { min: 3, message: 'User ID must be at least 3 characters' }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Enter User ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { validator: validatePassword }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter Password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  validateConfirmPassword
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Personal Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input placeholder="Enter Full Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select your date of birth!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select your gender!' }]}
              >
                <Radio.Group>
                  <Radio value="M">Male</Radio>
                  <Radio value="F">Female</Radio>
                  <Radio value="O">Other</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={[
                  { required: true, message: 'Please input your mobile number!' },
                  { validator: validateMobile }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Enter Mobile" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="aadhar"
                label="Aadhar Number"
                rules={[
                  { required: true, message: 'Please input your Aadhar number!' },
                  { validator: validateAadhar }
                ]}
              >
                <Input prefix={<IdcardOutlined />} placeholder="Enter Aadhar" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Address Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <Input placeholder="Enter City" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please select your state!' }]}
              >
                <Select placeholder="Select State">
                  <Option value="Maharashtra">Maharashtra</Option>
                  <Option value="Delhi">Delhi</Option>
                  <Option value="Karnataka">Karnataka</Option>
                  <Option value="Tamil Nadu">Tamil Nadu</Option>
                  <Option value="Gujarat">Gujarat</Option>
                  <Option value="Rajasthan">Rajasthan</Option>
                  <Option value="Uttar Pradesh">Uttar Pradesh</Option>
                  <Option value="West Bengal">West Bengal</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                  { required: true, message: 'Please input your pincode!' },
                  { pattern: /^\d{6}$/, message: 'Pincode must be 6 digits' }
                ]}
              >
                <Input placeholder="Enter Pincode" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input.TextArea
              prefix={<HomeOutlined />}
              placeholder="Enter Full Address"
              rows={3}
            />
          </Form.Item>

          <Divider orientation="left">Security Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="securityQuestion"
                label="Security Question"
                rules={[{ required: true, message: 'Please select a security question!' }]}
              >
                <Select placeholder="Select Security Question">
                  <Option value="What is your pet name?">What is your pet name?</Option>
                  <Option value="What is your favorite color?">What is your favorite color?</Option>
                  <Option value="What is your mother's maiden name?">What is your mother's maiden name?</Option>
                  <Option value="What is your favorite movie?">What is your favorite movie?</Option>
                  <Option value="What is your childhood nickname?">What is your childhood nickname?</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="securityAnswer"
                label="Security Answer"
                rules={[{ required: true, message: 'Please input your security answer!' }]}
              >
                <Input placeholder="Enter Security Answer" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'center', marginTop: '30px' }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                Register
              </Button>
              <Link to="/login">
                <Button size="large">Already have an account? Login</Button>
              </Link>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
