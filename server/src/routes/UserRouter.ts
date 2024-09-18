import { getUsers } from "../controller/UserController";
import { Router } from "express";
import { updateUser, userDetails } from "../controller/UserController";

const UserRouter = Router();

UserRouter.get("/details", userDetails);
UserRouter.post("/update", updateUser);
UserRouter.get("/all-users", getUsers);

export default UserRouter;
