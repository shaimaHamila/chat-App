import { Router } from "express";
import {
  logout,
  registerUser,
  verifyEmail,
  verifyPassword,
} from "../controller/AuthController";

const AuthRouter = Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/email", verifyEmail);
AuthRouter.post("/password", verifyPassword);
AuthRouter.get("/logout", logout);

export default AuthRouter;
