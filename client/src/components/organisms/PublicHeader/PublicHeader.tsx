import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import React from "react";

const PublicHeader: React.FC = () => {
  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div className='register-logo'>Chat App</div>
      <Menu theme='dark' mode='horizontal' defaultSelectedKeys={["2"]} items={[]} style={{ flex: 1, minWidth: 0 }} />
    </Header>
  );
};

export default PublicHeader;
