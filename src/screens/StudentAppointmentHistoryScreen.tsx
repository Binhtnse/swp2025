import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, Empty, Card, Button, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  imageUrl: string | null;
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

const StudentAppointmentHistoryScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for appointments
  const mockAppointments: Appointment[] = [
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
      createdAt: "2023-12-01T10:45:00Z",
      updatedAt: "2023-12-01T10:45:00Z",
      createdBy: {
        id: 6,
        fullName: "Nguyễn Văn Minh",
        email: "minh@example.com",
        role: "COUNSELOR",
        phoneNumber: "0987654321",
        imageUrl: null
      },
      updatedBy: {
        id: 6,
        fullName: "Nguyễn Văn Minh",
        email: "minh@example.com",
        role: "COUNSELOR",
        phoneNumber: "0987654321",
        imageUrl: null
      },
      isDeleted: false
    },
    {
      id: 103,
      appointmentDate: "2023-10-20T00:00:00Z",
      startTime: "2023-10-20T10:30:00Z",
      endTime: "2023-10-20T11:30:00Z",
      status: "CANCELLED",
      notes: "Tư vấn về kỹ năng giao tiếp",
      report: null,
      createdAt: "2023-10-15T09:20:00Z",
      updatedAt: "2023-10-19T16:45:00Z",
      createdBy: {
        id: 7,
        fullName: "Trần Thị Mai",
        email: "mai@example.com",
        role: "COUNSELOR",
        phoneNumber: "0912345678",
        imageUrl: null
      },
      updatedBy: {
        id: 7,
        fullName: "Trần Thị Mai",
        email: "mai@example.com",
        role: "COUNSELOR",
        phoneNumber: "0912345678",
        imageUrl: null
      },
      isDeleted: false
    },
    {
      id: 104,
      appointmentDate: "2023-11-25T00:00:00Z",
      startTime: "2023-11-25T13:00:00Z",
      endTime: "2023-11-25T14:00:00Z",
      status: "PENDING",
      notes: "Tư vấn về quản lý thời gian",
      report: null,
      createdAt: "2023-11-20T11:30:00Z",
      updatedAt: "2023-11-20T11:30:00Z",
      createdBy: {
        id: 8,
        fullName: "Phạm Văn Đức",
        email: "duc@example.com",
        role: "COUNSELOR",
        phoneNumber: "0923456789",
        imageUrl: null
      },
      updatedBy: {
        id: 8,
        fullName: "Phạm Văn Đức",
        email: "duc@example.com",
        role: "COUNSELOR",
        phoneNumber: "0923456789",
        imageUrl: null
      },
      isDeleted: false
    },
    {
      id: 105,
      appointmentDate: "2023-09-10T00:00:00Z",
      startTime: "2023-09-10T15:30:00Z",
      endTime: "2023-09-10T16:30:00Z",
      status: "COMPLETED",
      notes: "Tư vấn về áp lực học tập",
      report: "Học sinh cần được hỗ trợ thêm về kỹ năng quản lý căng thẳng và thiết lập mục tiêu học tập hợp lý.",
      createdAt: "2023-09-05T14:20:00Z",
      updatedAt: "2023-09-10T17:00:00Z",
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
  ];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Simulate API call with timeout
      setTimeout(() => {
        setAppointments(mockAppointments);
        setError(null);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching appointment history:', err);
      setError('Không thể tải lịch sử cuộc hẹn. Vui lòng thử lại sau.');
      message.error('Không thể tải lịch sử cuộc hẹn');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="m-0">Lịch sử cuộc hẹn</Title>
          <Button type="primary" onClick={fetchAppointments} loading={loading}>
            Làm mới
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading ? (
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
    </div>
  );
};

export default StudentAppointmentHistoryScreen;
