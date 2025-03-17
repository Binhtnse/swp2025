import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  Button, 
  Spin, 
  Alert, 
  Divider, 
  Tag, 
  Space, 
  Descriptions, 
  Modal,
  notification,
  Select
} from 'antd';
import { 
  ArrowLeftOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  HeartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

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
  imageUrl?: string;
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
  data: SupportProgram;
}

const SupportProgramDetailScreen: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<SupportProgram | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loadingChildren, setLoadingChildren] = useState<boolean>(false);

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
    const fetchProgramDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://14.225.207.207:8080/api/support-program/get-detail-support-program?supportProgramId=${programId}`
        );
        setProgram(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching program details:', err);
        setError('Failed to fetch program details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgramDetails();
    }
  }, [programId]);

  const fetchChildren = async () => {
    try {
      setLoadingChildren(true);
      const response = await axios.get('http://14.225.207.207:8080/api/user/get-student-of-parent');
      setChildren(response.data || []);
    } catch (err) {
      console.error('Error fetching children:', err);
      notification.error({
        message: 'Error',
        description: 'Không thể tải danh sách học sinh. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
    } finally {
      setLoadingChildren(false);
    }
  };

  // Helper function to get default image based on category
  const getDefaultImage = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Mental Health': 'https://via.placeholder.com/800x400?text=Mental+Health',
      'Education': 'https://via.placeholder.com/800x400?text=Education',
      // Add more mappings as needed
    };
    
    return categoryMap[category] || 'https://via.placeholder.com/800x400?text=Support+Program';
  };

  const handleRegister = async () => {
    if (userRole === 'PARENT') {
      // For parent, fetch children and show modal
      fetchChildren();
      setIsModalOpen(true);
    } else {
      // For student, show confirmation modal
      setIsModalOpen(true);
    }
  };

  const confirmRegistration = async () => {
    try {
      setRegistering(true);
      
      let url = '';
      if (userRole === 'PARENT' && selectedChildId) {
        // Parent registering a child
        url = `http://14.225.207.207:8080/api/program-registration/register-form-parent?programId=${programId}&studentId=${selectedChildId}`;
      } else {
        // Student registering themselves
        url = `http://14.225.207.207:8080/api/program-registration/register-student?programId=${programId}`;
      }
      
      const response = await axios.post<ApiResponse>(url);
      
      if (response.data.status.code === 1000) {
        notification.success({
          message: 'Registration Successful',
          description: `You have successfully registered for ${program?.title}`,
          placement: 'topRight',
        });
        
        setIsModalOpen(false);
        
        // Navigate back to home screen after successful registration
        navigate('/');
      } else {
        notification.error({
          message: 'Registration Failed',
          description: response.data.status.message || 'Failed to register for the program.',
          placement: 'topRight',
        });
      }
      
    } catch (err: Error | unknown) {
      console.error('Error registering for program:', err);
      notification.error({
        message: 'Registration Failed',
        description: err instanceof Error && 'response' in err ? ((err as { response: { data: { status: { message: string } } } }).response.data.status.message) : 'Failed to register for the program. Please try again later.',
        placement: 'topRight',
      });
    } finally {
      setRegistering(false);
    }
  };  
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedChildId(null);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading program details..." />
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
          action={
            <Button size="small" type="primary" onClick={goBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-6">
        <Alert
          message="Program Not Found"
          description="The support program you're looking for doesn't exist."
          type="warning"
          showIcon
          action={
            <Button size="small" type="primary" onClick={goBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  // Check if user is already registered
  const isUserRegistered = program.registrations && program.registrations.some(reg => reg.status === "REGISTERED");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={goBack}
        className="mb-4"
      >
        Back to Programs
      </Button>
      
      <Card className="shadow-md">
        <div className="mb-6">
          <img
            alt={program.title}
            src={program.imageUrl || getDefaultImage(program.category)}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <Title level={2}>{program.title}</Title>
          <Space>
            <Tag color="blue" icon={<ClockCircleOutlined />}>
              {program.updatedAt ? program.updatedAt : 'N/A'}
            </Tag>
            <Tag color="purple">
              {program.category}
            </Tag>
          </Space>
        </div>
        
        <Divider />
        
        <Descriptions title="Program Details" bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Category">{program.category}</Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {program.updatedAt ? program.updatedAt : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Participants">
            <Tag color="green" icon={<UserOutlined />}>
              {program.registrations?.length || 0} participants
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {isUserRegistered ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                You are registered
              </Tag>
            ) : (
              <Tag color="default">Not registered</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
        
        <Divider orientation="left">Description</Divider>
        
        <Paragraph className="text-lg mb-8">
          {program.description}
        </Paragraph>
        
        <Divider />
        
        <div className="flex justify-center">
          <Button 
            type="primary" 
            size="large"
            icon={isUserRegistered ? <CheckCircleOutlined /> : <HeartOutlined />}
            className={`px-8 ${isUserRegistered ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={handleRegister}
            disabled={isUserRegistered}
            loading={registering && !isModalOpen}
          >
            {isUserRegistered ? 'Already Registered' : 'Register for this Program'}
          </Button>
        </div>
      </Card>

      {/* Modal for registration confirmation */}
      <Modal
        title={userRole === 'PARENT' ? "Chọn học sinh đăng ký" : "Confirm Registration"}
        open={isModalOpen}
        onOk={confirmRegistration}
        onCancel={handleCancel}
        confirmLoading={registering}
        okText={userRole === 'PARENT' ? "Đăng ký cho học sinh" : "Confirm Registration"}
        cancelText="Cancel"
        okButtonProps={{ 
          disabled: userRole === 'PARENT' && !selectedChildId 
        }}
      >
        {userRole === 'PARENT' ? (
          <>
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
          </>
        ) : (
          <>
            <p>Are you sure you want to register for "{program.title}"?</p>
            <p>By registering, you agree to participate in this mental health support program.</p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SupportProgramDetailScreen;
