import React from 'react';
import { Card, Input, Select, Row, Col, Rate, Button, Avatar } from 'antd';
import { SearchOutlined} from '@ant-design/icons';

const { Search } = Input;

const PsychologistListScreen: React.FC = () => {
  const psychologists = [
    {
      id: 1,
      name: 'TS. Nguyễn Văn An',
      specialization: 'Tâm lý học Lâm sàng',
      experience: '10 năm kinh nghiệm',
      rating: 4.8,
      image: 'https://placeholder.com/150',
      availability: 'Đang rảnh',
    },
    {
      id: 2,
      name: 'ThS. Trần Thị Bình',
      specialization: 'Tư vấn Tâm lý Học đường',
      experience: '8 năm kinh nghiệm',
      rating: 4.5,
      image: 'https://placeholder.com/150',
      availability: 'Bận',
    },
    // Add more psychologists as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Đội ngũ Chuyên gia Tâm lý
      </h1>

      <div className="mb-8 flex flex-wrap gap-4">
        <Search
          placeholder="Tìm kiếm chuyên gia..."
          className="max-w-md"
          prefix={<SearchOutlined />}
        />
        <Select
          defaultValue="all"
          className="w-48"
          options={[
            { value: 'all', label: 'Tất cả chuyên môn' },
            { value: 'clinical', label: 'Tâm lý Lâm sàng' },
            { value: 'school', label: 'Tâm lý Học đường' },
          ]}
        />
      </div>

      <Row gutter={[16, 16]}>
        {psychologists.map((psych) => (
          <Col xs={24} sm={12} lg={8} key={psych.id}>
            <Card hoverable className="h-full">
              <div className="flex flex-col items-center">
                <Avatar size={100} src={psych.image} />
                <h2 className="text-xl font-semibold mt-4 text-center">
                  {psych.name}
                </h2>
                <p className="text-gray-600">{psych.specialization}</p>
                <p className="text-sm text-gray-500">{psych.experience}</p>
                <Rate disabled defaultValue={psych.rating} className="my-2" />
                <p className="text-sm">
                  Đánh giá: {psych.rating}/5 ({Math.floor(Math.random() * 100)} đánh giá)
                </p>
                <div className="mt-4 space-y-2 w-full">
                  <Button type="primary" block className="bg-blue-500">
                    Đặt lịch tư vấn
                  </Button>
                  <Button block>Xem hồ sơ chi tiết</Button>
                </div>
                <span className={`mt-2 px-3 py-1 rounded-full text-sm ${
                  psych.availability === 'Đang rảnh' 
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {psych.availability}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PsychologistListScreen;
