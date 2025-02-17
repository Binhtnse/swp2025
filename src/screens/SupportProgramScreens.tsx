import React from 'react';
import { Card, Row, Col, Tag, Button, Typography } from 'antd';
import { ClockCircleOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface SupportProgram {
  id: number;
  title: string;
  description: string;
  duration: string;
  participants: number;
  category: string;
  imageUrl: string;
}

const supportPrograms: SupportProgram[] = [
  {
    id: 1,
    title: 'Vượt Qua Lo Âu',
    description: 'Chương trình hỗ trợ giúp bạn đối mặt và vượt qua các vấn đề lo âu trong cuộc sống hàng ngày.',
    duration: '8 tuần',
    participants: 15,
    category: 'Lo âu',
    imageUrl: 'https://example.com/anxiety.jpg'
  },
  {
    id: 2,
    title: 'Sống Tích Cực Mỗi Ngày',
    description: 'Khám phá các phương pháp và kỹ thuật để duy trì tâm trạng tích cực và cân bằng cảm xúc.',
    duration: '6 tuần',
    participants: 20,
    category: 'Phát triển bản thân',
    imageUrl: 'https://example.com/positive.jpg'
  },
  {
    id: 3,
    title: 'Kỹ Năng Quản Lý Stress',
    description: 'Học cách nhận biết và kiểm soát stress hiệu quả thông qua các bài tập thực hành.',
    duration: '4 tuần',
    participants: 12,
    category: 'Stress',
    imageUrl: 'https://example.com/stress.jpg'
  }
];

const SupportProgramScreens: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-8">
        Chương Trình Hỗ Trợ Sức Khỏe Tinh Thần
      </Title>
      
      <Row gutter={[24, 24]}>
        {supportPrograms.map(program => (
          <Col key={program.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="h-full"
              cover={
                <img
                  alt={program.title}
                  src={program.imageUrl}
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
                  {program.duration}
                </Tag>
                <Tag color="green" icon={<UserOutlined />}>
                  {program.participants} người tham gia
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
    </div>
  );
};

export default SupportProgramScreens;
