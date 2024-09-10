import { Router } from "express";
import { updateUser, userDetails } from "../controller/UserController";
import User from "../models/User";

const UserRouter = Router();

UserRouter.get("/details", userDetails);
UserRouter.post("/update", updateUser);

export default UserRouter;
