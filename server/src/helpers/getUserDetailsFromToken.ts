import User from "../models/User";
import { encrypt } from "./helpers";

const getUserDetailsFromToken = async (token: string) => {
  try {
    if (!token) {
      throw new Error("Session expired. Please log in again.");
    }
    const decoded = encrypt.verifyToken(token);

    if (typeof decoded === "string" || !("id" in decoded)) {
      throw new Error("Invalid token. Please log in again");
    }
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new Error("User not found. Please log in again.");
    }
    return user;
  } catch (error: any) {
    throw new Error("Error fetching user details:");
  }
};

export default getUserDetailsFromToken;
