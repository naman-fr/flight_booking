import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Statistic,
  Tabs,
  Avatar,
  Divider,
  List,
  Progress,
  Badge
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  MessageOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [airlineModal, setAirlineModal] = useState(false);
  const [grievanceModal, setGrievanceModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  const [airlineForm] = Form.useForm();
  const [grievanceForm] = Form.useForm();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        usersRes,
        airlinesRes,
        customersRes,
        grievancesRes
      ] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/airlines'),
        axios.get('/api/admin/customers'),
        axios.get('/api/admin/grievances')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setAirlines(airlinesRes.data.airlines || []);
      setCustomers(customersRes.data.customers || []);
      setGrievances(grievancesRes.data.grievances || []);
    } catch (error) {
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAirline = async (values) => {
    try {
      await axios.post('/api/admin/airlines', values);
      message.success('Airline created successfully');
      setAirlineModal(false);
      airlineForm.resetFields();
      loadDashboardData();
    } catch (error) {
      message.error('Failed to create airline: ' + error.response?.data?.message);
    }
  };

  const handleRespondToGrievance = async (values) => {
    try {
      await axios.put(`/api/admin/grievances/${selectedGrievance.grvId}/respond`, values);
      message.success('Response submitted successfully');
      setGrievanceModal(false);
      loadDashboardData();
    } catch (error) {
      message.error('Failed to submit response');
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, { status });
      message.success('User status updated successfully');
      loadDashboardData();
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const userColumns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Role',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (role) => {
        const roleColors = {
          'Admin': 'red',
          'Airline': 'blue',
          'Customer': 'green'
        };
        return <Tag color={roleColors[role]}>{role}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'A': { text: 'Active', color: 'green' },
          'I': { text: 'Inactive', color: 'orange' },
          'R': { text: 'Suspended', color: 'red' }
        };
        const statusInfo = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => date ? moment(date).format('DD MMM YYYY HH:mm') : 'Never'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => updateUserStatus(record.userId, record.status === 'A' ? 'I' : 'A')}
          >
            {record.status === 'A' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button type="link" size="small" danger>Delete</Button>
        </Space>
      )
    }
  ];

  const airlineColumns = [
    {
      title: 'Airline ID',
      dataIndex: 'airId',
      key: 'airId',
    },
    {
      title: 'Name',
      dataIndex: 'airName',
      key: 'airName',
    },
    {
      title: 'Email',
      dataIndex: 'airEmail',
      key: 'airEmail',
    },
    {
      title: 'Fleet Size',
      dataIndex: 'airFleet',
      key: 'airFleet',
    },
    {
      title: 'Rating',
      dataIndex: 'airRating',
      key: 'airRating',
      render: (rating) => rating ? `${rating}/5` : 'N/A'
    },
    {
      title: 'Status',
      dataIndex: 'airStatus',
      key: 'airStatus',
      render: (status) => {
        const statusMap = {
          'A': { text: 'Active', color: 'green' },
          'I': { text: 'Inactive', color: 'orange' }
        };
        const statusInfo = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      )
    }
  ];

  const grievanceColumns = [
    {
      title: 'Grievance ID',
      dataIndex: 'grvId',
      key: 'grvId',
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.userId || 'N/A'
    },
    {
      title: 'Flight',
      dataIndex: 'flight',
      key: 'flight',
      render: (flight) => flight ? `${flight.fltOrigin} → ${flight.fltDest}` : 'N/A'
    },
    {
      title: 'Complaint',
      dataIndex: 'complaint',
      key: 'complaint',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'P': { text: 'Pending', color: 'orange' },
          'R': { text: 'Resolved', color: 'green' }
        };
        const statusInfo = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSelectedGrievance(record);
              setGrievanceModal(true);
            }}
          >
            Respond
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Content style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={3}>Admin Dashboard</Title>
                <Text type="secondary">Manage users, airlines, and system operations</Text>
              </Col>
              <Col>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setAirlineModal(true)}>
                  Add Airline
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Statistics Cards */}
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.users?.total || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Customers"
              value={stats.users?.customers || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Airlines"
              value={stats.users?.airlines || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Flights"
              value={stats.flights || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats.bookings || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Pending Grievances"
              value={stats.pendingGrievances || 0}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>

        {/* Main Content Tabs */}
        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="User Management" key="1">
                <Table
                  columns={userColumns}
                  dataSource={users}
                  pagination={{ pageSize: 10 }}
                  loading={loading}
                />
              </TabPane>

              <TabPane tab="Airline Management" key="2">
                <Table
                  columns={airlineColumns}
                  dataSource={airlines}
                  pagination={{ pageSize: 10 }}
                  loading={loading}
                />
              </TabPane>

              <TabPane tab="Customer Management" key="3">
                <Table
                  columns={[
                    {
                      title: 'Customer ID',
                      dataIndex: 'usrId',
                      key: 'usrId',
                    },
                    {
                      title: 'Name',
                      dataIndex: 'usrName',
                      key: 'usrName',
                    },
                    {
                      title: 'Email',
                      dataIndex: 'usrEmail',
                      key: 'usrEmail',
                    },
                    {
                      title: 'Mobile',
                      dataIndex: 'usrMobNum',
                      key: 'usrMobNum',
                    },
                    {
                      title: 'Status',
                      dataIndex: 'usrStatus',
                      key: 'usrStatus',
                      render: (status) => (
                        <Tag color={status === 'A' ? 'green' : 'orange'}>
                          {status === 'A' ? 'Active' : 'Inactive'}
                        </Tag>
                      )
                    }
                  ]}
                  dataSource={customers}
                  pagination={{ pageSize: 10 }}
                  loading={loading}
                />
              </TabPane>

              <TabPane
                tab={
                  <Badge count={stats.pendingGrievances} offset={[10, 0]}>
                    Grievance Management
                  </Badge>
                }
                key="4"
              >
                <Table
                  columns={grievanceColumns}
                  dataSource={grievances}
                  pagination={{ pageSize: 10 }}
                  loading={loading}
                />
              </TabPane>

              <TabPane tab="Reports & Analytics" key="5">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="System Health">
                      <Progress type="circle" percent={85} format={percent => `${percent}%`} />
                      <Text style={{ marginTop: '10px', display: 'block' }}>System Uptime</Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Revenue Overview">
                      <Statistic
                        title="Total Revenue"
                        value={stats.revenue || 0}
                        prefix="₹"
                        valueStyle={{ color: '#3f8600' }}
                      />
                      <Text style={{ marginTop: '10px', display: 'block' }}>
                        Average Rating: {stats.averageRating?.toFixed(1) || 'N/A'}/5
                      </Text>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Create Airline Modal */}
      <Modal
        title="Create New Airline"
        open={airlineModal}
        onCancel={() => setAirlineModal(false)}
        footer={null}
        width={600}
      >
        <Form form={airlineForm} onFinish={handleCreateAirline} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="airId"
                label="Airline ID"
                rules={[{ required: true, message: 'Please input airline ID' }]}
              >
                <Input placeholder="Enter Airline ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input password' }]}
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="airName"
            label="Airline Name"
            rules={[{ required: true, message: 'Please input airline name' }]}
          >
            <Input placeholder="Enter Airline Name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="airEmail"
                label="Email"
                rules={[
                  { required: true, message: 'Please input email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter Email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="airMobNum"
                label="Mobile Number"
                rules={[
                  { required: true, message: 'Please input mobile number' },
                  { pattern: /^[6-9]\d{9}$/, message: 'Invalid mobile number' }
                ]}
              >
                <Input placeholder="Enter Mobile Number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="airCity"
                label="City"
                rules={[{ required: true, message: 'Please input city' }]}
              >
                <Input placeholder="Enter City" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="airPinCode"
                label="Pincode"
                rules={[
                  { required: true, message: 'Please input pincode' },
                  { pattern: /^\d{6}$/, message: 'Pincode must be 6 digits' }
                ]}
              >
                <Input placeholder="Enter Pincode" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="airState"
                label="State"
                rules={[{ required: true, message: 'Please select state' }]}
              >
                <Select placeholder="Select State">
                  <Option value="Maharashtra">Maharashtra</Option>
                  <Option value="Delhi">Delhi</Option>
                  <Option value="Karnataka">Karnataka</Option>
                  <Option value="Tamil Nadu">Tamil Nadu</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="airAddress"
            label="Address"
            rules={[{ required: true, message: 'Please input address' }]}
          >
            <Input.TextArea placeholder="Enter Full Address" rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="airFleet"
                label="Fleet Size"
                rules={[{ required: true, message: 'Please input fleet size' }]}
              >
                <Input type="number" placeholder="Enter Fleet Size" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="airEstDate"
                label="Establishment Date"
                rules={[{ required: true, message: 'Please select establishment date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setAirlineModal(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create Airline</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Grievance Response Modal */}
      <Modal
        title="Respond to Grievance"
        open={grievanceModal}
        onCancel={() => setGrievanceModal(false)}
        footer={null}
        width={600}
      >
        {selectedGrievance && (
          <div>
            <Card size="small" style={{ marginBottom: '20px' }}>
              <Text strong>Grievance ID: {selectedGrievance.grvId}</Text>
              <br />
              <Text>Customer: {selectedGrievance.user?.userId}</Text>
              <br />
              <Text>Flight: {selectedGrievance.flight?.fltOrigin} → {selectedGrievance.flight?.fltDest}</Text>
              <br />
              <Text>Complaint: {selectedGrievance.complaint}</Text>
            </Card>

            <Form form={grievanceForm} onFinish={handleRespondToGrievance} layout="vertical">
              <Form.Item
                name="response"
                label="Response"
                rules={[{ required: true, message: 'Please provide a response' }]}
              >
                <Input.TextArea
                  placeholder="Enter your response to the grievance"
                  rows={4}
                />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => setGrievanceModal(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Submit Response</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </Content>
  );
};

export default AdminDashboard;
