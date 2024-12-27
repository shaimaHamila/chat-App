import { Router } from "express";

import { authentication } from "../middlewares/authMiddleware";
import {
  createMessage,
  deleteMessage,
  getMessageById,
  updateMessage,
} from "../controller/MessageController";

const MessageRouter = (io: any) => {
  const router = Router();

  router.get("/", authentication, createMessage(io));
  router.post("/add", authentication, getMessageById(io));
  router.get("/:id", authentication, updateMessage(io));
  router.get("/:id", authentication, deleteMessage);
  return router;
};

export default MessageRouter;
