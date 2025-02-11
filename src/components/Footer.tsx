import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { PhoneOutlined, MailOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const AppFooter: React.FC = () => {
  return (
    <Footer className="bg-blue-50 mt-8">
      <Row gutter={[24, 24]} className="max-w-7xl mx-auto">
        <Col xs={24} sm={12} md={8}>
          <Title level={4} className="text-blue-800">Trung Tâm Hỗ Trợ Sinh Viên</Title>
          <Space direction="vertical" className="text-gray-600">
            <Text><PhoneOutlined className="mr-2" />Đường dây nóng 24/7: 1800-123-4567</Text>
            <Text><MailOutlined className="mr-2" />hotro@studentcare.edu</Text>
            <Text className="mt-2">Chúng tôi luôn sẵn sàng hỗ trợ sức khỏe tinh thần của bạn</Text>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Title level={4} className="text-blue-800">Liên Kết Nhanh</Title>
          <Space direction="vertical" className="text-gray-600">
            <Link href="/counseling">Dịch Vụ Tư Vấn</Link>
            <Link href="/workshops">Hội Thảo Sức Khỏe</Link>
            <Link href="/resources">Tài Liệu Sức Khỏe Tinh Thần</Link>
            <Link href="/emergency">Hỗ Trợ Khẩn Cấp</Link>
          </Space>
        </Col>

        <Col xs={24} md={8}>
          <Title level={4} className="text-blue-800">Sứ Mệnh Của Chúng Tôi</Title>
          <Space direction="vertical" className="text-gray-600">
            <Text><HeartOutlined className="mr-2" />Nâng Cao Sức Khỏe Tinh Thần</Text>
            <Text><TeamOutlined className="mr-2" />Xây Dựng Cộng Đồng Hỗ Trợ</Text>
          </Space>
        </Col>
      </Row>

      <Row className="mt-8 pt-4 border-t border-blue-100">
        <Col span={24} className="text-center text-gray-500">
          <Text>© {new Date().getFullYear()} Trung Tâm Hỗ Trợ Tâm Lý Sinh Viên. Đã đăng ký bản quyền.</Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
