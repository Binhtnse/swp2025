import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Typography, Spin, Alert, Space, message, Modal, Select } from 'antd';
import { ClockCircleOutlined, UserOutlined, HeartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface Registration {
  createdAt: string | null;
  updatedAt: string;
  id: number;
  registeredAt: string;
  status: string;
  isDeleted: boolean;
}

interface SupportProgram {
  createdAt: string | null;
  updatedAt: string;
  id: number;
  title: string;
  category: string;
  description: string;
  isDeleted: boolean;
  registrations: Registration[];
  // These fields aren't in the API but we'll set default values for rendering
  imageUrl?: string;
  duration?: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse {
  status: {
    code: number;
    message: string;
  };
  data: unknown;
}

const SupportProgramScreens: React.FC = () => {
  const [supportPrograms, setSupportPrograms] = useState<SupportProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loadingChildren, setLoadingChildren] = useState<boolean>(false);
  const navigate = useNavigate();

  // Get user role from localStorage
  const getUserRole = (): string => {
    const userLogin = localStorage.getItem('userLogin');
    if (userLogin) {
      const userData = JSON.parse(userLogin);
      return userData.roleName || '';
    }
    return '';
  };

  const userRole = getUserRole();

  useEffect(() => {
    const fetchSupportPrograms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://14.225.207.207:8080/api/support-program/get-all-support-program');
        setSupportPrograms(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching support programs:', err);
        setError('Failed to fetch support programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupportPrograms();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoadingChildren(true);
      const response = await axios.get('http://14.225.207.207:8080/api/user/get-student-of-parent');
      setChildren(response.data || []);
    } catch (err) {
      console.error('Error fetching children:', err);
      message.error('Không thể tải danh sách học sinh. Vui lòng thử lại sau.');
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleProgramClick = async (programId: number) => {
    if (userRole === 'PARENT') {
      setSelectedProgramId(programId);
      setIsModalVisible(true);
      fetchChildren();
    } else {
      // Student role - proceed with direct registration
      registerForProgram(programId);
    }
  };

  const registerForProgram = async (programId: number, studentId?: number) => {
    try {
      setRegistering(true);
      
      let url = '';
      if (userRole === 'PARENT' && studentId) {
        url = `http://14.225.207.207:8080/api/program-registration/register-form-parent?programId=${programId}&studentId=${studentId}`;
      } else {
        url = `http://14.225.207.207:8080/api/program-registration/register-student?programId=${programId}`;
      }
      
      const response = await axios.post<ApiResponse>(url);
      
      if (response.data.status.code === 1000) {
        message.success('Đăng ký tham gia chương trình thành công!');
        // Navigate back to home screen after successful registration
        navigate('/');
      } else {
        message.error(`Đăng ký thất bại: ${response.data.status.message}`);
      }
    } catch (err: Error | unknown) {
      console.error('Error registering for program:', err);
      message.error(
        (err as { response?: { data?: { status?: { message: string } } } })?.response?.data?.status?.message || 
        'Đăng ký thất bại. Vui lòng thử lại sau.'
      );
    } finally {
      setRegistering(false);
      setIsModalVisible(false);
    }
  };

  const handleModalOk = () => {
    if (!selectedChildId) {
      message.error('Vui lòng chọn học sinh');
      return;
    }
    
    if (selectedProgramId) {
      registerForProgram(selectedProgramId, selectedChildId);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedProgramId(null);
    setSelectedChildId(null);
  };

  const handleViewDetails = (programId: number) => {
    navigate(`/support-programs/details/${programId}`);
  };

  // Helper function to get default image based on category
  const getDefaultImage = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Mental Health': 'https://via.placeholder.com/400x200?text=Mental+Health',
      'Education': 'https://via.placeholder.com/400x200?text=Education',
      // Add more mappings as needed
    };
    
    return categoryMap[category] || 'https://via.placeholder.com/400x200?text=Support+Program';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading support programs..." />
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-8">
        Chương Trình Hỗ Trợ Sức Khỏe Tinh Thần
      </Title>
      
      {supportPrograms.length === 0 ? (
        <div className="text-center p-8">
          <Alert 
            message="No Support Programs Available" 
            description="There are currently no support programs available." 
            type="info" 
            showIcon 
          />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {supportPrograms.map(program => (
            <Col key={program.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full"
                cover={
                  <img
                    alt={program.title}
                    src={program.imageUrl || getDefaultImage(program.category)}
                    className="h-48 object-cover"
                  />
                }
              >
                <Title level={4}>{program.title}</Title>
                <Paragraph className="text-gray-600 mb-4">
                  {program.description.length > 100 
                    ? `${program.description.substring(0, 100)}...` 
                    : program.description}
                </Paragraph>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag color="blue" icon={<ClockCircleOutlined />}>
                    {program.updatedAt ? new Date(program.updatedAt).toLocaleDateString() : 'N/A'}
                  </Tag>
                  <Tag color="green" icon={<UserOutlined />}>
                    {program.registrations?.length || 0} người tham gia
                  </Tag>
                  <Tag color="purple">
                    {program.category}
                  </Tag>
                </div>
                
                <Space direction="vertical" className="w-full">
                  <Button 
                    type="default"
                    icon={<InfoCircleOutlined />}
                    className="w-full"
                    onClick={() => handleViewDetails(program.id)}
                  >
                    Xem Chi Tiết
                  </Button>
                  
                  <Button 
                    type="primary" 
                    icon={<HeartOutlined />}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleProgramClick(program.id)}
                    loading={registering}
                  >
                    Đăng Ký Tham Gia
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for parent to select child */}
      <Modal
        title="Chọn học sinh đăng ký"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={registering}
      >
        <div className="mb-4">
          <p>Vui lòng chọn học sinh bạn muốn đăng ký tham gia chương trình:</p>
        </div>
        <Select
          placeholder="Chọn học sinh"
          style={{ width: '100%' }}
          onChange={(value) => setSelectedChildId(Number(value))}
          loading={loadingChildren}
        >
          {children.map(child => (
            <Option key={child.id} value={child.id}>{child.name}</Option>
          ))}
        </Select>
        {children.length === 0 && !loadingChildren && (
          <div className="mt-2 text-red-500">
            Không tìm thấy học sinh nào. Vui lòng liên hệ quản trị viên.
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportProgramScreens;
