import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Typography, Spin, Alert } from 'antd';
import { ClockCircleOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;

interface Registration {
  createdAt: string | null;
  updatedAt: string;
  id: number;
  registeredAt: string;
  status: string;
  isDeleted: boolean;
}

interface SupportProgram {
  createdAt: string | null;
  updatedAt: string;
  id: number;
  title: string;
  category: string;
  description: string;
  isDeleted: boolean;
  registrations: Registration[];
  // These fields aren't in the API but we'll set default values for rendering
  imageUrl?: string;
  duration?: string;
}

const SupportProgramScreens: React.FC = () => {
  const [supportPrograms, setSupportPrograms] = useState<SupportProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupportPrograms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://14.225.207.207:8080/api/support-program/get-all-support-program');
        setSupportPrograms(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching support programs:', err);
        setError('Failed to fetch support programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupportPrograms();
  }, []);

  // Helper function to get default image based on category
  const getDefaultImage = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Mental Health': 'https://via.placeholder.com/400x200?text=Mental+Health',
      'Education': 'https://via.placeholder.com/400x200?text=Education',
      // Add more mappings as needed
    };
    
    return categoryMap[category] || 'https://via.placeholder.com/400x200?text=Support+Program';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading support programs..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-8">
        Chương Trình Hỗ Trợ Sức Khỏe Tinh Thần
      </Title>
      
      {supportPrograms.length === 0 ? (
        <div className="text-center p-8">
          <Alert 
            message="No Support Programs Available" 
            description="There are currently no support programs available." 
            type="info" 
            showIcon 
          />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {supportPrograms.map(program => (
            <Col key={program.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full"
                cover={
                  <img
                    alt={program.title}
                    src={program.imageUrl || getDefaultImage(program.category)}
                    className="h-48 object-cover"
                  />
                }
              >
                <Title level={4}>{program.title}</Title>
                <Paragraph className="text-gray-600 mb-4">
                  {program.description}
                </Paragraph>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag color="blue" icon={<ClockCircleOutlined />}>
                    {program.updatedAt ? new Date(program.updatedAt).toLocaleDateString() : 'N/A'}
                  </Tag>
                  <Tag color="green" icon={<UserOutlined />}>
                    {program.registrations?.length || 0} người tham gia
                  </Tag>
                  <Tag color="purple">
                    {program.category}
                  </Tag>
                </div>
                
                <Button 
                  type="primary" 
                  icon={<HeartOutlined />}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Đăng Ký Tham Gia
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SupportProgramScreens;
