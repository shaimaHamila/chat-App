import { Message } from "./Message";
import { User } from "./User";

export type Conversation = {
  _id?: any;
  sender?: User;
  receiver?: User;
  userDetails?: User; // This is not present in the server code, for the client code only to display the user(sender) details in the chat window
  messages?: Message[];
  unseenMessageCount?: number;
  lastMessage?: Message;
  updatedAt?: string;
  createdAt?: string;
  isDeleted?: Boolean;
};
