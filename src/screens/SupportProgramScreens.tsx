import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Typography, Spin, Empty, Modal, message, DatePicker, TimePicker, Form, Image } from 'antd';
import { SearchOutlined, InfoCircleOutlined, ScheduleOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Title, Text } = Typography;

interface SupportProgram {
  id: string;
  name: string;
  category: string; // keyword
  description: string;
  participants: number;
  imageUrl: string;
  location: string;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate: string;
  counselor: string;
}

interface AppointmentFormValues {
  date: dayjs.Dayjs;
  time: dayjs.Dayjs;
  note: string;
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

const StudentSupportProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<SupportProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bookingModalVisible, setBookingModalVisible] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<SupportProgram | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data instead of API call
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
      }
    };

    fetchPrograms();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const showProgramDetails = (program: SupportProgram) => {
    setSelectedProgram(program);
    setModalVisible(true);
  };

  const showBookingModal = (program: SupportProgram) => {
    setSelectedProgram(program);
    setBookingModalVisible(true);
    form.resetFields();
  };

  const handleBookAppointment = async (values: AppointmentFormValues) => {
    try {
      // Mock successful booking
      console.log('Booking values:', values);
      message.success('Đặt lịch hẹn thành công!');
      setBookingModalVisible(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
      message.error('Đã xảy ra lỗi khi đặt lịch hẹn. Vui lòng thử lại sau.');
    }
  };

  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchText.toLowerCase()) ||
    program.category.toLowerCase().includes(searchText.toLowerCase()) ||
    program.counselor.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<SupportProgram> = [
    {
      title: 'Tên chương trình',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Text strong className="text-blue-700 cursor-pointer hover:underline" onClick={() => showProgramDetails(record)}>
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
            onClick={() => showProgramDetails(record)}
            className="bg-blue-500"
          >
            Chi tiết
          </Button>
          {record.status !== 'completed' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<ScheduleOutlined />}
              onClick={() => showBookingModal(record)}
              className="bg-green-500"
            >
              Đặt lịch hẹn
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">Chương Trình Hỗ Trợ Tâm Lý</Title>
        <Input
          placeholder="Tìm kiếm chương trình..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="w-64"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

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

      {/* Program Details Modal */}
      <Modal
        title={<span className="text-lg font-semibold">Chi tiết chương trình</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          selectedProgram && selectedProgram.status !== 'completed' && (
            <Button 
              key="book" 
              type="primary" 
              onClick={() => {
                setModalVisible(false);
                showBookingModal(selectedProgram);
              }}
              className="bg-green-500"
            >
              Đặt lịch hẹn
            </Button>
          )
        ]}
        width={700}
      >
        {selectedProgram && (
          <div className="space-y-4">
            <div className="flex mb-4">
              <div className="w-1/3 mr-4">
                <Image
                  src={selectedProgram.imageUrl}
                  alt={selectedProgram.name}
                  className="rounded-lg object-cover"
                  style={{ maxHeight: '200px' }}
                />
              </div>
              <div className="w-2/3 bg-gray-50 p-4 rounded-lg">
                <Title level={4} className="text-blue-700 mb-2">{selectedProgram.name}</Title>
                <Tag color={statusColors[selectedProgram.status]} className="mb-3">
                  {statusText[selectedProgram.status]}
                </Tag>
                <p className="text-gray-700">{selectedProgram.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <Text strong className="text-gray-700 block mb-1">Danh mục:</Text>
                <Tag color="blue">{selectedProgram.category}</Tag>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Text strong className="text-gray-700 block mb-1">Người tư vấn:</Text>
                <Text>{selectedProgram.counselor}</Text>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Text strong className="text-gray-700 block mb-1">Thời gian:</Text>
                <Text>{`${new Date(selectedProgram.startDate).toLocaleDateString('vi-VN')} - ${new Date(selectedProgram.endDate).toLocaleDateString('vi-VN')}`}</Text>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Text strong className="text-gray-700 block mb-1">Địa điểm:</Text>
                <Text>{selectedProgram.location}</Text>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Text strong className="text-gray-700 block mb-1">Địa điểm:</Text>
                <Text>{selectedProgram.location}</Text>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Text strong className="text-gray-700 block mb-1">Số người tham gia:</Text>
                <div className="flex items-center">
                  <TeamOutlined className="mr-1 text-blue-500" />
                  <Text>{selectedProgram.participants} người</Text>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <InfoCircleOutlined className="text-blue-500 mr-2" />
                <Text type="secondary">Vui lòng liên hệ phòng tư vấn tâm lý nếu bạn cần thêm thông tin về chương trình.</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Booking Appointment Modal */}
      <Modal
        title={<span className="text-lg font-semibold">Đặt lịch hẹn</span>}
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedProgram && (
          <div>
            <div className="mb-4">
              <Text strong>Chương trình: </Text>
              <Text>{selectedProgram.name}</Text>
            </div>
            <div className="mb-4">
              <Text strong>Danh mục: </Text>
              <Tag color="blue">{selectedProgram.category}</Tag>
            </div>
            <div className="mb-4">
              <Text strong>Người tư vấn: </Text>
              <Text>{selectedProgram.counselor}</Text>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleBookAppointment}
            >
              <Form.Item
                name="date"
                label="Ngày hẹn"
                rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn!' }]}
              >
                <DatePicker 
                  locale={locale}
                  format="DD/MM/YYYY" 
                  className="w-full"
                  disabledDate={(current) => {
                    // Disable dates before today and after program end date
                    const today = dayjs().startOf('day');
                    const endDate = dayjs(selectedProgram.endDate);
                    return current && (current < today || current > endDate);
                  }}
                />
              </Form.Item>
              
              <Form.Item
                name="time"
                label="Thời gian"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian hẹn!' }]}
              >
                <TimePicker 
                  format="HH:mm" 
                  className="w-full"
                  minuteStep={15}
                  showNow={false}
                  // Typically available hours (8AM to 5PM)
                  disabledTime={() => ({
                    disabledHours: () => [...Array(8).keys(), ...Array(24).keys()].slice(17),
                  })}
                />
              </Form.Item>
              
              <Form.Item
                name="note"
                label="Ghi chú"
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="Nhập ghi chú hoặc lý do bạn muốn đặt lịch hẹn..."
                />
              </Form.Item>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={() => setBookingModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" className="bg-blue-500">
                  Xác nhận đặt lịch
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentSupportProgramList;
