import User from "../models/User";
import { encrypt } from "./helpers";

const getUserDetailsFromToken = async (token: string) => {
  try {
    if (!token) {
      return {
        message: "Session expired. Please log in again.",
        logout: true,
      };
    }

    const decoded = encrypt.verifyToken(token);

    if (typeof decoded === "string" || !("id" in decoded)) {
      return {
        message: "Invalid token. Please log in again.",
        logout: true,
      };
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return {
        message: "User not found. Please log in again.",
        logout: true,
      };
    }

    return user;
  } catch (error: any) {
    console.error("Error fetching user details:", error);

    return {
      message:
        "An error occurred while verifying session. Please log in again.",
      logout: true,
    };
  }
};

export default getUserDetailsFromToken;
