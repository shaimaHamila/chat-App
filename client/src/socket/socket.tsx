import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { store } from "../store/store";
import { setOnlineUsers } from "../features/user/userSlice";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUserId } from "../features/auth/authSlice";

// Create a context for Socket
export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const currentUserId = useAppSelector(selectCurrentUserId);

  const token = localStorage.getItem("token");
  useEffect(() => {
    console.log("SocketProvider currentUserId", currentUserId);
    if (currentUserId) {
      // Create a new socket connection
      const newSocketConnection = io(import.meta.env.VITE_BACKEND_URL, {
        auth: { token },
      });
      console.log("if currentUserId", currentUserId);

      // Handle socket events
      newSocketConnection.on("connect", () => {
        newSocketConnection.on("onlineUser", (onlineUsers: string[]) => {
          store.dispatch(setOnlineUsers(onlineUsers));
        });
      });

      if (socketInstance) {
        socketInstance.disconnect();
      }
      // Set the new socket instance
      setSocketInstance(newSocketConnection);
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return <SocketContext.Provider value={socketInstance}>{children}</SocketContext.Provider>;
};
