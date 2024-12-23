import { Router } from "express";
import { logout, registerUser, Login } from "../controller/AuthController";

const AuthRouter = (io: any) => {
  const router = Router();

  router.post("/register", registerUser);
  router.post("/login", Login(io));
  router.get("/logout", logout(io));

  return router;
};

export default AuthRouter;
