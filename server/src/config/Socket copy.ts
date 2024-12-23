import { encrypt } from "./../helpers/helpers";
import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import chalk from "chalk";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

const SocketConnect = (app: express.Application) => {
  console.log(chalk.green("Socket is running... 🥳"));

  // Socket connection
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  //Online user
  const onlineUser = new Set();

  io.on("connection", async (socket: Socket) => {
    console.log(chalk.green("Connect User", socket.id));

    socket.on("joinRoom", () => {
      const token = socket.handshake.auth.token;

      try {
        if (token) {
          const currentUser = encrypt.verifyToken(token);
          if (currentUser) {
            socket.join(currentUser.id?.toString());
            onlineUser.add(currentUser.id?.toString());
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
      console.log(chalk.red("Disconnect user", socket.id));
    });
  });
  return { server, io };
};
export default SocketConnect;
