import React, { useEffect, useState } from 'react';
import { Table, Typography, Card, Empty, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface SurveyHistoryItem {
  id: number;
  score: number;
  completedAt: string;
  createdAt: string | null;
  updatedAt: string;
}

const StudentSurveyHistoryScreen: React.FC = () => {
  const [surveyHistory, setSurveyHistory] = useState<SurveyHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSurveyHistory = async () => {
      try {
        setLoading(true);
        // Mock data instead of API call
        const mockSurveyHistory: SurveyHistoryItem[] = [
          {
            id: 1,
            score: 78,
            completedAt: '2023-11-20T14:30:00Z',
            createdAt: '2023-11-20T13:00:00Z',
            updatedAt: '2023-11-20T14:30:00Z'
          },
          {
            id: 2,
            score: 65,
            completedAt: '2023-10-15T09:45:00Z',
            createdAt: '2023-10-15T09:00:00Z',
            updatedAt: '2023-10-15T09:45:00Z'
          },
          {
            id: 3,
            score: 92,
            completedAt: '2023-09-10T16:20:00Z',
            createdAt: '2023-09-10T15:30:00Z',
            updatedAt: '2023-09-10T16:20:00Z'
          },
          {
            id: 4,
            score: 70,
            completedAt: '2023-08-05T11:10:00Z',
            createdAt: '2023-08-05T10:30:00Z',
            updatedAt: '2023-08-05T11:10:00Z'
          },
          {
            id: 5,
            score: 85,
            completedAt: '2023-07-20T13:25:00Z',
            createdAt: '2023-07-20T12:45:00Z',
            updatedAt: '2023-07-20T13:25:00Z'
          }
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setSurveyHistory(mockSurveyHistory);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử khảo sát:', error);
        message.error('Không thể tải lịch sử khảo sát. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchSurveyHistory();
  }, []);

  const columns: ColumnsType<SurveyHistoryItem> = [
    {
      title: 'Mã khảo sát',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      render: (score) => (
        <span className="font-medium">{score}</span>
      ),
    },
    {
      title: 'Thời gian hoàn thành',
      dataIndex: 'completedAt',
      key: 'completedAt',
      align: 'center',
      render: (date) => (
        <span>{date || 'Chưa hoàn thành'}</span>
      ),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-md">
        <Title level={2} className="text-center mb-6 text-blue-800">
          Lịch sử khảo sát của sinh viên
        </Title>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : surveyHistory.length > 0 ? (
          <Table
            columns={columns}
            dataSource={surveyHistory.map(item => ({ ...item, key: item.id }))}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `Tổng cộng ${total} khảo sát`,
            }}
            className="w-full"
            bordered
            rowClassName="hover:bg-blue-50"
          />
        ) : (
          <Empty
            description="Không có lịch sử khảo sát nào"
            className="py-12"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        <div className="mt-4 text-gray-500 text-sm">
          <p>* Lịch sử khảo sát hiển thị tất cả các bài khảo sát bạn đã hoàn thành.</p>
          <p>* Điểm số được tính dựa trên các câu trả lời của bạn trong mỗi bài khảo sát.</p>
        </div>
      </Card>
    </div>
  );
};

export default StudentSurveyHistoryScreen;
