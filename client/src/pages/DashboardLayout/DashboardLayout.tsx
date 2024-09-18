import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import AddUserToChatModal from "../../components/organisms/AddUserToChat/AddUserToChatModal";
import UpdateProfilModal from "../../components/organisms/UpdateProfilModal/UpdateProfilModal";
import { fetchCurrentUser, logout, selectCurrentUser, updateCurrentUser } from "../../features/auth/authSlice";
import { store } from "../../store/store";
import SideBar from "../../components/templates/SideBar/SideBar";
import { useAppSelector } from "../../store/hooks";
import { fetchUsers, selectUsers, setSearchUser } from "../../features/user/userSlice";

const userMenuItems = [
  { key: "/chat", label: "Chat", icon: <MessageOutlined /> },
  // Add new User menu items here
];

const DashboardLayout = () => {
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState(false);
  const [isAddUserToChatModalOpen, setIsAddUserToChatModalOpen] = useState(false);
  const navigate = useNavigate();

  const currentUser = useAppSelector(selectCurrentUser);
  const _users = useAppSelector(selectUsers);
  // Trigger navigation to login if user is logged out
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]); // Watch for changes to currentUser

  useEffect(() => {
    store.dispatch(fetchCurrentUser());
  }, []);
  return (
    <Layout style={{ marginLeft: "80px", height: "100vh" }}>
      <SideBar
        menuItems={userMenuItems}
        userProfilePicture={currentUser?.profile_pic}
        logOut={() => {
          store.dispatch(logout()); // Dispatch the logout action
        }}
        updateProfileDetails={() => {
          setIsUpdateProfileModalOpen(true);
        }}
        addUserToChat={() => {
          store.dispatch(fetchUsers());

          setIsAddUserToChatModalOpen(true);
        }}
      />
      <Content style={{ margin: "12px" }}>
        <div
          style={{
            padding: 22,
            background: "white",
            borderRadius: "4px",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Outlet />
        </div>
      </Content>

      <AddUserToChatModal
        isAddUserToChatModalOpen={isAddUserToChatModalOpen}
        onAddUserToChat={(userId: number | null) => {
          console.log("Function not implemented, onAddUserToChat", userId);
          setIsAddUserToChatModalOpen(false);
        }}
        handleClose={() => setIsAddUserToChatModalOpen(false)}
        isloading={false}
        users={_users}
        onSearchUserChange={(userName) => store.dispatch(setSearchUser(userName))}
      />
      <UpdateProfilModal
        isUpdateProfileModalOpen={isUpdateProfileModalOpen}
        handleClose={() => {
          setIsUpdateProfileModalOpen(false);
        }}
        onUpdateProfile={(updatedUser) => {
          store.dispatch(updateCurrentUser(updatedUser));
          setIsUpdateProfileModalOpen(false);
        }}
        currentUser={currentUser!}
      />
    </Layout>
  );
};

export default DashboardLayout;
