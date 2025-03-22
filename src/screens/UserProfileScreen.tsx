import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Descriptions, Spin, message, Button, Modal, Form, Input, DatePicker, Select, Upload } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { UploadProps } from 'antd';
import type { Moment } from 'moment';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  imageUrl: string | null;
  dateOfBirth: string;
  gender: string;
  address: string;
}

interface UserFormValues {
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  imageUrl: string | null;
  dateOfBirth: Moment;
  gender: string;
  address: string;
}

const { Title, Text } = Typography;
const { Option } = Select;

const UserProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Mock data instead of API call
        const mockUser: User = {
          id: 1,
          fullName: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          role: "STUDENT",
          phoneNumber: "0912345678",
          imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
          dateOfBirth: "2000-01-15",
          gender: "MALE",
          address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
        };
        
        // Simulate network delay
        setTimeout(() => {
          setUser(mockUser);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        message.error('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dateOfBirth: moment(user.dateOfBirth),
      });
      setEditModalVisible(true);
    }
  };

  const handleSave = async (values: UserFormValues) => {
    try {
      setLoading(true);
      
      // Convert moment object to string for dateOfBirth
      const updatedUser: User = {
        ...user!,
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        phoneNumber: values.phoneNumber,
        imageUrl: values.imageUrl,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
        gender: values.gender,
        address: values.address
      };
      
      // In a real app, you would make an API call here
      console.log('Saving user data:', updatedUser);
      
      // Update local state
      setUser(updatedUser);
      
      message.success('Thông tin cá nhân đã được cập nhật thành công!');
      setEditModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      message.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} tải lên thành công`);
        // In a real app, you would update the imageUrl here
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
  };

  const renderGender = (gender: string) => {
    switch (gender) {
      case 'MALE':
        return 'Nam';
      case 'FEMALE':
        return 'Nữ';
      default:
        return 'Khác';
    }
  };

  const renderRole = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'Học sinh';
      case 'PARENT':
        return 'Phụ huynh';
      case 'COUNSELOR':
        return 'Tư vấn viên';
      case 'ADMIN':
        return 'Quản trị viên';
      default:
        return role;
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 flex flex-col items-center p-6 border-r border-gray-200">
            <Avatar 
              size={150} 
              src={user?.imageUrl} 
              icon={!user?.imageUrl && <UserOutlined />}
              className="mb-4"
            />
            <Title level={3} className="mb-1">{user?.fullName}</Title>
            <Text type="secondary" className="mb-4">{renderRole(user?.role || '')}</Text>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEdit}
              className="mt-4"
            >
              Chỉnh sửa thông tin
            </Button>
          </div>
          
          <div className="md:w-2/3 p-6">
            <Title level={4} className="mb-4">Thông tin cá nhân</Title>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} className="bg-white rounded">
              <Descriptions.Item label="Họ và tên" span={2}>{user?.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>{user?.email}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">{renderRole(user?.role || '')}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{user?.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{moment(user?.dateOfBirth).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{renderGender(user?.gender || '')}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{user?.address}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>

      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={user ? {
            ...user,
            dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : undefined,
          } : {}}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input disabled />
            </Form.Item>
            
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Select>
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
                <Option value="OTHER">Khác</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="role"
              label="Vai trò"
            >
              <Input disabled />
            </Form.Item>
            
            <Form.Item
              name="address"
              label="Địa chỉ"
              className="col-span-1 md:col-span-2"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            
            <Form.Item
              name="imageUrl"
              label="Ảnh đại diện"
              className="col-span-1 md:col-span-2"
            >
              <Upload {...uploadProps} listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Form.Item>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setEditModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfileScreen;

