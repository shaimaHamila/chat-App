export type Message = {
  _id?: any;
  from?: string;
  to?: string;
  text?: string;
  imagesUrl?: string[];
  videosUrl?: string[];
  seen?: Boolean;
  updatedAt?: string;
  createdAt?: string;
  isDeleted?: Boolean;
};
export type MessageContent = {
  text?: string;
  imagesUrl?: string[];
  videosUrl?: string[];
};
