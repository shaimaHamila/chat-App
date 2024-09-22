import { Message } from "./Message";

export type Conversation = {
  _id?: any;
  sender?: string;
  reciver?: string;
  messages?: Message[];
  updatedAt?: string;
  createdAt?: string;
  isDeleted?: Boolean;
};
