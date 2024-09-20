import { Avatar, Badge, Button, Layout, Menu, MenuProps } from "antd";
import { LogoutOutlined, UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SideBar.scss";
type MenuItem = {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
  onClick?: () => void;
};

interface SideBarProps {
  menuItems: MenuItem[];
  logOut: () => void;
  updateProfileDetails: () => void;
  addUserToChat: () => void;
  userProfilePicture?: string;
}
const SideBar: React.FC<SideBarProps> = ({
  menuItems,
  logOut,
  addUserToChat,
  updateProfileDetails,
  userProfilePicture,
}: SideBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);
  return (
    <Layout.Sider className='side-menu--container ant-layout-sider' collapsed={true}>
      <div className='side-menu-flex'>
        <div className='side-menu'>
          <div className='side-menu--header'>
            <img
              className={`side-menu--header-logo`}
              src='/logo/astrolab.png'
              alt='vanlog logo'
              style={{ maxWidth: "3rem" }}
            />
          </div>
          <div>
            <Menu
              selectedKeys={[selectedKey]}
              theme='dark'
              mode='inline'
              onClick={(item) => {
                navigate(item.key.toString());
                setSelectedKey(item.key.toString());
              }}
              items={menuItems as MenuProps["items"]}
              className='side-menu--menu'
            />
            <Button onClick={addUserToChat} className='side-menu--logout' ghost size={"large"}>
              <UserAddOutlined />
            </Button>
          </div>
        </div>
        <div className='side-menu--bottom-section'>
          <Button onClick={updateProfileDetails} className='side-menu--logout' ghost size={"large"}>
            <Badge dot>
              <Avatar src={userProfilePicture} size='large' icon={<UserOutlined />} />
            </Badge>
          </Button>
          <Button onClick={logOut} className='side-menu--logout' ghost size={"large"}>
            <LogoutOutlined />
          </Button>
        </div>
      </div>
    </Layout.Sider>
  );
};

export default SideBar;
