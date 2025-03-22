import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Button,
  Spin,
  message,
  Divider,
  Progress,
  Result,
  Tag,
  List,
  Timeline
} from "antd";

const { Title, Paragraph, Text } = Typography;

interface SurveyResult {
  id: number;
  surveyId: number;
  surveyTitle: string;
  score: number;
  maxScore: number;
  completedAt: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  recommendation: string;
  detailedAnalysis: string;
  keywords: string[];
  responses: {
    questionId: number;
    questionText: string;
    answer: string;
    score: number;
  }[];
}

const SurveyResultScreen: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<SurveyResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyResult = async () => {
      try {
        setLoading(true);
        
        // Mock data instead of API call
        const mockResult: SurveyResult = {
          id: parseInt(resultId || "1"),
          surveyId: 1,
          surveyTitle: "Đánh giá mức độ stress",
          score: 14,
          maxScore: 20,
          completedAt: new Date().toISOString(),
          riskLevel: "MEDIUM",
          recommendation: "Bạn đang có dấu hiệu stress ở mức trung bình. Nên tham khảo ý kiến của chuyên gia tâm lý để được tư vấn thêm. Thực hành các bài tập thư giãn và thiền định có thể giúp giảm mức độ stress.",
          detailedAnalysis: "Kết quả cho thấy bạn đang gặp khó khăn trong việc kiểm soát lo âu và căng thẳng. Các câu trả lời của bạn cho thấy bạn thường xuyên cảm thấy căng thẳng và lo lắng quá mức, đặc biệt là trong môi trường học tập.",
          keywords: ["stress", "lo âu", "căng thẳng", "mất ngủ", "thiền định", "thư giãn"],
          responses: [
            {
              questionId: 1,
              questionText: "Bạn có thường xuyên cảm thấy căng thẳng không?",
              answer: "Thường xuyên",
              score: 3
            },
            {
              questionId: 2,
              questionText: "Bạn có khó ngủ vì lo lắng không?",
              answer: "Thỉnh thoảng",
              score: 2
            },
            {
              questionId: 3,
              questionText: "Bạn có thường xuyên cảm thấy buồn chán không?",
              answer: "Thỉnh thoảng",
              score: 2
            },
            {
              questionId: 4,
              questionText: "Bạn có cảm thấy mất hứng thú với các hoạt động mà bạn từng yêu thích không?",
              answer: "Thường xuyên",
              score: 3
            },
            {
              questionId: 5,
              questionText: "Bạn có thường xuyên cảm thấy lo lắng quá mức không?",
              answer: "Thường xuyên",
              score: 4
            }
          ]
        };
        
        // Simulate network delay
        setTimeout(() => {
          setResult(mockResult);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Failed to fetch survey result:", error);
        message.error("Không thể tải kết quả khảo sát. Vui lòng thử lại sau.");
        setError("Không thể tải kết quả khảo sát");
        setLoading(false);
      }
    };

    fetchSurveyResult();
  }, [resultId]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "green";
      case "MEDIUM":
        return "orange";
      case "HIGH":
        return "red";
      default:
        return "blue";
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case "LOW":
        return "Thấp";
      case "MEDIUM":
        return "Trung bình";
      case "HIGH":
        return "Cao";
      default:
        return level;
    }
  };

  const handleBookAppointment = () => {
    navigate("/book-appointment");
  };

  const handleViewSupportPrograms = () => {
    // If there are keywords, add them as query parameters
    if (result?.keywords && result.keywords.length > 0) {
      const keywordsParam = result.keywords.join(',');
      navigate(`/support-programs?keywords=${encodeURIComponent(keywordsParam)}`);
    } else {
      navigate("/support-programs");
    }
  };

  const handleTakeSurveyAgain = () => {
    navigate(`/surveys/${result?.surveyId}`);
  };

  const handleKeywordClick = (keyword: string) => {
    navigate(`/support-programs?keywords=${encodeURIComponent(keyword)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải kết quả khảo sát..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Đã xảy ra lỗi"
        subTitle={error}
        extra={[
          <Button type="primary" key="back" onClick={() => navigate("/surveys")}>
            Quay lại danh sách khảo sát
          </Button>,
        ]}
      />
    );
  }

  if (!result) {
    return (
      <Result
        status="warning"
        title="Không tìm thấy kết quả"
        subTitle="Không thể tìm thấy kết quả khảo sát này"
        extra={[
          <Button type="primary" key="back" onClick={() => navigate("/surveys")}>
            Quay lại danh sách khảo sát
          </Button>,
        ]}
      />
    );
  }

  const scorePercentage = Math.round((result.score / result.maxScore) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg rounded-lg overflow-hidden mb-6">
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <Title level={2} className="text-primary text-center">
            Kết quả khảo sát
          </Title>
          <Paragraph className="text-center text-gray-600">
            {result.surveyTitle}
          </Paragraph>
          <Paragraph className="text-center text-gray-500 text-sm">
            Hoàn thành vào: {new Date(result.completedAt).toLocaleString('vi-VN')}
          </Paragraph>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="w-full md:w-1/2 flex flex-col items-center mb-6 md:mb-0">
              <Progress
                type="circle"
                percent={scorePercentage}
                format={() => `${result.score}/${result.maxScore}`}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': scorePercentage < 50 ? '#87d068' : scorePercentage < 75 ? '#faad14' : '#f5222d',
                }}
                width={180}
              />
              <div className="mt-4 text-center">
                <Tag color={getRiskLevelColor(result.riskLevel)} className="px-4 py-1 text-base">
                  Mức độ rủi ro: {getRiskLevelText(result.riskLevel)}
                </Tag>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Title level={4} className="text-primary mb-2">
                Phân tích tổng quan
              </Title>
              <Paragraph>{result.detailedAnalysis}</Paragraph>
            </div>
          </div>

          <Divider orientation="left">Từ khóa liên quan</Divider>
          <div className="mb-6">
            <Paragraph className="text-gray-600 mb-2">
              Dựa trên kết quả khảo sát của bạn, những từ khóa sau đây có thể giúp bạn tìm kiếm các chương trình hỗ trợ phù hợp:
            </Paragraph>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((keyword, index) => (
                <Tag 
                  key={index} 
                  color="blue" 
                  className="px-3 py-1 text-base cursor-pointer hover:opacity-80"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </Tag>
              ))}
            </div>
          </div>

          <Divider orientation="left">Khuyến nghị</Divider>
          <div className="bg-blue-50 p-4 rounded-lg mb-8 border-l-4 border-blue-500">
            <Paragraph className="text-gray-800">{result.recommendation}</Paragraph>
          </div>

          <Divider orientation="left">Chi tiết câu trả lời</Divider>
          <List
            itemLayout="horizontal"
            dataSource={result.responses}
            renderItem={(item, index) => (
              <List.Item className="border-b border-gray-100 py-4">
                <List.Item.Meta
                  title={
                    <div className="flex justify-between">
                      <Text strong>Câu {index + 1}: {item.questionText}</Text>
                      <Tag color={item.score > 2 ? "orange" : "green"}>Điểm: {item.score}</Tag>
                    </div>
                  }
                  description={
                    <div className="mt-2 bg-gray-50 p-2 rounded">
                      <Text>Câu trả lời: {item.answer}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />

          <Divider />

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <Title level={4} className="text-primary mb-2">
              Các bước tiếp theo
            </Title>
            <Timeline
              items={[
                {
                  color: 'blue',
                  children: 'Xem lại kết quả khảo sát và các khuyến nghị'
                },
                {
                  color: 'green',
                  children: (
                    <span>
                      Tìm kiếm chương trình hỗ trợ phù hợp sử dụng các từ khóa đề xuất như 
                      <Text strong className="mx-1">
                        {result.keywords.slice(0, 3).join(', ')}
                      </Text>
                    </span>
                  )
                },
                {
                  color: 'orange',
                  children: 'Đặt lịch hẹn với chuyên gia tâm lý nếu cần thiết'
                },
                {
                  color: 'gray',
                  children: 'Thực hiện khảo sát lại sau một thời gian để theo dõi tiến triển'
                },
              ]}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-6">
            <Button type="primary" size="large" onClick={handleBookAppointment}>
              Đặt lịch hẹn với chuyên gia
            </Button>
            <Button size="large" onClick={handleViewSupportPrograms}>
              Xem chương trình hỗ trợ
            </Button>
            <Button type="dashed" size="large" onClick={handleTakeSurveyAgain}>
              Làm lại khảo sát
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SurveyResultScreen;
