import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRouts";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchCurrentUser, selectCurrentUser } from "./features/auth/authSlice";
import { Loading } from "./components/atoms/Loading/Loading";
import { SocketProvider } from "./socket/socket";

function App() {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem("user");
      if (token) {
        await dispatch(fetchCurrentUser());
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route
            path='*'
            element={
              currentUser ? (
                <SocketProvider>
                  <PrivateRoutes />
                </SocketProvider>
              ) : (
                <PublicRoutes />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
