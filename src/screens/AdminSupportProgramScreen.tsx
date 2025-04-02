import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Input, Space, Typography, Spin, Empty, Modal, message, 
  Form, Select, DatePicker, InputNumber, Upload, Popconfirm, Tabs
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ExclamationCircleOutlined, TeamOutlined, EnvironmentOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface SupportProgram {
  id: string;
  name: string;
  category: string;
  description: string;
  participants: number;
  imageUrl: string;
  location: string;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  counselor: string;
}

interface ProgramFormValues {
  name: string;
  category: string;
  description: string;
  participants: number;
  location: string;
  status: 'active' | 'completed' | 'upcoming';
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  counselor: string;
  image?: UploadFile[];
}

const statusColors = {
  active: 'green',
  completed: 'blue',
  upcoming: 'orange',
};

const statusText = {
  active: 'Đang diễn ra',
  completed: 'Đã hoàn thành',
  upcoming: 'Sắp diễn ra',
};

const categoryOptions = [
  { value: 'Tư vấn', label: 'Tư vấn' },
  { value: 'Hội thảo', label: 'Hội thảo' },
  { value: 'Nhóm hỗ trợ', label: 'Nhóm hỗ trợ' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Hỗ trợ học tập', label: 'Hỗ trợ học tập' },
];

const AdminSupportProgramScreen: React.FC = () => {
  const [programs, setPrograms] = useState<SupportProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedProgram, setSelectedProgram] = useState<SupportProgram | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      
      // Mock data with the requested format
      setTimeout(() => {
        const mockData: SupportProgram[] = [
          {
            id: '1',
            name: 'Tư vấn tâm lý cá nhân',
            category: 'Tư vấn',
            description: 'Chương trình tư vấn tâm lý cá nhân giúp sinh viên giải quyết các vấn đề về stress và lo âu.',
            participants: 15,
            imageUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            location: 'Phòng tư vấn A101',
            status: 'active',
            startDate: '2023-10-15',
            endDate: '2023-12-15',
            counselor: 'Nguyễn Văn A',
          },
          {
            id: '2',
            name: 'Hội thảo kỹ năng quản lý cảm xúc',
            category: 'Hội thảo',
            description: 'Hội thảo giúp sinh viên học cách nhận diện và quản lý cảm xúc hiệu quả.',
            participants: 45,
            imageUrl: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            location: 'Hội trường B',
            status: 'completed',
            startDate: '2023-09-01',
            endDate: '2023-09-30',
            counselor: 'Trần Thị B',
          },
          {
            id: '3',
            name: 'Nhóm hỗ trợ đồng cảm',
            category: 'Nhóm hỗ trợ',
            description: 'Nhóm hỗ trợ cho sinh viên chia sẻ và học hỏi từ những trải nghiệm của nhau.',
            participants: 20,
            imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            location: 'Phòng sinh hoạt C202',
            status: 'upcoming',
            startDate: '2023-11-01',
            endDate: '2024-01-31',
            counselor: 'Lê Thị C',
          },
          {
            id: '4',
            name: 'Workshop kỹ năng giao tiếp',
            category: 'Workshop',
            description: 'Workshop cung cấp các kỹ năng giao tiếp hiệu quả trong môi trường học tập và làm việc.',
            participants: 30,
            imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            location: 'Phòng đa năng D303',
            status: 'active',
            startDate: '2023-10-10',
            endDate: '2023-11-10',
            counselor: 'Phạm Văn D',
          },
          {
            id: '5',
            name: 'Chương trình hỗ trợ học tập',
            category: 'Hỗ trợ học tập',
            description: 'Chương trình giúp sinh viên phát triển kỹ năng học tập hiệu quả và quản lý thời gian.',
            participants: 25,
            imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            location: 'Thư viện tầng 2',
            status: 'upcoming',
            startDate: '2023-12-01',
            endDate: '2024-02-28',
            counselor: 'Hoàng Thị E',
          },
        ];
        setPrograms(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching support programs:', error);
      setLoading(false);
      message.error('Không thể tải dữ liệu chương trình hỗ trợ');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const showAddModal = () => {
    setModalType('add');
    setSelectedProgram(null);
    setFileList([]);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (program: SupportProgram) => {
    setModalType('edit');
    setSelectedProgram(program);
    setFileList([
      {
        uid: '-1',
        name: 'current-image.png',
        status: 'done',
        url: program.imageUrl,
      },
    ]);
    
    form.setFieldsValue({
      name: program.name,
      category: program.category,
      description: program.description,
      participants: program.participants,
      location: program.location,
      status: program.status,
      dateRange: [dayjs(program.startDate), dayjs(program.endDate)],
      counselor: program.counselor,
    });
    
    setModalVisible(true);
  };

  const handleDeleteProgram = async (programId: string) => {
    try {
      // In a real application, you would call an API to delete the program
      // For now, we'll just filter it out from our local state
      setPrograms(programs.filter(program => program.id !== programId));
      message.success('Xóa chương trình thành công');
    } catch (error) {
      console.error('Error deleting program:', error);
      message.error('Không thể xóa chương trình');
    }
  };

  const handleFormSubmit = async (values: ProgramFormValues) => {
    try {
      const formData = {
        name: values.name,
        category: values.category,
        description: values.description,
        participants: values.participants,
        location: values.location,
        status: values.status,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        counselor: values.counselor,
        // In a real application, you would upload the image and get a URL back
        imageUrl: fileList.length > 0 && fileList[0].url 
          ? fileList[0].url 
          : 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      };

      if (modalType === 'add') {
        // In a real application, you would call an API to add the program
        const newProgram: SupportProgram = {
          id: Date.now().toString(), // Generate a temporary ID
          ...formData,
        };
        
        setPrograms([...programs, newProgram]);
        message.success('Thêm chương trình thành công');
      } else if (modalType === 'edit' && selectedProgram) {
        // In a real application, you would call an API to update the program
        const updatedPrograms = programs.map(program => 
          program.id === selectedProgram.id 
            ? { ...program, ...formData } 
            : program
        );
        
        setPrograms(updatedPrograms);
        message.success('Cập nhật chương trình thành công');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Không thể lưu chương trình');
    }
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.name.toLowerCase().includes(searchText.toLowerCase()) ||
      program.category.toLowerCase().includes(searchText.toLowerCase()) ||
      program.counselor.toLowerCase().includes(searchText.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && program.status === activeTab;
  });

  const columns: ColumnsType<SupportProgram> = [
    {
      title: 'Tên chương trình',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div className="flex items-center">
          <Text strong className="text-blue-700 cursor-pointer hover:underline">
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">{category}</Tag>
      )
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      render: (location) => (
        <div className="flex items-center">
          <EnvironmentOutlined className="mr-1 text-gray-500" />
          <Text>{location}</Text>
        </div>
      ),
    },
    {
      title: 'Số người tham gia',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants) => (
        <div className="flex items-center">
          <TeamOutlined className="mr-1 text-gray-500" />
          <Text>{participants}</Text>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => (
        <Text>
          {`${new Date(record.startDate).toLocaleDateString('vi-VN')} - ${new Date(record.endDate).toLocaleDateString('vi-VN')}`}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status: 'active' | 'completed' | 'upcoming') => (
        <Tag color={statusColors[status]} className="px-2 py-1">
          {statusText[status]}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="bg-blue-500"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa chương trình"
            description="Bạn có chắc chắn muốn xóa chương trình này?"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDeleteProgram(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">Quản Lý Chương Trình Hỗ Trợ Tâm Lý</Title>
        <Space>
          <Input
            placeholder="Tìm kiếm chương trình..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-64"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
            className="bg-green-500"
          >
            Thêm chương trình
          </Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="mb-4"
      >
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Đang diễn ra" key="active" />
        <TabPane tab="Sắp diễn ra" key="upcoming" />
        <TabPane tab="Đã hoàn thành" key="completed" />
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : filteredPrograms.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={filteredPrograms} 
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} chương trình`,
          }}
          className="border rounded-lg"
        />
      ) : (
        <Empty 
          description="Không tìm thấy chương trình hỗ trợ nào" 
          className="my-12"
        />
      )}

      {/* Add/Edit Program Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold">
            {modalType === 'add' ? 'Thêm chương trình mới' : 'Chỉnh sửa chương trình'}
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Form.Item
                name="name"
                label="Tên chương trình"
                rules={[{ required: true, message: 'Vui lòng nhập tên chương trình!' }]}
              >
                <Input placeholder="Nhập tên chương trình" />
              </Form.Item>
            </div>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select 
                placeholder="Chọn danh mục"
                options={categoryOptions}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select 
                placeholder="Chọn trạng thái"
                options={[
                  { value: 'active', label: 'Đang diễn ra' },
                  { value: 'upcoming', label: 'Sắp diễn ra' },
                  { value: 'completed', label: 'Đã hoàn thành' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Thời gian diễn ra"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian diễn ra!' }]}
            >
              <RangePicker 
                locale={locale}
                format="DD/MM/YYYY" 
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              name="counselor"
              label="Người tư vấn"
              rules={[{ required: true, message: 'Vui lòng nhập tên người tư vấn!' }]}
            >
              <Input placeholder="Nhập tên người tư vấn" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Địa điểm"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
            >
              <Input placeholder="Nhập địa điểm" />
            </Form.Item>

            <Form.Item
              name="participants"
              label="Số người tham gia tối đa"
              rules={[{ required: true, message: 'Vui lòng nhập số người tham gia!' }]}
            >
              <InputNumber min={1} placeholder="Nhập số người" className="w-full" />
            </Form.Item>

            <div className="col-span-2">
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả chương trình!' }]}
              >
                <TextArea rows={4} placeholder="Nhập mô tả chi tiết về chương trình" />
              </Form.Item>
            </div>

            <div className="col-span-2">
              <Form.Item
                name="image"
                label="Hình ảnh"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e && e.fileList;
                }}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-500">
              {modalType === 'add' ? 'Thêm chương trình' : 'Cập nhật'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminSupportProgramScreen;