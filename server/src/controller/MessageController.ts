import { createMessageValidator } from "./../validators/MessageValidator";
import { Request, Response } from "express";
import Message from "../models/Message";
import Conversation from "../models/Conversation";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
// Create a new message
export const createMessage = async (req: Request, res: Response) => {
  try {
    // Extract sender from token
    const token = req.cookies.token || "";
    const currentUser = await getUserDetailsFromToken(token);

    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
        success: false,
      });
    }

    const sender = currentUser._id; // Current user is the sender
    // Validate request body
    const { error } = createMessageValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        success: false,
      });
    }
    const { text, imagesUrl, videosUrl, receiver } = req.body;
    const newMessage = new Message({
      text,
      imagesUrl,
      videosUrl,
      sender,
      receiver,
    });
    const savedMessage = await newMessage.save();

    // Find or create the conversation
    let conversation = await Conversation.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    if (!conversation) {
      // Create a new conversation if none exists
      conversation = new Conversation({
        sender,
        receiver,
        messages: [savedMessage._id],
      });
    } else {
      // Update the existing conversation with the new message
      conversation.messages.push(savedMessage._id);
    }

    await conversation.save();

    return res.status(201).json({
      message: "Message created successfully",
      data: savedMessage,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

// Get a message by ID
export const getMessageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Message retrieved successfully",
      data: message,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

// Update a message
export const updateMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, seen, isDeleted } = req.body;
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { text, seen, isDeleted },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        message: "Message not found",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Message updated successfully",
      data: updatedMessage,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({
        message: "Message not found",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Message deleted successfully",
      data: deletedMessage,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};
