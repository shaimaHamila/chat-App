import { encrypt } from "../helpers/helpers";
import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import chalk from "chalk";

const SocketConnect = (app: express.Application) => {
  console.log(chalk.green("Socket is running... 🥳"));

  // Socket connection
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    },
  });

  //Online user
  const onlineUser = new Set();

  io.on("connection", async (socket: Socket) => {
    console.log(chalk.green("Connect User", socket.id));
    socket.on("joinRoom", () => {
      const token = socket.handshake.auth.token;
      console.log(chalk.green("Connect User", socket.id));
      try {
        if (token) {
          const currentUser = encrypt.verifyToken(token);
          if (currentUser) {
            socket.join(currentUser.id?.toString());
            onlineUser.add(currentUser.id?.toString());
            socket.data.currentUser = currentUser;
            io.emit("onlineUser", Array.from(onlineUser));
          }
        }
      } catch (error) {
        console.log("User has encountered an error! 😱");
        socket.emit("error", error);
        socket.disconnect(true);
      }
    });

    //Disconnect
    socket.on("disconnect", () => {
      const currentUser = socket.data.currentUser;
      onlineUser.delete(currentUser?.id?.toString());
      io.emit("onlineUser", Array.from(onlineUser));
      console.log(chalk.red("Disconnect user", socket.id));
    });
  });
  return { server, io };
};
export default SocketConnect;
