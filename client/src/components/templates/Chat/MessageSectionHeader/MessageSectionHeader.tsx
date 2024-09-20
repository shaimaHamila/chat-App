import React from "react";
import { Avatar, Badge, Button } from "antd";
import "./MessageSectionHeader.scss";
import { MoreOutlined } from "@ant-design/icons";

import { UserOutlined } from "@ant-design/icons";

interface MessageSectionHeaderProps {
  userName?: string;
  userImage?: string;
  isOnline?: boolean;
}

const MessageSectionHeader: React.FC<MessageSectionHeaderProps> = ({ userName, userImage, isOnline }) => {
  return (
    <div className='header-component'>
      <div className='header-component__user'>
        <div className='header-info'>
          <Badge dot={isOnline} color='green' offset={[-4, 5]}>
            <Avatar
              src={userImage}
              icon={<UserOutlined />}
              size={36}
              style={{ backgroundColor: "#edd8ff", color: "#4a1d8a" }}
            ></Avatar>
          </Badge>
          <div className='header-info-text'>
            <h3 className='header--user-name'>{userName}</h3>
            <h5 className='header--user-status' style={{ color: isOnline ? "#68d391" : "#9d9d9d" }}>
              {isOnline ? "Online" : "Offline"}
            </h5>
          </div>
        </div>
        <div className='header-actions'>
          <Button icon={<MoreOutlined />}></Button>
        </div>
      </div>
    </div>
  );
};

export default MessageSectionHeader;
