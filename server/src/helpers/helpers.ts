import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

export class encrypt {
  static async encryptpass(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(tokenData: any) {
    if (!process.env.JWT_TOKEN_SECRET)
      throw new Error("TOKEN_SECRET is undefined");
    return jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXP_IN,
    });
  }
  static verifyToken(token: any) {
    if (!process.env.JWT_TOKEN_SECRET)
      throw new Error("TOKEN_SECRET is undefined");
    return jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  }
  static generateRefreshToken(tokenData: any) {
    if (!process.env.JWT_REFRESH_TOKEN_SECRET)
      throw new Error("REFRESH_TOKEN_SECRET is undefined");
    return jwt.sign(tokenData, process.env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXP_IN,
    });
  }
}
