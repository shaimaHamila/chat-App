import { Request, Response } from "express";
import User from "../models/User";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

export const getCurrentUserDetails = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);

    return res.status(200).json({
      message: "User details",
      data: user,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("id: ", id);
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "User Not exist",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
      success: true,
    });
  } catch (error: any) {
    console.error("Error during user details:", error);

    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, profile_pic } = req.body;
  try {
    const token = req.cookies.token || "";
    console.log("req.cookies.token: ", req.cookies.token);

    const user = await getUserDetailsFromToken(token);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, profile_pic },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "User updated",
      data: updatedUser,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || "";
    console.log("req.cookies.token: ", req.cookies.token);

    const user = await getUserDetailsFromToken(token);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        error: true,
      });
    }

    const currentUserId = user._id;

    const searchQuery =
      typeof req.query.name === "string" ? req.query.name : "";

    // Add condition to exclude the current user
    const query = {
      ...(searchQuery
        ? { name: { $regex: new RegExp(searchQuery, "i") } }
        : {}),
      _id: { $ne: currentUserId }, // Exclude the current user by their ID
    };

    const users = await User.find(query).select("-password");
    const totalCount = await User.countDocuments(query);

    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
      totalCount: totalCount,
      success: true,
    });
  } catch (error: any) {
    console.error("Error during user search:", error);

    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};
