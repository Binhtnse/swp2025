import React, { useEffect, useState } from 'react';
import { 
  Card, Typography, Button, Spin, Empty, message, Input, Pagination, Space, 
  Table, Modal, Form, Select, Upload, Popconfirm, Tag, Tooltip
} from 'antd';
import { 
  SearchOutlined, DownloadOutlined, FileTextOutlined, EyeOutlined, 
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, FireOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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

const AdminMentalHealthDocumentScreen: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [form] = Form.useForm();
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const pageSize = 10;

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
        },
        {
          id: 3,
          title: "Stress Reduction Techniques",
          description: "Learn effective methods to reduce stress in daily life and improve overall mental wellbeing.",
          filePath: "/documents/stress-reduction.pdf",
          uploadedAt: "2023-08-12T14:20:00Z",
          updatedAt: "2023-09-18T11:30:00Z",
          createdAt: null,
          imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070",
          content: "This document outlines various stress reduction techniques including mindfulness meditation, time management strategies, and healthy lifestyle choices.",
          category: 1
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

  const handleView = (_filePath: string) => {
    // Simulate view
    console.log(_filePath);
    message.info('Opening document in new tab (simulated)');
  };

  const handleAddDocument = () => {
    setIsEditMode(false);
    setCurrentDocument(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditDocument = (document: Document) => {
    setIsEditMode(true);
    setCurrentDocument(document);
    form.setFieldsValue({
      title: document.title,
      description: document.description,
      content: document.content,
      category: document.category,
    });
    setIsModalVisible(true);
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      // Simulate API call
      setLoading(true);
      // In a real app, you would make an API call here
      setTimeout(() => {
        const updatedDocuments = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocuments);
        setFilteredDocuments(updatedDocuments.filter(doc => 
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          doc.description.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        setLoading(false);
        message.success('Document deleted successfully');
      }, 500);
    } catch (error) {
      console.error('Error deleting document:', error);
      message.error('Failed to delete document');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEditMode && currentDocument) {
        // Update existing document
        const updatedDocument = {
          ...currentDocument,
          ...values,
          updatedAt: new Date().toISOString()
        };
        
        // Simulate API call
        setTimeout(() => {
          const updatedDocuments = documents.map(doc => 
            doc.id === currentDocument.id ? updatedDocument : doc
          );
          setDocuments(updatedDocuments);
          setFilteredDocuments(updatedDocuments.filter(doc => 
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            doc.description.toLowerCase().includes(searchTerm.toLowerCase())
          ));
          message.success('Document updated successfully');
          setIsModalVisible(false);
        }, 500);
      } else {
        // Create new document
        const newDocument: Document = {
          id: Math.max(...documents.map(d => d.id), 0) + 1,
          ...values,
          filePath: `/documents/document-${Date.now()}.pdf`,
          uploadedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdAt: null,
          imageUrl: values.imageUrl || "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?q=80&w=2070",
        };
        
        // Simulate API call
        setTimeout(() => {
          const updatedDocuments = [...documents, newDocument];
          setDocuments(updatedDocuments);
          setFilteredDocuments(updatedDocuments.filter(doc => 
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            doc.description.toLowerCase().includes(searchTerm.toLowerCase())
          ));
          message.success('Document added successfully');
          setIsModalVisible(false);
        }, 500);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
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

  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Document) => (
        <Space>
          {text}
          {record.category === 2 && (
            <Tag color="red" icon={<FireOutlined />}>Hot</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Document) => (
        <Space size="small">
          <Tooltip title="View">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record.filePath)}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              onClick={() => handleDownload(record.filePath, record.title)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditDocument(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this document?"
              description="Are you sure you want to delete this document? This action cannot be undone."
              onConfirm={() => handleDeleteDocument(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Title level={2} className="text-primary mb-0">
              Manage Mental Health Documents
            </Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddDocument}
              size="large"
            >
              Add Document
            </Button>
          </div>
          <Paragraph className="text-gray-600">
            Upload, edit, and manage mental health resources for users.
          </Paragraph>
        </div>

        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <Input
            placeholder="Search documents by title or description"
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
            size="large"
            style={{ width: '100%', maxWidth: '400px' }}
          />
          <Space>
            <Button 
              type={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
            >
              Table View
            </Button>
            <Button 
              type={viewMode === 'card' ? 'primary' : 'default'}
              onClick={() => setViewMode('card')}
            >
              Card View
            </Button>
          </Space>
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
        ) : viewMode === 'table' ? (
          <>
            <Table 
              dataSource={filteredDocuments}
              columns={columns}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredDocuments.length,
                onChange: setCurrentPage,
              }}
              className="bg-white rounded-lg shadow"
            />
          </>
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
                  actions={[
                    <Tooltip title="View" key="view">
                      <EyeOutlined onClick={() => handleView(doc.filePath)} />
                    </Tooltip>,
                    <Tooltip title="Edit" key="edit">
                      <EditOutlined onClick={() => handleEditDocument(doc)} />
                    </Tooltip>,
                    <Tooltip title="Download" key="download">
                      <DownloadOutlined onClick={() => handleDownload(doc.filePath, doc.title)} />
                    </Tooltip>,
                    <Popconfirm
                      key="delete"
                      title="Delete this document?"
                      description="Are you sure you want to delete this document? This action cannot be undone."
                      onConfirm={() => handleDeleteDocument(doc.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined />
                    </Popconfirm>
                  ]}
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
                    <div className="flex justify-between items-center text-gray-500 text-sm">
                      <Text>Uploaded: {formatDate(doc.uploadedAt)}</Text>
                      <Text>Updated: {formatDate(doc.updatedAt)}</Text>
                    </div>
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

      {/* Add/Edit Document Modal */}
      <Modal
        title={isEditMode ? "Edit Document" : "Add New Document"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={isEditMode ? "Update" : "Add"}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the document title' }]}
          >
            <Input placeholder="Enter document title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the document description' }]}
          >
            <TextArea 
              placeholder="Enter document description" 
              rows={3}
            />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter the document content' }]}
          >
            <TextArea 
              placeholder="Enter document content" 
              rows={5}
            />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select document category">
              <Option value={1}>Normal</Option>
              <Option value={2}>Hot Document</Option>
            </Select>
          </Form.Item>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="documentFile"
              label="Document File"
              rules={[{ required: !isEditMode, message: 'Please upload a document file' }]}
            >
              <Upload {...uploadProps} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload Document</Button>
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="imageFile"
              label="Cover Image"
            >
              <Upload 
                {...uploadProps} 
                listType="picture-card"
                maxCount={1}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMentalHealthDocumentScreen;