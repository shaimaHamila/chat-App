import { Router } from "express";
import { logout, registerUser, Login } from "../controller/AuthController";

const AuthRouter = Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", Login);
AuthRouter.get("/logout", logout);

export default AuthRouter;
