import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import chalk from "chalk";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import User from "../models/User";
import Conversation from "../models/Conversation";
import Message from "../models/Message";

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
    const currentUser: any = await getUserDetailsFromToken(token);

    //Create Room
    socket.join(currentUser?._id?.toString());
    onlineUser.add(currentUser?._id?.toString());

    io.emit("onlineUser", Array.from(onlineUser));

    socket.on("message-page", async (id) => {
      //Get the other user details
      console.log("id: ", id);
      const userDetails = await User.findById(id).select("-password");
      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(id),
      };
      socket.emit("message-user-details", payload);
    });

    //Send message
    socket.on("new_message", async (message) => {
      //Check if the conversation is available

      console.log(
        chalk.bgCyan("new_message", JSON.stringify(message, null, 2))
      );

      let conversation = await Conversation.findOne({
        "&or": [
          { sender: message?.reciver, reciver: message?.sender },
          { sender: message?.sender, reciver: message?.reciver },
        ],
      });

      if (!conversation) {
        const newConversation = new Conversation({
          sender: currentUser?._id,
          reciver: message?.reciver,
        });
        conversation = await newConversation.save();
      }

      const newMessage = new Message({
        text: message?.text,
        imagesUrl: message?.imagesUrl,
        videosUrl: message?.videosUrl,
        sender: message?.sender,
        reciver: message?.reciver,
      });
      const savedMessage = await newMessage.save();

      const updateConversation = await Conversation.updateOne(
        { _id: conversation?._id },
        {
          $push: { messages: savedMessage?._id },
        }
      );

      const getConversation = await Conversation.findById(conversation?._id);

      console.log(chalk.bgGreen("Conversation", getConversation));
      // io.to(message.reciver).emit(
      //   "new_message",
      //   JSON.stringify(message, null, 2)
      // );
    });

    //Disconnect
    socket.on("disconnect", () => {
      onlineUser.delete(currentUser?._id);
      console.log(chalk.red("Disconnect user", socket.id));
    });
  });
  return { server, io };
};
export default SocketConnect;
