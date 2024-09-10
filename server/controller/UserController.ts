import { Request, Response } from "express";
import User from "../models/User";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

export const userDetails = async (req: Request, res: Response) => {
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || "";
    const user: any = await getUserDetailsFromToken(token);
    const { name, profile_pic } = req.body;
    const updateUser = await User.updateOne(
      { _id: user._id },
      { name, profile_pic }
    );

    const userInfo = await User.findById(user._id).select("-password");

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
