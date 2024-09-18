import { Route, Routes } from "react-router-dom";
import Chat from "../pages/Chat/Chat";

import DashboardLayout from "../pages/DashboardLayout/DashboardLayout";

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<DashboardLayout />}>
        <Route path='*' element={<Chat />} />
        <Route path='/chat' element={<Chat />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
