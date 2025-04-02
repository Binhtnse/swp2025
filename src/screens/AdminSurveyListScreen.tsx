import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Button,
  Table,
  Space,
  message,
  Modal,
  Input,
  Tag,
  Tooltip,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  MoreOutlined,
  ExportOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Paragraph } = Typography;
const { Search } = Input;

interface Survey {
  id: number;
  title: string;
  description: string;
  status: "active" | "draft" | "closed";
  questionCount: number;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
}

const AdminSurveyListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [surveyToDelete, setSurveyToDelete] = useState<Survey | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      
      // Mock data instead of API call
      const mockSurveys: Survey[] = [
        {
          id: 1,
          title: "Đánh giá mức độ stress",
          description: "Khảo sát đánh giá mức độ căng thẳng và stress trong cuộc sống hàng ngày",
          status: "active",
          questionCount: 5,
          responseCount: 124,
          createdAt: "2023-10-15T08:30:00Z",
          updatedAt: "2023-10-15T08:30:00Z"
        },
        {
          id: 2,
          title: "Đánh giá sức khỏe tinh thần",
          description: "Khảo sát toàn diện về sức khỏe tinh thần và các yếu tố ảnh hưởng",
          status: "active",
          questionCount: 10,
          responseCount: 87,
          createdAt: "2023-09-20T10:15:00Z",
          updatedAt: "2023-09-25T14:20:00Z"
        },
        {
          id: 3,
          title: "Đánh giá mức độ lo âu",
          description: "Khảo sát về các triệu chứng lo âu và tác động đến cuộc sống",
          status: "draft",
          questionCount: 8,
          responseCount: 0,
          createdAt: "2023-11-05T09:45:00Z",
          updatedAt: "2023-11-05T09:45:00Z"
        },
        {
          id: 4,
          title: "Khảo sát về trầm cảm",
          description: "Đánh giá các dấu hiệu trầm cảm và mức độ ảnh hưởng",
          status: "closed",
          questionCount: 12,
          responseCount: 203,
          createdAt: "2023-08-10T11:20:00Z",
          updatedAt: "2023-10-30T16:45:00Z"
        },
        {
          id: 5,
          title: "Đánh giá chất lượng giấc ngủ",
          description: "Khảo sát về thói quen và chất lượng giấc ngủ",
          status: "active",
          questionCount: 7,
          responseCount: 156,
          createdAt: "2023-10-01T13:10:00Z",
          updatedAt: "2023-10-01T13:10:00Z"
        }
      ];
      
      // Simulate network delay
      setTimeout(() => {
        setSurveys(mockSurveys);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Failed to fetch surveys:", error);
      message.error("Không thể tải danh sách khảo sát. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleCreateSurvey = () => {
    navigate("/admin/surveys/create");
  };

  const handleEditSurvey = (id: number) => {
    navigate(`/admin/surveys/edit/${id}`);
  };

  const handleViewSurvey = (id: number) => {
    navigate(`/admin/surveys/${id}`);
  };

  const handleViewResponses = (id: number) => {
    navigate(`/admin/surveys/${id}/responses`);
  };

  const showDeleteConfirm = (survey: Survey) => {
    setSurveyToDelete(survey);
    setDeleteModalVisible(true);
  };

  const handleDeleteSurvey = async () => {
    if (!surveyToDelete) return;
    
    try {
      // Simulate API call
      setLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        setSurveys(surveys.filter(survey => survey.id !== surveyToDelete.id));
        message.success(`Đã xóa khảo sát "${surveyToDelete.title}"`);
        setDeleteModalVisible(false);
        setSurveyToDelete(null);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Failed to delete survey:", error);
      message.error("Không thể xóa khảo sát. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const handleDuplicateSurvey = (id: number) => {
    const surveyToDuplicate = surveys.find(survey => survey.id === id);
    if (!surveyToDuplicate) return;
    
    // Simulate API call
    setTimeout(() => {
      const newSurvey: Survey = {
        ...surveyToDuplicate,
        id: Math.max(...surveys.map(s => s.id)) + 1,
        title: `${surveyToDuplicate.title} (Bản sao)`,
        status: "draft",
        responseCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSurveys([...surveys, newSurvey]);
      message.success(`Đã tạo bản sao của khảo sát "${surveyToDuplicate.title}"`);
    }, 500);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "active":
        return <Tag color="green">Đang hoạt động</Tag>;
      case "draft":
        return <Tag color="blue">Bản nháp</Tag>;
      case "closed":
        return <Tag color="red">Đã đóng</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const filteredSurveys = surveys.filter(survey => 
    survey.title.toLowerCase().includes(searchText.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Survey> = [
    {
      title: 'Tên khảo sát',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div className="font-medium text-blue-600">{text}</div>
          <div className="text-sm text-gray-500 truncate max-w-md">{record.description}</div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => getStatusTag(status),
      filters: [
        { text: 'Đang hoạt động', value: 'active' },
        { text: 'Bản nháp', value: 'draft' },
        { text: 'Đã đóng', value: 'closed' },
      ],
      onFilter: (value, record) => record.status === value,
      width: 150,
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'questionCount',
      key: 'questionCount',
      sorter: (a, b) => a.questionCount - b.questionCount,
      width: 120,
      align: 'center',
    },
    {
      title: 'Số phản hồi',
      dataIndex: 'responseCount',
      key: 'responseCount',
      sorter: (a, b) => a.responseCount - b.responseCount,
      width: 120,
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      width: 120,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewSurvey(record.id)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditSurvey(record.id)}
              className="text-green-500 hover:text-green-700"
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  icon: <ExportOutlined />,
                  label: 'Xem phản hồi',
                  onClick: () => handleViewResponses(record.id),
                  disabled: record.responseCount === 0,
                },
                {
                  key: '2',
                  icon: <CopyOutlined />,
                  label: 'Tạo bản sao',
                  onClick: () => handleDuplicateSurvey(record.id),
                },
                {
                  key: '3',
                  icon: <DeleteOutlined />,
                  label: 'Xóa khảo sát',
                  danger: true,
                  onClick: () => showDeleteConfirm(record),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="mb-2">Quản lý khảo sát sức khỏe tinh thần</Title>
            <Paragraph className="text-gray-600">
              Quản lý các khảo sát đánh giá sức khỏe tinh thần và theo dõi phản hồi
            </Paragraph>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleCreateSurvey}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tạo khảo sát mới
          </Button>
        </div>

        <div className="mb-6">
          <Search
            placeholder="Tìm kiếm khảo sát..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={e => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredSurveys}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khảo sát`,
            }}
            className="border border-gray-200 rounded-md"
          />
        </div>
      </Card>

      <Modal
        title="Xác nhận xóa khảo sát"
        open={deleteModalVisible}
        onOk={handleDeleteSurvey}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa khảo sát "{surveyToDelete?.title}"?</p>
        <p className="text-red-500">Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.</p>
      </Modal>
    </div>
  );
};

export default AdminSurveyListScreen;
