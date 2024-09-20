import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import chalk from "chalk";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import User from "../models/User";

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

    const token = socket.handshake.auth.token;

    //Get current user data
    const user: any = await getUserDetailsFromToken(token);

    //Create Room
    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());

    io.emit("onlineUser", Array.from(onlineUser));

    socket.on("message-page", async (id) => {
      console.log("id: ", id);
      const userDetails = await User.findById(id).select("-password");
      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(id),
      };
      socket.emit("message-user", payload);
    });

    //Disconnect
    socket.on("disconnect", () => {
      onlineUser.delete(user?._id);
      console.log(chalk.red("Disconnect user", socket.id));
    });
  });
  return { server, io };
};
export default SocketConnect;
