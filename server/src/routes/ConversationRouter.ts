import { Router } from "express";
import {
  createConversation,
  deleteConversation,
  fetchUserConversations,
  getConversationById,
  updateConversation,
} from "../controller/ConversationController";
import { authentication } from "../middlewares/authMiddleware";

const ConversationRouter = (io: any) => {
  const router = Router();

  router.get("/", authentication, fetchUserConversations(io));
  router.post("/add", authentication, createConversation);
  router.get("/:id", authentication, getConversationById(io));
  router.get("/:id", authentication, updateConversation(io));
  router.get("/:id", authentication, deleteConversation);
  return router;
};

export default ConversationRouter;
