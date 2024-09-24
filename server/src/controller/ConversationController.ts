import Conversation from "../models/Conversation";

export const fetchConversations = async (userId: any) => {
  if (userId) {
    const currentUserConversations = await Conversation.find({
      $or: [
        {
          sender: userId,
        },
        {
          receiver: userId,
        },
      ],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversations = currentUserConversations.map((conversation) => {
      const countUnseenMessage = conversation?.messages?.reduce(
        (prev: number, curr: any) => prev + (curr?.seen === false ? 1 : 0),
        0
      );
      return {
        _id: conversation?._id,
        sender: conversation?.sender,
        receiver: conversation?.receiver,
        unseenMessageCount: countUnseenMessage,
        lastMessage: conversation?.messages[conversation?.messages?.length - 1],
      };
    });
    return conversations;
  } else {
    return [];
  }
};
