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
    console.error("Error during user details:", error);

    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};
// export const getUserDetails = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.query;

//     return res.status(200).json({
//       message: "User details",
//       data: user,
//       success: true,
//     });
//   } catch (error: any) {
//     console.error("Error during user details:", error);

//     return res.status(500).json({
//       message: error?.message || "Internal server error",
//       error: true,
//     });
//   }
// };

export const updateUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || "";
    console.log("req.cookies.token: ", req.cookies.token);

    const user: any = await getUserDetailsFromToken(token);
    console.log("user: ", user);
    const { name, profile_pic } = req.body;
    const updatedUser = await User.updateOne(
      { _id: user._id },
      { name, profile_pic }
    );
    console.log("Updated User updatedUser: ", updatedUser);

    const userInfo = await User.findById(user._id).select("-password");
    console.log("Updated User Info: ", userInfo);
    return res.status(200).json({
      message: "User updated",
      data: userInfo,
      success: true,
    });
  } catch (error: any) {
    console.error("Error during user update:", error);

    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const searchQuery =
      typeof req.query.name === "string" ? req.query.name : "";

    const query = searchQuery
      ? { name: { $regex: new RegExp(searchQuery, "i") } }
      : {};

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
