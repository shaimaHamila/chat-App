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

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing email or password",
        error: true,
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user doesn't exist
    if (!user) {
      return res.status(404).json({
        message: "Email not found",
        error: true,
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = encrypt.comparepassword(user.password, password);

    // If password is incorrect
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
      });
    }

    // Generate JWT token
    const tokenData = { id: user._id, email: user.email };
    const token = encrypt.generateToken(tokenData);

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Ensure this is set to true in production
    };

    // Send the JWT token in a cookie and return success response
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        message: "Login successfully",
        data: { id: user._id, email: user.email, name: user.name }, // Send only necessary data
        token,
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
