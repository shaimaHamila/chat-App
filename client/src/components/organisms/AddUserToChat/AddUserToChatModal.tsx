import { Avatar, Badge, Button, Checkbox, List, Modal } from "antd";
import { SearchProps } from "antd/es/input";
import Search from "antd/es/input/Search";
import { useState } from "react";
import { User } from "../../../types/User";
import { UserOutlined } from "@ant-design/icons";
import "./AddUserToChatModal.scss";
export interface AddUserToChatModalProps {
  isAddUserToChatModalOpen: boolean;
  onAddUserToChat: (userId: number | null) => void;
  handleClose: () => void;
  isloading: boolean;
  users: User[];
  onlineUsers: String[];
  onSearchUserChange: (searchedDeliveruId: string) => void;
}

const AddUserToChatModal: React.FC<AddUserToChatModalProps> = ({
  isAddUserToChatModalOpen,
  onAddUserToChat,
  handleClose,
  isloading,
  users,
  onlineUsers,
  onSearchUserChange,
}: AddUserToChatModalProps) => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleItemClick = (id: number) => {
    setSelectedUser((prevSelected) => (prevSelected === id ? null : id));
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    value === "" ? onSearchUserChange("") : onSearchUserChange(value);
  };
  return (
    <Modal title='Add user to chat' open={isAddUserToChatModalOpen} footer={null} onCancel={handleClose}>
      <Search
        className='orders-container--header-actions-search'
        placeholder='Chercher avec nom de livreur'
        allowClear
        onSearch={onSearch}
      />
      <div id='scrollableDiv' className='user-list-container'>
        <List
          className='demo-loadmore-list'
          loading={isloading}
          itemLayout='horizontal'
          dataSource={users}
          renderItem={(item: User) => (
            <List.Item
              key={item._id}
              onClick={() => handleItemClick(item._id)}
              className={selectedUser === item._id ? "selected-item" : ""}
              actions={[
                <Checkbox
                  key='select'
                  checked={selectedUser === item._id}
                  onChange={() => handleItemClick(item._id)}
                  onClick={(e) => e.stopPropagation()} // Prevent triggering the onClick of the List.Item
                />,
              ]}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                style={{ padding: "0 10px" }}
                avatar={
                  <Badge color='green' dot={onlineUsers.includes(item?._id)}>
                    <Avatar src={item?.profile_pic} icon={<UserOutlined />} />
                  </Badge>
                }
                title={item.name}
                description={"Email: " + item?.email}
              />
            </List.Item>
          )}
        />
      </div>
      <div className='user-list-btns'>
        <Button
          type='primary'
          onClick={() => {
            // if (selectedPerson !== null) {
            onAddUserToChat(selectedUser);
            // }
          }}
          // disabled={selectedPerson === null}
        >
          Add User To Chat
        </Button>
        <Button
          danger
          onClick={() => {
            setSelectedUser(null);
            handleClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default AddUserToChatModal;
