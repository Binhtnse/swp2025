import React, { useEffect, useState } from 'react';
import { Table, Typography, Card, Empty, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

const { Title } = Typography;

interface SurveyHistoryItem {
  id: number;
  score: number;
  completedAt: string;
  createdAt: string | null;
  updatedAt: string;
}

const ParentSurveyHistoryScreen: React.FC = () => {
  const [surveyHistory, setSurveyHistory] = useState<SurveyHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSurveyHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://14.225.207.207:8080/api/survey/get-history-survey-from-parent');
        setSurveyHistory(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử khảo sát:', error);
        message.error('Không thể tải lịch sử khảo sát. Vui lòng thử lại sau.');
      } finally {
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
          Lịch sử khảo sát của phụ huynh
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

export default ParentSurveyHistoryScreen;
