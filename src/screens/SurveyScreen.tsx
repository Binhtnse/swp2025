import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Typography, Empty, message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Survey {
  id: number;
  title: string;
  description: string;
  status: string;
  isDeleted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

const SurveyScreen: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { Title, Paragraph, Text } = Typography;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        
        // Mock data instead of API call
        const mockSurveys: Survey[] = [
          {
            id: 1,
            title: "Đánh giá mức độ stress",
            description: "Khảo sát này giúp đánh giá mức độ stress của bạn trong cuộc sống hàng ngày",
            status: "ACTIVE",
            isDeleted: false,
            createdAt: "2023-10-01T08:00:00Z",
            updatedAt: "2023-10-01T08:00:00Z"
          },
          {
            id: 2,
            title: "Đánh giá sức khỏe tinh thần",
            description: "Khảo sát này giúp đánh giá tình trạng sức khỏe tinh thần của bạn trong tháng qua",
            status: "ACTIVE",
            isDeleted: false,
            createdAt: "2023-09-15T10:30:00Z",
            updatedAt: "2023-09-15T10:30:00Z"
          },
          {
            id: 3,
            title: "Đánh giá mức độ lo âu",
            description: "Khảo sát này giúp đánh giá mức độ lo âu của bạn trong hai tuần qua",
            status: "ACTIVE",
            isDeleted: false,
            createdAt: "2023-11-05T14:15:00Z",
            updatedAt: "2023-11-05T14:15:00Z"
          }
        ];
        
        // Filter out deleted surveys
        const activeSurveys = mockSurveys.filter(
          (survey: Survey) => !survey.isDeleted
        );
        
        // Simulate network delay
        setTimeout(() => {
          setSurveys(activeSurveys);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Failed to fetch surveys:', error);
        message.error('Không thể tải khảo sát. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <Title level={2} className="text-center text-primary mb-2">
          Khảo Sát Sức Khỏe Tinh Thần
        </Title>
        <Paragraph className="text-center text-gray-600 max-w-2xl mx-auto">
          Khám phá bộ sưu tập các khảo sát sức khỏe tinh thần được thiết kế để đánh giá và cải thiện sức khỏe.
          Chọn một khảo sát để tham gia.
        </Paragraph>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Đang tải khảo sát..." />
        </div>
      ) : surveys.length > 0 ? (
        <Row gutter={[24, 24]}>
          {surveys.map((survey) => (
            <Col xs={24} sm={12} md={8} lg={8} key={survey.id}>
              <Card
                hoverable
                className="h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                onClick={() => {
                    navigate(`/surveys/${survey.id}`);
                }}
              >
                <div className="flex flex-col h-full">
                  <Title level={4} className="mb-2 text-primary">
                    {survey.title}
                  </Title>
                  <Paragraph className="text-gray-600 flex-grow">
                    {survey.description}
                  </Paragraph>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Text type="secondary" className="text-sm">
                      Mã khảo sát: {survey.id}
                    </Text>
                    <Text type="secondary" className="text-sm ml-4">
                      Trạng thái: {survey.status}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="Không có khảo sát nào khả dụng vào lúc này"
          className="my-16"
        />
      )}
    </div>
  );
};

export default SurveyScreen;
