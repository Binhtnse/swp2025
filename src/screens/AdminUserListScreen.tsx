import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message, 
  Popconfirm, 
  Typography, 
  Card, 
  Tag, 
  Avatar, 
  Upload,
  Tooltip,
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import type { UploadProps } from 'antd';
import type { Moment } from 'moment';

const { Title } = Typography;
const { Option } = Select;

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

const AdminUserListScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('Thêm người dùng mới');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock data instead of API call
      const mockUsers: User[] = [
        {
          id: 1,
          fullName: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          role: "STUDENT",
          phoneNumber: "0912345678",
          imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
          dateOfBirth: "2000-01-15",
          gender: "MALE",
          address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
        },
        {
          id: 2,
          fullName: "Trần Thị B",
          email: "tranthib@example.com",
          role: "PARENT",
          phoneNumber: "0923456789",
          imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
          dateOfBirth: "1985-05-20",
          gender: "FEMALE",
          address: "456 Lê Lợi, Quận 3, TP. Hồ Chí Minh"
        },
        {
          id: 3,
          fullName: "Lê Văn C",
          email: "levanc@example.com",
          role: "COUNSELOR",
          phoneNumber: "0934567890",
          imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
          dateOfBirth: "1990-10-10",
          gender: "MALE",
          address: "789 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh"
        },
        {
          id: 4,
          fullName: "Phạm Thị D",
          email: "phamthid@example.com",
          role: "ADMIN",
          phoneNumber: "0945678901",
          imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
          dateOfBirth: "1988-12-25",
          gender: "FEMALE",
          address: "101 Võ Văn Tần, Quận 10, TP. Hồ Chí Minh"
        }
      ];
      
      // Simulate network delay
      setTimeout(() => {
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      message.error('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setModalTitle('Thêm người dùng mới');
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setModalTitle('Chỉnh sửa thông tin người dùng');
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      dateOfBirth: moment(user.dateOfBirth),
    });
    setModalVisible(true);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setViewModalVisible(true);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      setLoading(true);
      // In a real app, you would make an API call here
      console.log('Deleting user with ID:', userId);
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      
      message.success('Người dùng đã được xóa thành công!');
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      message.error('Không thể xóa người dùng. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleSaveUser = async (values: UserFormValues) => {
    try {
      setLoading(true);
      
      // Convert moment object to string for dateOfBirth
      const userData = {
        ...values,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
      };
      
      if (editingUser) {
        // Update existing user
        const updatedUser: User = {
          ...editingUser,
          ...userData,
        };
        
        // In a real app, you would make an API call here
        console.log('Updating user:', updatedUser);
        
        // Update local state
        setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
        message.success('Thông tin người dùng đã được cập nhật thành công!');
      } else {
        // Add new user
        const newUser: User = {
          id: Math.max(...users.map(user => user.id), 0) + 1,
          ...userData,
        };
        
        // In a real app, you would make an API call here
        console.log('Adding new user:', newUser);
        
        // Update local state
        setUsers([...users, newUser]);
        message.success('Người dùng mới đã được thêm thành công!');
      }
      
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lưu thông tin người dùng:', error);
      message.error('Không thể lưu thông tin người dùng. Vui lòng thử lại sau.');
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
        return <Tag color="blue">Học sinh</Tag>;
      case 'PARENT':
        return <Tag color="green">Phụ huynh</Tag>;
      case 'COUNSELOR':
        return <Tag color="purple">Tư vấn viên</Tag>;
      case 'ADMIN':
        return <Tag color="red">Quản trị viên</Tag>;
      default:
        return <Tag>{role}</Tag>;
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.phoneNumber.includes(searchText)
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Người dùng',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_: string, record: User) => (
        <div className="flex items-center">
          <Avatar 
            src={record.imageUrl} 
            icon={!record.imageUrl && <UserOutlined />}
            className="mr-2"
          />
          <div>
            <div className="font-medium">{record.fullName}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => renderRole(role),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => renderGender(gender),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: User) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => handleViewUser(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEditUser(record)}
              size="small"
              type="primary"
              ghost
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={3}>Quản lý người dùng</Title>
          <div className="flex gap-4">
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-64"
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddUser}
            >
              Thêm người dùng
            </Button>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} người dùng`,
          }}
        />
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveUser}
          initialValues={editingUser ? {
            ...editingUser,
            dateOfBirth: editingUser.dateOfBirth ? moment(editingUser.dateOfBirth) : undefined,
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
              <Input disabled={!!editingUser} />
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
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select>
                <Option value="STUDENT">Học sinh</Option>
                <Option value="PARENT">Phụ huynh</Option>
                <Option value="COUNSELOR">Tư vấn viên</Option>
                <Option value="ADMIN">Quản trị viên</Option>
              </Select>
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
            <Button onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingUser ? 'Lưu thay đổi' : 'Thêm người dùng'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View User Modal */}
      <Modal
        title="Thông tin chi tiết người dùng"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setViewModalVisible(false);
              if (viewingUser) {
                handleEditUser(viewingUser);
              }
            }}
          >
            Chỉnh sửa
          </Button>
        ]}
        width={700}
      >
        {viewingUser && (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex flex-col items-center p-4 border-r border-gray-200">
              <Avatar 
                size={120} 
                src={viewingUser.imageUrl} 
                icon={!viewingUser.imageUrl && <UserOutlined />}
                className="mb-4"
              />
              <Typography.Title level={4} className="mb-1">{viewingUser.fullName}</Typography.Title>
              <div className="mb-2">{renderRole(viewingUser.role)}</div>
              <Typography.Text type="secondary">{viewingUser.email}</Typography.Text>
            </div>
            
            <div className="md:w-2/3 p-4">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium text-gray-600 w-1/3">ID:</td>
                    <td className="py-2">{viewingUser.id}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium text-gray-600">Số điện thoại:</td>
                    <td className="py-2">{viewingUser.phoneNumber}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium text-gray-600">Ngày sinh:</td>
                    <td className="py-2">{moment(viewingUser.dateOfBirth).format('DD/MM/YYYY')}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium text-gray-600">Giới tính:</td>
                    <td className="py-2">{renderGender(viewingUser.gender)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium text-gray-600">Địa chỉ:</td>
                    <td className="py-2">{viewingUser.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUserListScreen;