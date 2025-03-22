import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, Empty, Card, Button, message, Select, Space, Avatar } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  imageUrl: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
}

interface Appointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
  report: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
  isDeleted: boolean;
}

const ParentAppointmentHistoryScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [children, setChildren] = useState<User[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loadingChildren, setLoadingChildren] = useState<boolean>(true);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for children
  const mockChildren: User[] = [
    {
      id: 1,
      fullName: "Nguyễn Văn An",
      email: "an@example.com",
      role: "STUDENT",
      phoneNumber: "0123456789",
      imageUrl: "https://randomuser.me/api/portraits/children/1.jpg",
      dateOfBirth: "2010-05-15",
      gender: "MALE"
    },
    {
      id: 2,
      fullName: "Trần Thị Bình",
      email: "binh@example.com",
      role: "STUDENT",
      phoneNumber: "0987654321",
      imageUrl: "https://randomuser.me/api/portraits/children/2.jpg",
      dateOfBirth: "2012-08-20",
      gender: "FEMALE"
    }
  ];

  // Mock data for appointments
  const mockAppointments: Record<number, Appointment[]> = {
    1: [
      {
        id: 101,
        appointmentDate: "2023-11-15T00:00:00Z",
        startTime: "2023-11-15T09:00:00Z",
        endTime: "2023-11-15T10:00:00Z",
        status: "COMPLETED",
        notes: "Tư vấn về vấn đề học tập",
        report: "Học sinh có tiến bộ trong việc tập trung học tập. Cần tiếp tục theo dõi và hỗ trợ.",
        createdAt: "2023-11-10T08:30:00Z",
        updatedAt: "2023-11-15T10:15:00Z",
        createdBy: {
          id: 5,
          fullName: "Lê Thị Hương",
          email: "huong@example.com",
          role: "COUNSELOR",
          phoneNumber: "0123456789",
          imageUrl: null
        },
        updatedBy: {
          id: 5,
          fullName: "Lê Thị Hương",
          email: "huong@example.com",
          role: "COUNSELOR",
          phoneNumber: "0123456789",
          imageUrl: null
        },
        isDeleted: false
      },
      {
        id: 102,
        appointmentDate: "2023-12-05T00:00:00Z",
        startTime: "2023-12-05T14:00:00Z",
        endTime: "2023-12-05T15:00:00Z",
        status: "SCHEDULED",
        notes: "Theo dõi tiến độ sau buổi tư vấn trước",
        report: null,
        createdAt: "2023-11-25T10:45:00Z",
        updatedAt: "2023-11-25T10:45:00Z",
        createdBy: {
          id: 5,
          fullName: "Lê Thị Hương",
          email: "huong@example.com",
          role: "COUNSELOR",
          phoneNumber: "0123456789",
          imageUrl: null
        },
        updatedBy: {
          id: 5,
          fullName: "Lê Thị Hương",
          email: "huong@example.com",
          role: "COUNSELOR",
          phoneNumber: "0123456789",
          imageUrl: null
        },
        isDeleted: false
      },
      {
        id: 103,
        appointmentDate: "2023-10-20T00:00:00Z",
        startTime: "2023-10-20T13:30:00Z",
        endTime: "2023-10-20T14:30:00Z",
        status: "CANCELLED",
        notes: "Tư vấn về kỹ năng giao tiếp",
        report: null,
        createdAt: "2023-10-15T09:20:00Z",
        updatedAt: "2023-10-19T16:45:00Z",
        createdBy: {
          id: 6,
          fullName: "Trần Văn Minh",
          email: "minh@example.com",
          role: "COUNSELOR",
          phoneNumber: "0987654321",
          imageUrl: null
        },
        updatedBy: {
          id: 6,
          fullName: "Trần Văn Minh",
          email: "minh@example.com",
          role: "COUNSELOR",
          phoneNumber: "0987654321",
          imageUrl: null
        },
        isDeleted: false
      }
    ],
    2: [
      {
        id: 201,
        appointmentDate: "2023-11-18T00:00:00Z",
        startTime: "2023-11-18T10:00:00Z",
        endTime: "2023-11-18T11:00:00Z",
        status: "COMPLETED",
        notes: "Tư vấn về vấn đề hòa nhập",
        report: "Học sinh đã có tiến bộ trong việc hòa nhập với bạn bè. Cần tiếp tục khuyến khích tham gia các hoạt động nhóm.",
        createdAt: "2023-11-12T14:30:00Z",
        updatedAt: "2023-11-18T11:15:00Z",
        createdBy: {
          id: 6,
          fullName: "Trần Văn Minh",
          email: "minh@example.com",
          role: "COUNSELOR",
          phoneNumber: "0987654321",
          imageUrl: null
        },
        updatedBy: {
          id: 6,
          fullName: "Trần Văn Minh",
          email: "minh@example.com",
          role: "COUNSELOR",
          phoneNumber: "0987654321",
          imageUrl: null
        },
        isDeleted: false
      },
      {
        id: 202,
        appointmentDate: "2023-12-10T00:00:00Z",
        startTime: "2023-12-10T09:30:00Z",
        endTime: "2023-12-10T10:30:00Z",
        status: "PENDING",
        notes: "Đánh giá tiến bộ học kỳ 1",
        report: null,
        createdAt: "2023-12-01T08:15:00Z",
        updatedAt: "2023-12-01T08:15:00Z",
        createdBy: {
          id: 5,
          fullName: "Lê Thị Hương",
          email: "huong@example.com",
          role: "COUNSELOR",
          phoneNumber: "0123456789",
          imageUrl: null
        },
        updatedBy: {
          id: 5,
          fullName: "Lê Thị Hương",
          email: "huong@example.com",
          role: "COUNSELOR",
          phoneNumber: "0123456789",
          imageUrl: null
        },
        isDeleted: false
      }
    ]
  };

  // Fetch children of the parent (using mock data)
  const fetchChildren = async () => {
    try {
      setLoadingChildren(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setChildren(mockChildren);
      // Auto-select the first child
      setSelectedChildId(mockChildren[0].id);
      setError(null);
    } catch (err) {
      console.error('Error fetching children:', err);
      setError('Không thể tải danh sách học sinh. Vui lòng thử lại sau.');
      message.error('Không thể tải danh sách học sinh');
    } finally {
      setLoadingChildren(false);
    }
  };

  // Fetch appointments for the selected child (using mock data)
  const fetchAppointments = async (childId: number) => {
    if (!childId) return;
    
    try {
      setLoadingAppointments(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const appointmentsForChild = mockAppointments[childId] || [];
      setAppointments(appointmentsForChild);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointment history:', err);
      setError('Không thể tải lịch sử cuộc hẹn. Vui lòng thử lại sau.');
      message.error('Không thể tải lịch sử cuộc hẹn');
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      fetchAppointments(selectedChildId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const handleChildChange = (value: number) => {
    setSelectedChildId(value);
  };

  const refreshData = () => {
    if (selectedChildId) {
      fetchAppointments(selectedChildId);
    } else {
      fetchChildren();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'blue';
      case 'COMPLETED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Đã lên lịch';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'PENDING':
        return 'Đang chờ';
      default:
        return status;
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    return dayjs(dateTimeStr).format('DD/MM/YYYY HH:mm');
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Ngày',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (text) => formatDateTime(text).split(' ')[0],
      sorter: (a, b) => 
        dayjs(a.appointmentDate).unix() - dayjs(b.appointmentDate).unix(),
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => (
        <span>
          {formatDateTime(record.startTime).split(' ')[1]} - {formatDateTime(record.endTime).split(' ')[1]}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Đã lên lịch', value: 'SCHEDULED' },
        { text: 'Hoàn thành', value: 'COMPLETED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
        { text: 'Đang chờ', value: 'PENDING' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDateTime(text),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Người tạo',
      dataIndex: ['createdBy', 'fullName'],
      key: 'createdBy',
    },
  ];

  const getSelectedChildName = () => {
    if (!selectedChildId || children.length === 0) return '';
    const child = children.find(c => c.id === selectedChildId);
    return child ? child.fullName : '';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="m-0">Lịch sử cuộc hẹn của con</Title>
          <Button type="primary" onClick={refreshData} loading={loadingAppointments || loadingChildren}>
            Làm mới
          </Button>
        </div>

        {loadingChildren ? (
          <div className="flex justify-center items-center py-4">
            <Spin size="default" tip="Đang tải danh sách học sinh..." />
          </div>
        ) : (
          <div className="mb-6">
          <div className="font-medium mb-2">Chọn học sinh:</div>
            <Select
              placeholder="Chọn học sinh"
              style={{ width: '100%' }}
              value={selectedChildId || undefined}
              onChange={handleChildChange}
              disabled={children.length === 0}
              loading={loadingChildren}
            >
              {children.map(child => (
                <Option key={child.id} value={child.id}>
                  <Space>
                    <Avatar 
                      src={child.imageUrl} 
                      icon={<UserOutlined />} 
                      size="small"
                    />
                    {child.fullName}
                  </Space>
                </Option>
              ))}
            </Select>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
      </Card>

      {selectedChildId && (
        <Card className="shadow-md">
          <Title level={4} className="mb-4">
            Lịch sử cuộc hẹn của {getSelectedChildName()}
          </Title>

          {loadingAppointments ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" tip="Đang tải cuộc hẹn..." />
            </div>
          ) : appointments.length === 0 ? (
            <Empty 
              description="Không tìm thấy lịch sử cuộc hẹn" 
              className="py-12"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={appointments.map(appointment => ({
                ...appointment,
                key: appointment.id,
              }))}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng ${total} cuộc hẹn`,
              }}
              scroll={{ x: 'max-content' }}
              className="bg-white"
              bordered
              rowClassName={(record) => 
                record.isDeleted ? 'bg-gray-100 opacity-60' : ''
              }
              expandable={{
                expandedRowRender: (record) => (
                  <div className="p-4">
                    <p className="font-semibold mb-2">Báo cáo:</p>
                    <p>{record.report || 'Chưa có báo cáo'}</p>
                  </div>
                ),
                rowExpandable: (record) => record.report !== null,
              }}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default ParentAppointmentHistoryScreen;
