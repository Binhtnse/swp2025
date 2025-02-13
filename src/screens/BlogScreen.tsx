import React from 'react';
import { Card, Row, Col, Tag, Typography, Space } from 'antd';
import { HeartOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Tìm Hiểu Về Lo Âu: Hướng Dẫn Toàn Diện",
    excerpt: "Tìm hiểu về các loại rối loạn lo âu khác nhau và các cơ chế đối phó hiệu quả...",
    author: "TS. Sarah Johnson",
    date: "2024-02-20",
    category: "Sức Khỏe Tinh Thần",
    imageUrl: "https://source.unsplash.com/random/800x600/?meditation",
    readTime: "5 phút đọc"
  },
  {
    id: 2,
    title: "Thực Hành Chánh Niệm Trong Cuộc Sống Hàng Ngày",
    excerpt: "Khám phá các kỹ thuật chánh niệm đơn giản bạn có thể áp dụng vào thói quen hàng ngày...",
    author: "Mark Williams",
    date: "2024-02-19",
    category: "Chánh Niệm",
    imageUrl: "https://source.unsplash.com/random/800x600/?mindfulness",
    readTime: "4 phút đọc"
  },
];

const BlogScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Title level={1} className="text-center mb-12">
          Blog Sức Khỏe Tinh Thần & Tâm Lý
        </Title>
        
        <Row gutter={[24, 24]}>
          {blogPosts.map((post) => (
            <Col xs={24} sm={24} md={12} lg={8} key={post.id}>
              <Card
                hoverable
                className="h-full"
                cover={
                  <img
                    alt={post.title}
                    src={post.imageUrl}
                    className="h-48 object-cover"
                  />
                }
              >
                <Tag color="blue" className="mb-3">
                  {post.category}
                </Tag>
                <Title level={4} className="mb-2">
                  {post.title}
                </Title>
                <Paragraph className="text-gray-600 mb-4" ellipsis={{ rows: 2 }}>
                  {post.excerpt}
                </Paragraph>
                
                <div className="flex justify-between items-center">
                  <Space size="small" className="text-gray-500">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </Space>
                  
                  <Space size="middle">
                    <HeartOutlined className="text-gray-500 hover:text-red-500 cursor-pointer" />
                    <CommentOutlined className="text-gray-500 hover:text-blue-500 cursor-pointer" />
                    <ShareAltOutlined className="text-gray-500 hover:text-green-500 cursor-pointer" />
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BlogScreen;
