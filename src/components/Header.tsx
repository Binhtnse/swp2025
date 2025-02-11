import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
  const menuItems = [
    {
      key: 'surveys',
      label: <Link to="/surveys" className="!text-white hover:!text-primary">Các bài khảo sát</Link>,
    },
    {
      key: 'support',
      label: <Link to="/support-programs" className="!text-white hover:!text-primary">Các chương trình hỗ trợ</Link>,
    },
    {
      key: 'experts',
      label: <Link to="/experts" className="!text-white hover:!text-primary">Danh sách chuyên gia tâm lí</Link>,
    },
    {
      key: 'resources',
      label: <Link to="/resources" className="!text-white hover:!text-primary">Tài nguyên</Link>,
    },
    {
      key: 'auth',
      label: <Link to="/auth" className="!text-white hover:!text-primary">Đăng nhập/Đăng kí</Link>,
    },
  ];

  return (
    <AntHeader className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="text-2xl font-bold hover:opacity-80 transition-opacity">
          <Link to="/" className="text-primary flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span>Logo</span>
          </Link>
        </div>
        <Menu
          mode="horizontal"
          items={menuItems}
          className="border-none flex-1 justify-end min-w-[600px]"
          style={{
            backgroundColor: 'transparent',
            fontSize: '16px',
          }}
        />
      </div>
    </AntHeader>
  );
};

export default Header;
