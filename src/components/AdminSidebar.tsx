import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FormOutlined,
  HeartOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="min-h-screen bg-white shadow-md"
      width={250}
    >
      <div className="flex justify-center items-center h-16 border-b border-gray-200">
        <h1 className={`text-blue-600 font-bold ${collapsed ? 'text-sm' : 'text-xl'}`}>
          {collapsed ? 'Admin' : 'Trang Quản Trị'}
        </h1>
      </div>
      
      <div className="p-3 flex justify-end">
        <button 
          onClick={toggleCollapsed} 
          className="text-gray-500 hover:text-blue-500"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        selectedKeys={[location.pathname.split('/')[2] || 'dashboard']}
        className="border-r-0"
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/admin/dashboard">Bảng Điều Khiển</Link>
        </Menu.Item>
        
        <Menu.Item key="users" icon={<UserOutlined />}>
          <Link to="/admin/users">Quản Lý Người Dùng</Link>
        </Menu.Item>
        
        <Menu.Item key="psychologists" icon={<TeamOutlined />}>
          <Link to="/admin/psychologists">Quản Lý Chuyên Gia Tâm Lý</Link>
        </Menu.Item>
        
        <Menu.Item key="surveys" icon={<FormOutlined />}>
          <Link to="/admin/surveys">Quản Lý Khảo Sát</Link>
        </Menu.Item>
        
        <Menu.Item key="support-programs" icon={<HeartOutlined />}>
          <Link to="/admin/support-programs">Quản Lý Chương Trình Hỗ Trợ</Link>
        </Menu.Item>
        
        <SubMenu 
          key="resources" 
          icon={<FileTextOutlined />} 
          title="Quản Lý Tài Nguyên"
        >
          <Menu.Item key="blogs">
            <Link to="/admin/resources/blogs">Quản Lý Bài Viết</Link>
          </Menu.Item>
          <Menu.Item key="documents">
            <Link to="/admin/resources/documents">Quản Lý Tài Liệu</Link>
          </Menu.Item>
        </SubMenu>
        
        <Menu.Item key="appointments" icon={<CalendarOutlined />}>
          <Link to="/admin/appointments">Quản Lý Lịch Hẹn</Link>
        </Menu.Item>
      </Menu>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            A
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-500">Quản trị viên</p>
            </div>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default AdminSidebar;
