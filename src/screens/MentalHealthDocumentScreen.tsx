import React, { useState } from 'react';
import { Card, Typography, Input, Tag, List, Space } from 'antd';
import { SearchOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  tags: string[];
}

const MentalHealthDocumentScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documents: Document[] = [
    {
      id: '1',
      title: 'Tìm Hiểu Về Rối Loạn Lo Âu',
      category: 'Kiến Thức Cơ Bản',
      description: 'Hướng dẫn toàn diện về việc hiểu và kiểm soát rối loạn lo âu.',
      date: '2024-01-15',
      tags: ['lo âu', 'sức khỏe tâm thần', 'tự giúp đỡ']
    },
    {
      id: '2',
      title: 'Trầm Cảm: Dấu Hiệu và Điều Trị',
      category: 'Tài Liệu Lâm Sàng',
      description: 'Tìm hiểu về các triệu chứng trầm cảm và các phương pháp điều trị khác nhau.',
      date: '2024-01-20',
      tags: ['trầm cảm', 'điều trị', 'liệu pháp']
    },
    {
      id: '3',
      title: 'Kỹ Thuật Thực Hành Chánh Niệm',
      category: 'Sức Khỏe Tinh Thần',
      description: 'Các bài tập thực hành chánh niệm để duy trì sức khỏe tâm thần hàng ngày.',
      date: '2024-01-25',
      tags: ['chánh niệm', 'thiền', 'sức khỏe']
    }
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <Title level={2} className="text-center mb-2">
          Thư Viện Tài Liệu Sức Khỏe Tâm Thần
        </Title>
        <Paragraph className="text-center text-gray-600">
          Truy cập tài liệu và tài nguyên sức khỏe tâm thần toàn diện
        </Paragraph>
      </div>

      <div className="mb-6">
        <Input
          size="large"
          placeholder="Tìm kiếm tài liệu..."
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl mx-auto block"
        />
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
        dataSource={filteredDocuments}
        renderItem={(doc) => (
          <List.Item>
            <Card
              hoverable
              className="h-full"
              actions={[
                <Space key="view" className="px-4 py-2">
                  <FileTextOutlined /> Xem Tài Liệu
                </Space>
              ]}
            >
              <div className="mb-4">
                <Tag color="blue" icon={<BookOutlined />} className="mb-2">
                  {doc.category}
                </Tag>
                <Title level={4} className="mb-2">
                  {doc.title}
                </Title>
                <Paragraph className="text-gray-600">
                  {doc.description}
                </Paragraph>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {doc.tags.map((tag) => (
                    <Tag key={tag} color="green">
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className="text-gray-400 text-sm">
                  Ngày đăng: {doc.date}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MentalHealthDocumentScreen;
