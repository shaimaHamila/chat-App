import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import chalk from "chalk";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import User from "../models/User";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { fetchConversations } from "../controller/ConversationController";

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

      //Get previous messages
      const conversationMessages = await Conversation.findOne({
        $or: [
          {
            sender: id,
            receiver: currentUser?._id?.toString(),
          },
          {
            sender: currentUser?._id?.toString(),
            receiver: id,
          },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message-user-details", payload);
      socket.emit("message", conversationMessages?.messages);
    });

    //Send message
    socket.on("new_message", async (message) => {
      //Check if the conversation is available

      let conversation = await Conversation.findOne({
        $or: [
          {
            sender: message?.receiver.toString(),
            receiver: message?.sender.toString(),
          },
          {
            sender: message?.sender.toString(),
            receiver: message?.receiver.toString(),
          },
        ],
      });

      if (!conversation) {
        const newConversation = new Conversation({
          sender: currentUser?._id,
          receiver: message?.receiver,
        });
        conversation = await newConversation.save();
      }

      const newMessage = new Message({
        text: message?.text,
        imagesUrl: message?.imagesUrl,
        videosUrl: message?.videosUrl,
        sender: message?.sender,
        receiver: message?.receiver,
      });
      const savedMessage = await newMessage.save();

      await Conversation.updateOne(
        { _id: conversation?._id },
        {
          $push: { messages: savedMessage?._id },
        }
      );

      const getConversation = await Conversation.findById(conversation?._id)
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(message?.receiver?.toString()).emit(
        "message",
        getConversation?.messages
      );
      io.to(message?.sender?.toString()).emit(
        "message",
        getConversation?.messages
      );

      //Send Conversations
      const conversationsSender = await fetchConversations(message?.sender);
      const conversationsReceiver = await fetchConversations(message?.receiver);
      io.to(message?.sender?.toString()).emit(
        "conversation",
        conversationsSender
      );
      io.to(message?.receiver?.toString()).emit(
        "conversation",
        conversationsReceiver
      );
    });

    //Sidebar List of conversations

    socket.on("sidebar", async (currentUserId) => {
      console.log("current User Id", currentUserId);
      const conversations = await fetchConversations(currentUserId);
      socket.emit("conversation", conversations);
    });
    socket.on("seen", async (mesgByUserId) => {
      let conversation = await Conversation.findOne({
        $or: [
          {
            sender: currentUser?._id.toString(),
            receiver: mesgByUserId?.sender.toString(),
          },
          {
            sender: mesgByUserId?.sender.toString(),
            receiver: currentUser?._id.toString(),
          },
        ],
      });
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
