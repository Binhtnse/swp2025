import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

interface Psychologist {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  address: string;
}

const AdminPsychologistScreen: React.FC = () => {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPsychologist, setCurrentPsychologist] = useState<Psychologist | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData: Psychologist[] = [
        {
          id: '1',
          fullName: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          dateOfBirth: '1985-05-15',
          gender: 'male',
          phoneNumber: '0901234567',
          address: 'Quận 1, TP. Hồ Chí Minh'
        },
        {
          id: '2',
          fullName: 'Trần Thị B',
          email: 'tranthib@example.com',
          dateOfBirth: '1990-10-20',
          gender: 'female',
          phoneNumber: '0912345678',
          address: 'Quận Cầu Giấy, Hà Nội'
        },
      ];
      setPsychologists(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const showModal = (record?: Psychologist) => {
    if (record) {
      setIsEditing(true);
      setCurrentPsychologist(record);
      form.setFieldsValue({
        ...record,
        dateOfBirth: dayjs(record.dateOfBirth),
      });
    } else {
      setIsEditing(false);
      setCurrentPsychologist(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
      };

      if (isEditing && currentPsychologist) {
        // Update existing psychologist
        setPsychologists(prev => 
          prev.map(item => item.id === currentPsychologist.id ? { ...item, ...formattedValues } : item)
        );
        message.success('Cập nhật thông tin chuyên gia thành công!');
      } else {
        // Add new psychologist
        const newPsychologist: Psychologist = {
          id: Math.random().toString(36).substr(2, 9),
          ...formattedValues,
        };
        setPsychologists(prev => [...prev, newPsychologist]);
        message.success('Thêm chuyên gia mới thành công!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    setPsychologists(prev => prev.filter(item => item.id !== id));
    message.success('Đã xóa chuyên gia thành công!');
  };

  const filteredPsychologists = psychologists.filter(
    psych => 
      psych.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      psych.email.toLowerCase().includes(searchText.toLowerCase()) ||
      psych.phoneNumber.includes(searchText)
  );

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: Psychologist, b: Psychologist) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (text: string) => {
        const genderMap = {
          male: 'Nam',
          female: 'Nữ',
          other: 'Khác'
        };
        return genderMap[text as keyof typeof genderMap];
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Psychologist) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
            className="bg-blue-500"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa chuyên gia tâm lý"
            description="Bạn có chắc chắn muốn xóa chuyên gia này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Chuyên gia Tâm lý</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-80"
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            className="bg-green-500 hover:bg-green-600"
          >
            Thêm chuyên gia
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPsychologists}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} chuyên gia`,
        }}
        className="bg-white rounded-lg shadow"
      />

      <Modal
        title={isEditing ? "Cập nhật thông tin chuyên gia" : "Thêm chuyên gia mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} className="bg-blue-500">
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker 
                format="DD/MM/YYYY" 
                className="w-full" 
                locale={locale}
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value="male">Nam</Select.Option>
                <Select.Option value="female">Nữ</Select.Option>
                <Select.Option value="other">Khác</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPsychologistScreen;
