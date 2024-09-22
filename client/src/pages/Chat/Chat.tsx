import "./Chat.scss";
import { Outlet, useNavigate } from "react-router-dom";
import ChatConversationList from "../../components/templates/Chat/ChatConversationList/ChatConversationList";
import { useContext, useEffect, useState } from "react";
import { fetchCurrentUser, selectCurrentUser } from "../../features/auth/authSlice";
import { store } from "../../store/store";
import { SocketContext } from "../../socket/socket";
import { useAppSelector } from "../../store/hooks";
const Chat = () => {
  const socket = useContext(SocketContext);
  const currentUser = useAppSelector(selectCurrentUser);
  const [allConversations, setAllConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    store.dispatch(fetchCurrentUser());
    console.log("chat_page socket", socket);

    if (socket) {
      socket.emit("sidebar", currentUser?._id);
      socket.on("conversation", (conversations) => {
        const conversationUserDta = conversations.map((conversation: any) => {
          if (conversation.sender._id === conversation.receiver._id) {
            return {
              ...conversation,
              userDetails: conversation.sender,
            };
          } else if (conversation.sender._id !== currentUser?._id) {
            return {
              ...conversation,
              userDetails: conversation.receiver,
            };
          } else {
            return {
              ...conversation,
              userDetails: conversation.sender,
            };
          }
        });
        setAllConversations(conversationUserDta);
        console.log("conversation", conversationUserDta);
      });
    }
  }, [socket]);

  return (
    <div className='chat-window'>
      <ChatConversationList
        conversations={allConversations}
        isloading={false}
        loadMoreConversationCards={() => {}}
        isLoadMore={true}
        onSearchChange={() => {
          // store.dispatch(setComplaintSearch(value));
        }}
        handleSelectConversationCard={(conversationId) => {
          if (conversationId !== null) {
            navigate(`/chat/${conversationId}`); // Navigate to /:userId
          }
        }}
        defaultSelectedConversationId={1}
      />
      <Outlet />
    </div>
  );
};

export default Chat;
