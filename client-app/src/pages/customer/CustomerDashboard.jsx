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
  Avatar,
  Divider,
  List,
  Rate
} from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  HistoryOutlined,
  UserOutlined,
  StarOutlined,
  MessageOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: '', relation: '' }]);

  const [searchForm] = Form.useForm();
  const [bookingForm] = Form.useForm();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, statsRes] = await Promise.all([
        axios.get('/api/bookings/user'),
        axios.get('/api/customer/stats')
      ]);

      setBookings(bookingsRes.data.bookings || []);
      setStats(statsRes.data);
    } catch (error) {
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSearch = async (values) => {
    try {
      const searchParams = {
        origin: values.origin,
        destination: values.destination,
        departureDate: values.dates[0].format('YYYY-MM-DD'),
        returnDate: values.dates[1]?.format('YYYY-MM-DD'),
        passengers: values.passengers
      };

      const response = await axios.get('/api/flights/search', { params: searchParams });
      setFlights(response.data);
      setSearchModal(false);
      message.success('Flights found successfully');
    } catch (error) {
      message.error('No flights found for the selected criteria');
    }
  };

  const handleBooking = async (values) => {
    try {
      const bookingData = {
        flightId: selectedFlight.fltId,
        passengers: passengers.filter(p => p.name && p.age),
        departureDate: values.departureDate.format('YYYY-MM-DD')
      };

      await axios.post('/api/bookings', bookingData);
      message.success('Booking created successfully');
      setBookingModal(false);
      loadDashboardData();
    } catch (error) {
      message.error('Booking failed: ' + error.response?.data?.message);
    }
  };

  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: '', relation: '' }]);
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const removePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const bookingColumns = [
    {
      title: 'Booking ID',
      dataIndex: 'bkId',
      key: 'bkId',
    },
    {
      title: 'Flight',
      dataIndex: 'flight',
      key: 'flight',
      render: (flight) => `${flight.fltOrigin} → ${flight.fltDest}`
    },
    {
      title: 'Departure Date',
      dataIndex: 'bkDepDate',
      key: 'bkDepDate',
      render: (date) => moment(date).format('DD MMM YYYY')
    },
    {
      title: 'Status',
      dataIndex: 'bkStatus',
      key: 'bkStatus',
      render: (status) => {
        const statusMap = {
          'U': { text: 'Upcoming', color: 'blue' },
          'C': { text: 'Confirmed', color: 'green' },
          'P': { text: 'Completed', color: 'cyan' },
          'R': { text: 'Cancelled', color: 'red' }
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
          <Button type="link" size="small">View Details</Button>
          {record.bkStatus === 'U' && (
            <Button type="link" size="small" danger>Cancel</Button>
          )}
        </Space>
      )
    }
  ];

  const flightColumns = [
    {
      title: 'Flight ID',
      dataIndex: 'fltId',
      key: 'fltId',
    },
    {
      title: 'Route',
      key: 'route',
      render: (_, record) => `${record.fltOrigin} → ${record.fltDest}`
    },
    {
      title: 'Airline',
      dataIndex: 'airline',
      key: 'airline',
      render: (airline) => airline?.airName || 'N/A'
    },
    {
      title: 'Departure',
      dataIndex: 'fltDepTime',
      key: 'fltDepTime',
      render: (time) => moment(time, 'HH:mm:ss').format('HH:mm')
    },
    {
      title: 'Duration',
      dataIndex: 'fltTotDur',
      key: 'fltTotDur',
      render: (duration) => moment(duration, 'HH:mm:ss').format('HH:mm')
    },
    {
      title: 'Price',
      dataIndex: 'fltTkPrice',
      key: 'fltTkPrice',
      render: (price) => `₹${price}`
    },
    {
      title: 'Available Seats',
      dataIndex: 'availableSeats',
      key: 'availableSeats',
      render: (seats) => <Text strong>{seats}</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedFlight(record);
            setBookingModal(true);
          }}
          disabled={record.availableSeats === 0}
        >
          Book Now
        </Button>
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
                <Title level={3}>Welcome back, {user?.userId}!</Title>
                <Text type="secondary">Manage your flights and bookings</Text>
              </Col>
              <Col>
                <Space>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => setSearchModal(true)}
                  >
                    Search Flights
                  </Button>
                  <Button icon={<HistoryOutlined />}>
                    Booking History
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Statistics Cards */}
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats.totalBookings || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Trips"
              value={stats.completedBookings || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Ratings"
              value={stats.totalRatings || 0}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        {/* Recent Bookings */}
        <Col span={24}>
          <Card title="Recent Bookings" extra={<Button type="link">View All</Button>}>
            <Table
              columns={bookingColumns}
              dataSource={bookings.slice(0, 5)}
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>

        {/* Search Flights Modal */}
        <Modal
          title="Search Flights"
          open={searchModal}
          onCancel={() => setSearchModal(false)}
          footer={null}
          width={600}
        >
          <Form form={searchForm} onFinish={handleFlightSearch} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="origin"
                  label="From"
                  rules={[{ required: true, message: 'Please select origin' }]}
                >
                  <Select placeholder="Select origin city">
                    <Option value="Mumbai">Mumbai</Option>
                    <Option value="Delhi">Delhi</Option>
                    <Option value="Bangalore">Bangalore</Option>
                    <Option value="Chennai">Chennai</Option>
                    <Option value="Kolkata">Kolkata</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="destination"
                  label="To"
                  rules={[{ required: true, message: 'Please select destination' }]}
                >
                  <Select placeholder="Select destination city">
                    <Option value="Mumbai">Mumbai</Option>
                    <Option value="Delhi">Delhi</Option>
                    <Option value="Bangalore">Bangalore</Option>
                    <Option value="Chennai">Chennai</Option>
                    <Option value="Kolkata">Kolkata</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="dates"
              label="Travel Dates"
              rules={[{ required: true, message: 'Please select travel dates' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="passengers"
              label="Passengers"
              initialValue={1}
              rules={[{ required: true, message: 'Please select number of passengers' }]}
            >
              <Select>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <Option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setSearchModal(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Search Flights</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Flight Results */}
        {flights.length > 0 && (
          <Col span={24}>
            <Card title="Available Flights">
              <Table
                columns={flightColumns}
                dataSource={flights}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>
        )}

        {/* Booking Modal */}
        <Modal
          title="Book Flight"
          open={bookingModal}
          onCancel={() => setBookingModal(false)}
          footer={null}
          width={800}
        >
          {selectedFlight && (
            <div>
              <Card size="small" style={{ marginBottom: '20px' }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={4}>{selectedFlight.fltOrigin} → {selectedFlight.fltDest}</Title>
                    <Text>Flight: {selectedFlight.fltId} | Airline: {selectedFlight.airline?.airName}</Text>
                  </Col>
                  <Col>
                    <Text strong style={{ fontSize: '18px' }}>₹{selectedFlight.fltTkPrice}</Text>
                  </Col>
                </Row>
              </Card>

              <Form form={bookingForm} onFinish={handleBooking} layout="vertical">
                <Form.Item
                  name="departureDate"
                  label="Departure Date"
                  rules={[{ required: true, message: 'Please select departure date' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Divider>Passenger Details</Divider>

                {passengers.map((passenger, index) => (
                  <Card key={index} size="small" style={{ marginBottom: '10px' }}>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Input
                          placeholder="Full Name"
                          value={passenger.name}
                          onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                        />
                      </Col>
                      <Col span={4}>
                        <Input
                          placeholder="Age"
                          type="number"
                          value={passenger.age}
                          onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                        />
                      </Col>
                      <Col span={4}>
                        <Select
                          placeholder="Gender"
                          style={{ width: '100%' }}
                          value={passenger.gender}
                          onChange={(value) => updatePassenger(index, 'gender', value)}
                        >
                          <Option value="M">Male</Option>
                          <Option value="F">Female</Option>
                          <Option value="O">Other</Option>
                        </Select>
                      </Col>
                      <Col span={6}>
                        <Input
                          placeholder="Relation"
                          value={passenger.relation}
                          onChange={(e) => updatePassenger(index, 'relation', e.target.value)}
                        />
                      </Col>
                      <Col span={4}>
                        {index > 0 && (
                          <Button
                            type="link"
                            danger
                            onClick={() => removePassenger(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Button type="dashed" onClick={addPassenger} style={{ width: '100%', marginBottom: '20px' }}>
                  Add Passenger
                </Button>

                <Form.Item style={{ textAlign: 'right' }}>
                  <Space>
                    <Button onClick={() => setBookingModal(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Confirm Booking</Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          )}
        </Modal>
      </Row>
    </Content>
  );
};

export default CustomerDashboard;
