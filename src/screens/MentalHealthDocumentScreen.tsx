import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Spin, Empty, message, Input, Pagination, Space } from 'antd';
import { SearchOutlined, DownloadOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

interface Document {
  id: number;
  title: string;
  description: string;
  filePath: string;
  uploadedAt: string;
  updatedAt: string;
  createdAt: null;
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
      const response = await axios.get('http://14.225.207.207:8080/api/resources/get-all-resource');
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      message.error('Failed to load documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filePath: string, title: string) => {
    const baseUrl = 'http://14.225.207.207:8080';
    const fullUrl = `${baseUrl}${filePath}`;
    
    message.info(`Downloading ${title}...`);
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (filePath: string) => {
    const baseUrl = 'http://14.225.207.207:8080';
    const fullUrl = `${baseUrl}${filePath}`;
    
    // Open the document in a new window
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return dateString;
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
                    <div className="h-40 bg-blue-50 flex items-center justify-center">
                      <FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                    </div>
                  }
                >
                  <div className="flex-grow">
                    <Title level={4} className="mb-2">{doc.title}</Title>
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
