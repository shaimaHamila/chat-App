import {
  getCurrentUserDetails,
  getUserById,
  getUsers,
  updateUser,
} from "../controller/UserController";
import { Router } from "express";
import { authentication } from "../middlewares/authMiddleware";

const UserRouter = Router();

UserRouter.get("/current-user-details", authentication, getCurrentUserDetails);
UserRouter.post("/update", authentication, updateUser);
UserRouter.get("/all-users", authentication, getUsers);
UserRouter.get("/:id", authentication, getUserById);

export default UserRouter;
