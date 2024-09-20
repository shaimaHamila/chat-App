import {
  getCurrentUserDetails,
  getUsers,
  updateUser,
} from "../controller/UserController";
import { Router } from "express";

const UserRouter = Router();

UserRouter.get("/current-user-details", getCurrentUserDetails);
UserRouter.post("/update", updateUser);
UserRouter.get("/all-users", getUsers);

export default UserRouter;
