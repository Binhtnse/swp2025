import { Button, Card, Row, Col, Typography } from "antd";
import {
  HeartOutlined,
  TeamOutlined,
  CalendarOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HomeScreen = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-blue-500 to-cyan-400 py-20 text-white text-center relative"
        style={{
          backgroundImage: "https://uoflhealth.org/wp-content/uploads/2021/10/MENTAL-HEALTH-scaled.jpg",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 relative">
          <Title className="text-white mb-6">
            Sức Khỏe Tinh Thần Của Bạn Là Rất Quan Trọng
          </Title>
          <Paragraph className="text-white text-lg mb-8">
            Hỗ trợ sinh viên trong hành trình học tập với các nguồn tài nguyên
            chăm sóc sức khỏe tinh thần chuyên nghiệp
          </Paragraph>
          <Button
            type="primary"
            size="large"
            className="bg-white text-blue-500 hover:bg-blue-50"
          >
            Nhận Hỗ Trợ Ngay
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="text-center h-full transition-transform hover:-translate-y-2"
            >
              <HeartOutlined className="text-4xl text-blue-500 mb-4" />
              <Title level={4}>Dịch Vụ Tư Vấn</Title>
              <Paragraph className="text-gray-600">
                Kết nối với các chuyên gia tư vấn để được hỗ trợ bảo mật
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="text-center h-full transition-transform hover:-translate-y-2"
            >
              <TeamOutlined className="text-4xl text-blue-500 mb-4" />
              <Title level={4}>Nhóm Hỗ Trợ</Title>
              <Paragraph className="text-gray-600">
                Tham gia các nhóm hỗ trợ trực tuyến cùng các sinh viên khác
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="text-center h-full transition-transform hover:-translate-y-2"
            >
              <CalendarOutlined className="text-4xl text-blue-500 mb-4" />
              <Title level={4}>Đặt Lịch Dễ Dàng</Title>
              <Paragraph className="text-gray-600">
                Đặt lịch hẹn với các chuyên gia sức khỏe tinh thần
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="text-center h-full transition-transform hover:-translate-y-2"
            >
              <BookOutlined className="text-4xl text-blue-500 mb-4" />
              <Title level={4}>Tài Liệu Tự Học</Title>
              <Paragraph className="text-gray-600">
                Truy cập hướng dẫn, bài tập và công cụ chăm sóc sức khỏe
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={12}>
                <img
                  src="https://uoflhealth.org/wp-content/uploads/2021/10/MENTAL-HEALTH-scaled.jpg"
                  alt="Support Illustration"
                  className="rounded-lg shadow-lg w-full"
                />
              </Col>
              <Col xs={24} lg={12}>
                <Title level={2}>Chúng Tôi Luôn Bên Cạnh Bạn</Title>
                <Paragraph className="text-lg">
                  Đội ngũ chuyên gia tận tâm, sẵn sàng lắng nghe và hỗ trợ bạn
                  trong mọi hoàn cảnh
                </Paragraph>
              </Col>
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="text-center mt-16 py-20 relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mx-4 shadow-2xl"
          style={{
            backgroundImage: "url('/path-to-cta-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative text-white max-w-3xl mx-auto px-4">
            <Title level={2}  className="text-white !mb-8">Cần Hỗ Trợ Ngay?</Title>
            <Paragraph className="text-xl mb-12 text-white opacity-90">
              Đội ngũ tư vấn của chúng tôi luôn sẵn sàng 24/7 để giúp đỡ bạn
              vượt qua khó khăn
            </Paragraph>
            <Button type="primary" size="large" className="bg-white !text-indigo-600 hover:!bg-indigo-50 border-0 h-12 px-8 text-lg font-medium">
              Liên Hệ Đường Dây Nóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
