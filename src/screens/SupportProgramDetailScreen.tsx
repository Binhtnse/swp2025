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
  notification
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

const SupportProgramDetailScreen: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<SupportProgram | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    setIsModalOpen(true);
  };

  const confirmRegistration = async () => {
    try {
      setRegistering(true);
      // This would be replaced with your actual registration API endpoint
      // await axios.post('http://14.225.207.207:8080/api/support-program/register', {
      //   supportProgramId: id
      // });
      
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success({
        message: 'Registration Successful',
        description: `You have successfully registered for ${program?.title}`,
        placement: 'topRight',
      });
      
      setIsModalOpen(false);
      
      // Refresh program details to show updated registration status
      const response = await axios.get(
        `http://14.225.207.207:8080/api/support-program/get-detail-support-program?supportProgramId=${programId}`
      );
      setProgram(response.data);
      
    } catch (err) {
      console.error('Error registering for program:', err);
      notification.error({
        message: 'Registration Failed',
        description: 'Failed to register for the program. Please try again later.',
        placement: 'topRight',
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
          >
            {isUserRegistered ? 'Already Registered' : 'Register for this Program'}
          </Button>
        </div>
      </Card>

      <Modal
        title="Confirm Registration"
        open={isModalOpen}
        onOk={confirmRegistration}
        onCancel={handleCancel}
        confirmLoading={registering}
        okText="Confirm Registration"
        cancelText="Cancel"
      >
        <p>Are you sure you want to register for "{program.title}"?</p>
        <p>By registering, you agree to participate in this mental health support program.</p>
      </Modal>
    </div>
  );
};

export default SupportProgramDetailScreen;
