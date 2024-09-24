import "./Chat.scss";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ChatConversationList from "../../components/templates/Chat/ChatConversationList/ChatConversationList";
import { useContext, useEffect, useState } from "react";
import { fetchCurrentUser, selectCurrentUser } from "../../features/auth/authSlice";
import { store } from "../../store/store";
import { SocketContext } from "../../socket/socket";
import { useAppSelector } from "../../store/hooks";
import { selectOnlineUsers } from "../../features/user/userSlice";
const Chat = () => {
  const socket = useContext(SocketContext);
  const currentUser = useAppSelector(selectCurrentUser);
  const [allConversations, setAllConversations] = useState([]);
  const params = useParams<{ id: string }>();

  const [selectedConversationCardReceiverId, setSelectedConversationCardReceiverId] = useState(params?.id);
  const _onlineUsers = useAppSelector(selectOnlineUsers);

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedConversationCardReceiverId(params?.id);
  }, [params.id]);

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
          } else if (conversation.sender._id != currentUser?._id) {
            return {
              ...conversation,
              userDetails: conversation.sender,
            };
          } else {
            return {
              ...conversation,
              userDetails: conversation.receiver,
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
        onlineUsers={_onlineUsers}
        onSearchChange={() => {
          // store.dispatch(setUserSearch(value));
        }}
        handleSelectConversationCard={(_conversationId, receiverId: any) => {
          setSelectedConversationCardReceiverId(receiverId);
          navigate(`/chat/${receiverId}`); // Navigate to /:userId
        }}
        defaultSelectedConversationId={selectedConversationCardReceiverId}
      />
      <Outlet />
    </div>
  );
};

export default Chat;
