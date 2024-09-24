import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRouts";
import { useAppSelector } from "./store/hooks";
import { fetchCurrentUser, selectCurrentUser } from "./features/auth/authSlice";
import { Loading } from "./components/atoms/Loading/Loading";
import { SocketProvider } from "./socket/socket";
import { store } from "./store/store";

function App() {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const token: any = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        store.dispatch(fetchCurrentUser());
        setIsLoading(false);
      } catch (error) {
        // If an error occurs, reset the current user state and remove tokens
        localStorage.removeItem("token");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

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
