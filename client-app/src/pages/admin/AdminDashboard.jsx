import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
  return (
    <Card>
      <Title level={2}>Admin Dashboard</Title>
      <Paragraph>Welcome to the Admin Dashboard. Manage airlines, users, and flights from here.</Paragraph>
      {/* Add more content and components here */}
    </Card>
  );
};

export default AdminDashboard; 