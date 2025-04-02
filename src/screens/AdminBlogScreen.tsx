import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Typography, 
  Tag, 
  Popconfirm, 
  Upload, 
  message 
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  EyeOutlined,
  UploadOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

const AdminBlogScreen: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Tìm Hiểu Về Lo Âu: Hướng Dẫn Toàn Diện",
      content: `Lo âu là một phần tự nhiên của cuộc sống, nhưng đôi khi nó có thể trở nên quá mức và ảnh hưởng đến chất lượng cuộc sống của chúng ta. Trong bài viết này, chúng ta sẽ tìm hiểu sâu về các khía cạnh khác nhau của lo âu và cách đối phó với nó.

      Các triệu chứng phổ biến của lo âu bao gồm:
      • Tim đập nhanh
      • Khó thở
      • Đổ mồ hôi
      • Cảm giác căng thẳng
      • Khó tập trung

      Các phương pháp đối phó hiệu quả:
      1. Thực hành hít thở sâu
      2. Thiền định đều đặn
      3. Tập thể dục thường xuyên
      4. Duy trì lịch trình ngủ đều đặn
      5. Tìm kiếm sự hỗ trợ chuyên môn khi cần thiết`,
      author: "TS. Sarah Johnson",
      date: "2024-02-20",
      category: "Sức Khỏe Tinh Thần",
      imageUrl: "https://source.unsplash.com/random/1200x600/?meditation",
      readTime: "5 phút đọc"
    },
    {
      id: 2,
      title: "Dinh Dưỡng Cho Sức Khỏe Tâm Thần",
      content: "Nội dung về mối liên hệ giữa dinh dưỡng và sức khỏe tâm thần...",
      author: "TS. John Smith",
      date: "2024-03-15",
      category: "Dinh Dưỡng",
      imageUrl: "https://source.unsplash.com/random/1200x600/?nutrition",
      readTime: "7 phút đọc"
    },
    {
      id: 3,
      title: "Kỹ Thuật Thư Giãn Cho Người Bận Rộn",
      content: "Các phương pháp thư giãn nhanh chóng và hiệu quả...",
      author: "ThS. Maria Garcia",
      date: "2024-04-05",
      category: "Thư Giãn",
      imageUrl: "https://source.unsplash.com/random/1200x600/?relaxation",
      readTime: "4 phút đọc"
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const [form] = Form.useForm();

  const categories = [
    "Sức Khỏe Tinh Thần", 
    "Dinh Dưỡng", 
    "Thư Giãn", 
    "Thiền Định", 
    "Tâm Lý Học"
  ];

  const showModal = (blog?: BlogPost) => {
    if (blog) {
      setCurrentBlog(blog);
      form.setFieldsValue(blog);
    } else {
      setCurrentBlog(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const showViewModal = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setIsViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
    message.success('Bài viết đã được xóa thành công');
  };

  const onFinish = (values: BlogPost) => {
    if (currentBlog) {
      // Update existing blog
      setBlogs(blogs.map(blog => 
        blog.id === currentBlog.id ? { ...values, id: currentBlog.id } : blog
      ));
      message.success('Bài viết đã được cập nhật thành công');
    } else {
      // Add new blog
      const newBlog = {
        ...values,
        id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
        date: new Date().toISOString().split('T')[0],
      };
      setBlogs([...blogs, newBlog]);
      message.success('Bài viết mới đã được tạo thành công');
    }
    setIsModalVisible(false);
    form.resetFields();
  };
  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} tải lên thành công`);
        // In a real app, you would get the URL from the response
        form.setFieldsValue({ imageUrl: `https://source.unsplash.com/random/1200x600/?${Math.random()}` });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
  };

  const columns: ColumnsType<BlogPost> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      width: 150,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Thời gian đọc',
      dataIndex: 'readTime',
      key: 'readTime',
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => showViewModal(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>Quản lý bài viết</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            Tạo bài viết mới
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={blogs} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />

        {/* Create/Edit Blog Modal */}
        <Modal
          title={currentBlog ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={currentBlog || {}}
          >
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
              <Input placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>

            <Form.Item
              name="author"
              label="Tác giả"
              rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
            >
              <Input placeholder="Nhập tên tác giả" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="readTime"
              label="Thời gian đọc"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian đọc!' }]}
            >
              <Input placeholder="Ví dụ: 5 phút đọc" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
            >
              <TextArea rows={10} placeholder="Nhập nội dung bài viết" />
            </Form.Item>

            <Form.Item
              name="imageUrl"
              label="Hình ảnh"
              rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
            >
              <Input placeholder="URL hình ảnh" />
            </Form.Item>

            <Form.Item>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item className="mb-0 flex justify-end">
              <Space>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  {currentBlog ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Blog Modal */}
        <Modal
          title="Chi tiết bài viết"
          open={isViewModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Đóng
            </Button>
          ]}
          width={800}
        >
          {currentBlog && (
            <div>
              <div className="mb-4">
                <img
                  src={currentBlog.imageUrl}
                  alt={currentBlog.title}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </div>
              
              <Tag color="blue" className="mb-2">
                {currentBlog.category}
              </Tag>
              
              <Title level={3}>{currentBlog.title}</Title>
              
              <div className="flex items-center gap-4 mb-4 text-gray-500">
                <Text>{currentBlog.author}</Text>
                <Text>|</Text>
                <Text>{currentBlog.date}</Text>
                <Text>|</Text>
                <Text>{currentBlog.readTime}</Text>
              </div>
              
              <div className="whitespace-pre-line">
                {currentBlog.content}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminBlogScreen;
