import { Message } from "./Message";
import { User } from "./User";

export type Conversation = {
  _id?: any;
  sender?: User;
  receiver?: User;
  messages?: Message[];

  unseenMessageCount?: number;
  lastMessage?: Message;
  updatedAt?: string;
  createdAt?: string;
  isDeleted?: Boolean;
};
