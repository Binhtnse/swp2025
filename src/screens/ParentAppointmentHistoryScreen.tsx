import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, Empty, Card, Button, message, Select, Space, Avatar } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
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

  // Fetch children of the parent
  const fetchChildren = async () => {
    try {
      setLoadingChildren(true);
      const response = await axios.get(
        'http://14.225.207.207:8080/api/user/get-student-of-parent',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (response.data && response.data.length > 0) {
        setChildren(response.data);
        // Auto-select the first child
        setSelectedChildId(response.data[0].id);
      } else {
        setError('Không tìm thấy thông tin học sinh. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      console.error('Error fetching children:', err);
      setError('Không thể tải danh sách học sinh. Vui lòng thử lại sau.');
      message.error('Không thể tải danh sách học sinh');
    } finally {
      setLoadingChildren(false);
    }
  };

  // Fetch appointments for the selected child
  const fetchAppointments = async (childId: number) => {
    if (!childId) return;
    
    try {
      setLoadingAppointments(true);
      const response = await axios.get(
        `http://14.225.207.207:8080/api/appointment/get-history-booking-from-student?studentId=${childId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAppointments(response.data);
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
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      fetchAppointments(selectedChildId);
    }
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
