import React from 'react';
import { Typography, Space, Tag, Avatar, Divider, Button } from 'antd';
import { HeartOutlined, CommentOutlined, ShareAltOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
//import { useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

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

const BlogDetailScreen: React.FC = () => {
  //const { id } = useParams();

  // Mock data - replace with actual API call
  const blogPost: BlogPost = {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <img
          src={blogPost.imageUrl}
          alt={blogPost.title}
          className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-8"
        />

        <div className="bg-white p-8 rounded-lg shadow-md">
          <Tag color="blue" className="mb-4">
            {blogPost.category}
          </Tag>

          <Title level={1} className="mb-6">
            {blogPost.title}
          </Title>

          <Space className="mb-6" size={16}>
            <Avatar icon={<UserOutlined />} />
            <span className="text-gray-600">{blogPost.author}</span>
            <Divider type="vertical" />
            <Space>
              <ClockCircleOutlined />
              <span className="text-gray-600">{blogPost.readTime}</span>
            </Space>
            <Divider type="vertical" />
            <span className="text-gray-600">{blogPost.date}</span>
          </Space>

          <Divider />

          <Paragraph className="text-lg leading-relaxed whitespace-pre-line">
            {blogPost.content}
          </Paragraph>

          <Divider />

          <div className="flex justify-between items-center mt-8">
            <Space size="large">
              <Button type="text" icon={<HeartOutlined />}>
                Thích
              </Button>
              <Button type="text" icon={<CommentOutlined />}>
                Bình luận
              </Button>
              <Button type="text" icon={<ShareAltOutlined />}>
                Chia sẻ
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailScreen;
