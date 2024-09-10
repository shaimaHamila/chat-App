import { Request, Response } from "express";
import User from "../models/User";
import { encrypt } from "../helpers/helpers";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, profile_pic } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields", error: true });
    }

    // Check if email already exists
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists", error: true });
    }

    // Encrypt password
    const encryptedPassword = await encrypt.encryptpass(password);

    // Prepare user payload
    const payload = {
      name,
      email,
      password: encryptedPassword,
      profile_pic,
    };

    // Save new user to the database
    const newUser = new User(payload);
    const userSave = await newUser.save();

    // Return success response
    return res.status(201).json({
      message: "User created successfully",
      data: userSave,
      success: true,
    });
  } catch (error: any) {
    console.error("Error during user registration:", error);

    // Return error response
    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Missing email", error: true });
    }

    const checkEmail = await User.findOne({ email }).select("-password");

    if (!checkEmail) {
      return res.status(404).json({ message: "Email not found", error: true });
    }

    return res.status(200).json({
      message: "Email found",
      data: checkEmail,
      success: true,
    });
  } catch (error: any) {
    console.error("Error during email verification:", error);

    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const verifyPassword = async (req: Request, res: Response) => {
  try {
    const { password, id } = req.body;

    if (!password || !id) {
      return res
        .status(400)
        .json({ message: "Missing password or id", error: true });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true });
    }

    const verifyPassword = encrypt.comparepassword(user.password, password);

    if (!verifyPassword) {
      return res.status(400).json({ message: "Invalid password", error: true });
    }
    // Generate JWT token
    const tokenData = { id: user._id, email: user.email };
    const token = encrypt.generateToken(tokenData);
    const cookisOptions = {
      http: true,
      secure: true,
    };
    return res.cookie("token", token, cookisOptions).status(200).json({
      message: "Login successfully",
      data: user,
      success: true,
    });
  } catch (error: any) {
    console.error("Error during email verification:", error);

    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const cookieOptions = {
      http: true,
      secure: true,
    };
    return res.clearCookie("token", cookieOptions).status(200).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error during logout:", error);

    return res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
    });
  }
};
