import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import Message from "../models/Message";

export const createConversation = async (req: Request, res: Response) => {
  const { receiver } = req.body;
  const token = req.cookies.token || "";

  const currentUser = await getUserDetailsFromToken(token);
  if (!currentUser) {
    return res.status(401).json({
      message: "Unauthorized. Invalid or missing token.",
      success: false,
    });
  }
  try {
    const existingConversation = await Conversation.findOne({
      $or: [
        { currentUser, receiver },
        { sender: receiver, receiver: currentUser },
      ],
    });

    if (existingConversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        data: existingConversation,
        success: true,
      });
    }

    const conversation = new Conversation({ currentUser, receiver });
    const savedConversation = await conversation.save();

    return res.status(201).json({
      message: "Conversation created successfully",
      data: savedConversation,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const getConversationById =
  (io: any) => async (req: Request, res: Response) => {
    const { id } = req.params;
    const token = req.cookies.token || "";

    const currentUser = await getUserDetailsFromToken(token);
    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized. Invalid or missing token.",
        success: false,
      });
    }
    try {
      // Find the conversation by ID
      const conversation = await Conversation.findById(id)
        .populate("messages")
        .populate("sender", "name profile_pic")
        .populate("receiver", "name profile_pic");

      if (!conversation) {
        return res.status(404).json({
          message: "Conversation not found.",
          error: true,
        });
      }

      // Mark all unseen messages in the conversation as seen
      await Message.updateMany(
        {
          _id: { $in: conversation?.messages },
          sender: { $ne: currentUser?._id }, // Assume req.userId contains the current user's ID
          seen: false,
        },
        { $set: { seen: true } }
      );

      // Fetch the updated conversation with messages
      const updatedConversation = await Conversation.findById(id)
        .populate("messages")
        .populate("sender", "name profile_pic")
        .populate("receiver", "name profile_pic");

      // Calculate unseen message count for the response
      const unseenMessageCount = updatedConversation?.messages?.reduce(
        (count: number, message: any) =>
          message.sender.toString() !== currentUser?._id && !message?.seen
            ? count + 1
            : count,
        0
      );

      // Prepare the response structure
      const responseConversation = {
        _id: updatedConversation?._id,
        sender: updatedConversation?.sender,
        receiver: updatedConversation?.receiver,
        unseenMessageCount,
        lastMessage:
          updatedConversation?.messages[
            updatedConversation?.messages.length - 1
          ],
      };
      const getconversation = {
        _id: updatedConversation?._id,
        sender: updatedConversation?.sender,
        receiver: updatedConversation?.receiver,
        unseenMessageCount,
        messages: updatedConversation?.messages,
        lastMessage:
          updatedConversation?.messages[
            updatedConversation?.messages.length - 1
          ],
      };
      io.to(currentUser?._id).emit("conversationUpdate", responseConversation);

      return res.status(200).json({
        message: "Conversation retrieved successfully.",
        data: getconversation,
        success: true,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error?.message || "Internal server error.",
        error: true,
      });
    }
  };

export const getConversationByUserId =
  (io: any) => async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "User ID is required.",
        error: true,
      });
    }

    const token = req.cookies.token || "";

    const currentUser = await getUserDetailsFromToken(token);
    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized. Invalid or missing token.",
        success: false,
      });
    }

    try {
      const conversation = await Conversation.findOne({
        $or: [
          { sender: currentUser._id, receiver: id },
          { sender: id, receiver: currentUser._id },
        ],
      })
        .populate("messages")
        .populate("sender", "name profile_pic")
        .populate("receiver", "name profile_pic");

      if (!conversation) {
        return res.status(404).json({
          message: "Conversation not found.",
          error: true,
        });
      }

      // Efficiently mark all unseen messages as seen in the database
      await Message.updateMany(
        {
          _id: { $in: conversation.messages },
          sender: { $ne: currentUser._id },
          seen: false,
        },
        { $set: { seen: true } }
      );

      // Fetch the updated conversation with messages
      const updatedConversation = await Conversation.findById(conversation._id)
        .populate("messages")
        .populate("sender", "name profile_pic")
        .populate("receiver", "name profile_pic");

      const unseenMessageCount = updatedConversation?.messages?.reduce(
        (count: number, message: any) =>
          message.sender.toString() !== currentUser._id.toString() &&
          !message.seen
            ? count + 1
            : count,
        0
      );

      const responseConversation = {
        _id: updatedConversation?._id,
        sender: updatedConversation?.sender,
        receiver: updatedConversation?.receiver,
        messages: updatedConversation?.messages,
        unseenMessageCount,
        lastMessage:
          updatedConversation?.messages[
            updatedConversation?.messages.length - 1
          ],
      };
      const updatedConversationRes = {
        _id: updatedConversation?._id,
        sender: updatedConversation?.sender,
        receiver: updatedConversation?.receiver,
        unseenMessageCount,
        lastMessage:
          updatedConversation?.messages[
            updatedConversation?.messages.length - 1
          ],
      };

      io.to(currentUser._id.toString()).emit(
        "conversationUpdate",
        updatedConversationRes
      );
      return res.status(200).json({
        message: "Conversation retrieved successfully.",
        data: responseConversation,
        success: true,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error?.message || "Internal server error.",
        error: true,
      });
    }
  };

export const fetchUserConversations =
  (io: any) => async (req: Request, res: Response) => {
    const token = req.cookies.token || "";

    try {
      const currentUser = await getUserDetailsFromToken(token);
      if (!currentUser) {
        return res.status(401).json({
          message: "Unauthorized. Invalid or missing token.",
          success: false,
        });
      }

      const currentUserConversations = await Conversation.find({
        $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
      })
        .sort({ updatedAt: -1 })
        .populate("messages")
        .populate("sender", "name profile_pic")
        .populate("receiver", "name profile_pic");

      const conversations = currentUserConversations.map(
        (conversation: any) => {
          const unseenMessageCount = conversation.messages.reduce(
            (count: number, message: any) => {
              return message.sender.toString() !== currentUser._id.toString() &&
                !message.seen
                ? count + 1
                : count;
            },
            0
          );

          return {
            _id: conversation._id,
            sender: conversation.sender,
            receiver: conversation.receiver,
            unseenMessageCount,
            lastMessage:
              conversation.messages[conversation.messages.length - 1],
          };
        }
      );
      // io.to(currentUser._id?.toString()).emit("conversations", conversations);
      return res.status(200).json({
        message: "Conversations fetched successfully.",
        data: conversations,
        success: true,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error?.message || "Internal server error.",
        success: false,
      });
    }
  };

export const fetchConversations = async (userId: any) => {
  if (userId) {
    const currentUserConversations = await Conversation.find({
      $or: [
        {
          sender: userId,
        },
        {
          receiver: userId,
        },
      ],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversations = currentUserConversations.map((conversation) => {
      const countUnseenMessage = conversation?.messages?.reduce(
        (prev: any, curr: any) => {
          if (curr?.sender._id.toString() !== userId.toString()) {
            return prev + (curr?.seen === false ? 1 : 0);
          } else {
            return prev;
          }
        },
        0
      );
      return {
        _id: conversation?._id,
        sender: conversation?.sender,
        receiver: conversation?.receiver,
        unseenMessageCount: countUnseenMessage,
        lastMessage: conversation?.messages[conversation?.messages?.length - 1],
      };
    });
    return conversations;
  } else {
    return [];
  }
};

// Update a conversation with a new message
export const updateConversation =
  (io: any) => async (req: Request, res: Response) => {
    const { id } = req.params; // Conversation ID
    const { text, imagesUrl, videosUrl, receiver } = req.body; // Message details
    const token = req.cookies.token || "";

    try {
      // Validate user authentication
      const currentUser = await getUserDetailsFromToken(token);
      if (!currentUser) {
        return res.status(401).json({
          message: "Unauthorized. Invalid or missing token.",
          success: false,
        });
      }
      // Find the conversation by ID
      // let conversation = await Conversation.findById(id)
      //   .populate("messages")
      //   .populate("sender")
      //   .populate("receiver");

      // Find the conversation by user ID
      let conversation = await Conversation.findOne({
        $or: [
          { sender: currentUser._id, receiver: id },
          { sender: id, receiver: currentUser._id },
        ],
      })
        .populate("messages")
        .populate("sender", "name profile_pic")
        .populate("receiver", "name profile_pic");

      if (!conversation) {
        conversation = new Conversation({
          sender: currentUser._id,
          receiver,
          messages: [],
        });
        await conversation.save();
      }
      // Ensure the current user is part of the conversation
      if (
        conversation.sender._id.toString() !== currentUser._id.toString() &&
        conversation.receiver._id.toString() !== currentUser._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to send messages in this conversation.",
          success: false,
        });
      }

      // Create a new message
      const newMessage = new Message({
        text,
        imagesUrl,
        videosUrl,
        sender: currentUser._id, // Sender is always the current user
        receiver,
      });
      const savedMessage = await newMessage.save();

      // Add the new message to the conversation
      conversation?.messages?.push(savedMessage._id);
      await conversation.save();

      // Re-fetch the updated conversation with populated fields
      const updatedConversation = await Conversation.findById(id)
        .populate("messages")
        .populate("sender", "name profile_pic")
        .populate("receiver", "name profile_pic");

      // Calculate unseenMessageCount (number of unseen messages for the current user)
      const unseenMessageCount = updatedConversation?.messages?.filter(
        (message: any) => {
          return (
            !message.isSeen &&
            message.receiver.toString() === currentUser._id.toString()
          );
        }
      ).length;

      // Extract the last message from the conversation
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];

      // Format the response as per the required structure
      const formattedConversation = {
        _id: conversation._id,
        sender: conversation.sender,
        receiver: conversation.receiver,
        messages: conversation.messages,
        unseenMessageCount,
        lastMessage,
      };

      //Send Conversations
      const conversationsSender = await fetchConversations(
        conversation?.sender?._id
      );
      const conversationsReceiver = await fetchConversations(
        conversation?.receiver?._id
      );
      io.to(conversation?.sender?._id?.toString()).emit(
        "getConversations",
        conversationsSender
      );
      io.to(conversation?.receiver?._id?.toString()).emit(
        "getConversations",
        conversationsReceiver
      );

      // Emit the new message to both sender and receiver via socket
      io.to(conversation?.sender?._id?.toString()).emit(
        "newMessage",
        savedMessage
      );
      io.to(conversation?.receiver?._id?.toString()).emit(
        "newMessage",
        savedMessage
      );
      return res.status(200).json({
        message: "Message added and conversation updated successfully.",
        data: formattedConversation, // Return the formatted conversation
        success: true,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error?.message || "Internal server error.",
        error: true,
      });
    }
  };

// Delete a conversation
export const deleteConversation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedConversation = await Conversation.findByIdAndDelete(id);
    if (!deletedConversation) {
      return res.status(404).json({
        message: "Conversation not found",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Conversation deleted successfully",
      data: deletedConversation,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};
