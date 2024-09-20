import { Route, Routes } from "react-router-dom";
import Chat from "../pages/Chat/Chat";

import DashboardLayout from "../pages/DashboardLayout/DashboardLayout";
import MessageSection from "../pages/Chat/MessagesPage/MessagesPage";
import { Empty } from "antd";
import { fetchCurrentUser } from "../features/auth/authSlice";
import { useEffect } from "react";
import { store } from "../store/store";

const PrivateRoutes = () => {
  useEffect(() => {
    store.dispatch(fetchCurrentUser());
  }, []);
  return (
    <Routes>
      <Route path='/' element={<DashboardLayout />}>
        <Route path='*' element={<div>Page Not Found</div>} />
        <Route path='/' element={<div>Go To chat page /chat</div>} />
        <Route path='chat' element={<Chat />}>
          <Route
            index
            element={<Empty description='Welcome to Chat Start a conversation' className='center-the-content' />}
          />
          <Route path=':id' element={<MessageSection />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
