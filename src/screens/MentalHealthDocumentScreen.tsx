import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Spin, Empty, message, Input, Pagination, Space, Tag } from 'antd';
import { SearchOutlined, DownloadOutlined, FileTextOutlined, EyeOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Document {
  id: number;
  title: string;
  description: string;
  filePath: string;
  uploadedAt: string;
  updatedAt: string;
  createdAt: null;
  imageUrl: string;
  content: string;
  category: 1 | 2; // 1: normal, 2: hot doc
}

const DocumentScreen: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const filtered = documents.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [searchTerm, documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Placeholder data instead of API call
      const placeholderData: Document[] = [
        {
          id: 1,
          title: "Anxiety Management Guide",
          description: "A comprehensive guide to managing anxiety symptoms with practical exercises and techniques.",
          filePath: "/documents/anxiety-guide.pdf",
          uploadedAt: "2023-10-15T08:30:00Z",
          updatedAt: "2023-11-20T14:45:00Z",
          createdAt: null,
          imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=2070",
          content: "This guide provides detailed information about anxiety management techniques including deep breathing, progressive muscle relaxation, and cognitive restructuring.",
          category: 2 // hot document
        },
        {
          id: 2,
          title: "Depression Self-Care Workbook",
          description: "Interactive workbook with exercises to help manage depression symptoms and improve daily functioning.",
          filePath: "/documents/depression-workbook.pdf",
          uploadedAt: "2023-09-05T10:15:00Z",
          updatedAt: "2023-10-30T09:20:00Z",
          createdAt: null,
          imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076",
          content: "This workbook contains journaling prompts, mood tracking tools, and cognitive behavioral therapy exercises designed for those experiencing depression.",
          category: 1 // normal document
        }
      ];
      
      // Simulate network delay
      setTimeout(() => {
        setDocuments(placeholderData);
        setFilteredDocuments(placeholderData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching documents:', error);
      message.error('Failed to load documents. Please try again later.');
      setLoading(false);
    }
  };

  const handleDownload = (_filePath: string, title: string) => {
    // Simulate download
    message.success(`Downloaded ${title} successfully!`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleView = (_filePath: string) => {
    // Simulate view
    message.info('Opening document in new tab (simulated)');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <Title level={2} className="text-primary mb-2">
            Mental Health Resources
          </Title>
          <Paragraph className="text-gray-600 max-w-2xl mx-auto">
            Access our collection of mental health documents, guides, and resources to support your wellbeing journey.
          </Paragraph>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search documents by title or description"
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md w-full"
            size="large"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Empty 
            description="No documents found" 
            className="my-12"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDocuments.map((doc) => (
                <Card 
                  key={doc.id}
                  hoverable
                  className="h-full flex flex-col"
                  cover={
                    <div className="h-40 bg-blue-50 flex items-center justify-center relative overflow-hidden">
                      {doc.imageUrl ? (
                        <img 
                          src={doc.imageUrl} 
                          alt={doc.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                      )}
                      {doc.category === 2 && (
                        <div className="absolute top-2 right-2">
                          <Tag color="red" icon={<FireOutlined />}>Hot</Tag>
                        </div>
                      )}
                    </div>
                  }
                >
                  <div className="flex-grow">
                    <Title level={4} className="mb-2">
                      {doc.title}
                      {doc.category === 2 && (
                        <FireOutlined style={{ color: 'red', marginLeft: '8px' }} />
                      )}
                    </Title>
                    <Paragraph 
                      ellipsis={{ rows: 3 }}
                      className="text-gray-600 mb-4"
                    >
                      {doc.description}
                    </Paragraph>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                      <Text>Updated: {formatDate(doc.updatedAt)}</Text>
                    </div>
                    <Space direction="vertical" className="w-full">
                      <Button 
                        type="primary" 
                        icon={<EyeOutlined />}
                        onClick={() => handleView(doc.filePath)}
                        block
                      >
                        View Document
                      </Button>
                      <Button 
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(doc.filePath, doc.title)}
                        block
                      >
                        Download
                      </Button>
                    </Space>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredDocuments.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentScreen;
