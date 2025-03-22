import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Row, Col, Rate, Button, Avatar, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

interface Psychologist {
  id: number;
  fullName: string;
  email: string;
  role: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  imageUrl: string;
  address: string;
}

const PsychologistListScreen: React.FC = () => {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [,setSpecialization] = useState<string>('all');

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        // Mock data instead of API call
        const mockPsychologists: Psychologist[] = [
          {
            id: 1,
            fullName: "Nguyễn Thị Minh",
            email: "minh@example.com",
            role: "PSYCHOLOGIST",
            dateOfBirth: "1985-05-15",
            gender: "Female",
            phoneNumber: "0912345678",
            imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
            address: "Hà Nội"
          },
          {
            id: 2,
            fullName: "Trần Văn Hùng",
            email: "hung@example.com",
            role: "PSYCHOLOGIST",
            dateOfBirth: "1980-08-20",
            gender: "Male",
            phoneNumber: "0923456789",
            imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
            address: "Hồ Chí Minh"
          },
          {
            id: 3,
            fullName: "Lê Thị Hương",
            email: "huong@example.com",
            role: "PSYCHOLOGIST",
            dateOfBirth: "1988-03-10",
            gender: "Female",
            phoneNumber: "0934567890",
            imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
            address: "Đà Nẵng"
          },
          {
            id: 4,
            fullName: "Phạm Minh Tuấn",
            email: "tuan@example.com",
            role: "PSYCHOLOGIST",
            dateOfBirth: "1982-11-25",
            gender: "Male",
            phoneNumber: "0945678901",
            imageUrl: "https://randomuser.me/api/portraits/men/4.jpg",
            address: "Hải Phòng"
          },
          {
            id: 5,
            fullName: "Hoàng Thị Lan",
            email: "lan@example.com",
            role: "PSYCHOLOGIST",
            dateOfBirth: "1990-07-18",
            gender: "Female",
            phoneNumber: "0956789012",
            imageUrl: "https://randomuser.me/api/portraits/women/5.jpg",
            address: "Cần Thơ"
          },
          {
            id: 6,
            fullName: "Vũ Đức Thành",
            email: "thanh@example.com",
            role: "PSYCHOLOGIST",
            dateOfBirth: "1978-09-30",
            gender: "Male",
            phoneNumber: "0967890123",
            imageUrl: "https://randomuser.me/api/portraits/men/6.jpg",
            address: "Huế"
          }
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setPsychologists(mockPsychologists);
          setError(null);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching psychologists:', err);
        setError('Failed to fetch psychologists. Please try again later.');
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  // Function to generate a random rating for demonstration purposes
  // In a real app, this would come from the API
  const getRandomRating = (min = 4.0, max = 5.0) => {
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  };

  // Function to filter psychologists based on search term
  const filteredPsychologists = psychologists.filter(psych => 
    psych.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading psychologists..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          defaultValue="all"
          className="w-48"
          onChange={(value) => setSpecialization(value)}
          options={[
            { value: 'all', label: 'Tất cả chuyên môn' },
            { value: 'clinical', label: 'Tâm lý Lâm sàng' },
            { value: 'school', label: 'Tâm lý Học đường' },
          ]}
        />
      </div>

      <Row gutter={[16, 16]}>
        {filteredPsychologists.map((psych) => {
          const rating = getRandomRating();
          return (
            <Col xs={24} sm={12} lg={8} key={psych.id}>
              <Card hoverable className="h-full">
                <div className="flex flex-col items-center">
                  <Avatar size={100} src={psych.imageUrl || "https://placeholder.com/150"} />
                  <h2 className="text-xl font-semibold mt-4 text-center">
                    {psych.fullName}
                  </h2>
                  <p className="text-gray-600">Tâm lý {psych.gender === 'Male' ? 'Nam' : 'Nữ'}</p>
                  <p className="text-sm text-gray-500">{Math.floor(Math.random() * 10 + 5)} năm kinh nghiệm</p>
                  <Rate disabled defaultValue={rating} className="my-2" />
                  <p className="text-sm">
                    Đánh giá: {rating}/5 ({Math.floor(Math.random() * 100)} đánh giá)
                  </p>
                  <div className="mt-4 space-y-2 w-full">
                    <Button type="primary" block className="bg-blue-500">
                      Đặt lịch tư vấn
                    </Button>
                    <Button block>Xem hồ sơ chi tiết</Button>
                  </div>
                  <span className={`mt-2 px-3 py-1 rounded-full text-sm ${
                    Math.random() > 0.5 
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {Math.random() > 0.5 ? 'Đang rảnh' : 'Bận'}
                  </span>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredPsychologists.length === 0 && (
        <div className="text-center p-8">
          <Alert 
            message="Không tìm thấy chuyên gia"
            description="Không có chuyên gia tâm lý nào phù hợp với tiêu chí tìm kiếm của bạn."
            type="info"
            showIcon
          />
        </div>
      )}
    </div>
  );
};

export default PsychologistListScreen;
