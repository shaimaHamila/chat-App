import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

export const createConversation = async (req: Request, res: Response) => {
  const { sender, receiver } = req.body;
  try {
    const existingConversation = await Conversation.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    if (existingConversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        data: existingConversation,
        success: true,
      });
    }

    const conversation = new Conversation({ sender, receiver });
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
export const getConversationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const conversation = await Conversation.findById(id)
      .populate("messages")
      .populate("sender")
      .populate("receiver");
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Conversation retrieved successfully",
      data: conversation,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const fetchUserConversations = async (req: Request, res: Response) => {
  const token = req.cookies.token || "";

  try {
    const user = await getUserDetailsFromToken(token);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized. Invalid or missing token.",
        success: false,
      });
    }

    const currentUserConversations = await Conversation.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender", "name profile_pic")
      .populate("receiver", "name profile_pic");

    const conversations = currentUserConversations.map((conversation: any) => {
      const unseenMessageCount = conversation.messages.reduce(
        (count: number, message: any) => {
          return message.sender.toString() !== user._id.toString() &&
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
        lastMessage: conversation.messages[conversation.messages.length - 1],
      };
    });

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

// Update a conversation
export const updateConversation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isDeleted } = req.body;
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      id,
      { isDeleted },
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({
        message: "Conversation not found",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Conversation updated successfully",
      data: updatedConversation,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
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
