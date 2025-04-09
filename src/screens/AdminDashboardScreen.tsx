import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Statistic, 
  Table, 
  Typography, 
  Row, 
  Col,
  Avatar,
  Dropdown,
  Button
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  BarChartOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <DashboardOutlined />),
  getItem('Users', '2', <UserOutlined />),
  getItem('Products', '3', <ShoppingCartOutlined />),
  getItem('Orders', '4', <FileTextOutlined />),
  getItem('Reports', '5', <BarChartOutlined />, [
    getItem('Sales', '5-1'),
    getItem('Inventory', '5-2'),
    getItem('Customer', '5-3'),
  ]),
  getItem('Settings', '6', <SettingOutlined />),
];

// Sample data for recent activities
const recentActivities = [
  {
    key: '1',
    user: 'John Doe',
    action: 'Created a new product',
    time: '2 hours ago',
    status: 'success',
  },
  {
    key: '2',
    user: 'Jane Smith',
    action: 'Updated inventory',
    time: '5 hours ago',
    status: 'info',
  },
  {
    key: '3',
    user: 'Mike Johnson',
    action: 'Processed order #12345',
    time: '1 day ago',
    status: 'warning',
  },
  {
    key: '4',
    user: 'Sarah Williams',
    action: 'Refunded order #12340',
    time: '2 days ago',
    status: 'error',
  },
];

const columns = [
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    render: (text: string) => (
      <div className="flex items-center">
        <Avatar icon={<UserOutlined />} className="mr-2" />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const statusColors: Record<string, string> = {
        success: 'bg-green-100 text-green-800',
        info: 'bg-blue-100 text-blue-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
      };
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
          {status.toUpperCase()}
        </span>
      );
    },
  },
];

const userMenuItems: MenuProps['items'] = [
  {
    key: '1',
    label: 'Profile',
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: 'Settings',
    icon: <SettingOutlined />,
  },
  {
    key: '3',
    label: 'Logout',
    icon: <LogoutOutlined />,
  },
];

const AdminDashboardScreen: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="bg-white shadow-md"
        width={250}
      >
        <div className="p-4 h-16 flex items-center justify-center border-b border-gray-200">
          <Title level={4} className="m-0 text-blue-600">
            {collapsed ? 'AD' : 'Admin Dashboard'}
          </Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          className="h-full border-r-0"
          items={items}
        />
      </Sider>
      <Layout>
        <Header className="bg-white p-0 px-4 flex justify-between items-center shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className="text-lg"
          />
          <div className="flex items-center">
            <Button type="text" icon={<BellOutlined />} className="mr-4" />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                <span className="ml-2 hidden md:inline">Admin User</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg">
          <Title level={3} className="mb-6">Dashboard Overview</Title>
          
          {/* Stats Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Users"
                  value={1254}
                  prefix={<UserOutlined className="text-blue-500 mr-2" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Products"
                  value={432}
                  prefix={<ShoppingCartOutlined className="text-green-500 mr-2" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Orders"
                  value={789}
                  prefix={<FileTextOutlined className="text-orange-500 mr-2" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title="Team Members"
                  value={24}
                  prefix={<TeamOutlined className="text-purple-500 mr-2" />}
                />
              </Card>
            </Col>
          </Row>
          
          {/* Recent Activity */}
          <Card 
            title="Recent Activity" 
            bordered={false}
            className="shadow-sm mb-6"
            extra={<a href="#">View All</a>}
          >
            <Table 
              dataSource={recentActivities} 
              columns={columns} 
              pagination={false}
              className="overflow-x-auto"
            />
          </Card>
          
          {/* Quick Actions */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card 
                title="Quick Actions" 
                bordered={false}
                className="shadow-sm h-full"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Button type="primary" icon={<UserOutlined />} block>
                    Add User
                  </Button>
                  <Button type="default" icon={<ShoppingCartOutlined />} block>
                    Add Product
                  </Button>
                  <Button type="default" icon={<FileTextOutlined />} block>
                    View Orders
                  </Button>
                  <Button type="default" icon={<BarChartOutlined />} block>
                    Generate Report
                  </Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card 
                title="System Status" 
                bordered={false}
                className="shadow-sm h-full"
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>Server Load</Text>
                      <Text>65%</Text>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>Memory Usage</Text>
                      <Text>42%</Text>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>Disk Space</Text>
                      <Text>78%</Text>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardScreen;
