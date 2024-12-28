import "./MessagesPage.scss";
import { useContext, useEffect, useRef } from "react";
import ChatInput from "../../../components/templates/Chat/ChatInput/ChatInput";
import MessageSectionHeader from "../../../components/templates/Chat/MessageSectionHeader/MessageSectionHeader";
import { Empty } from "antd";
import { fetchCurrentUser, selectCurrentUser } from "../../../features/auth/authSlice";
import { store } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../../socket/socket";
import { Message } from "../../../types/Message";
import MessageContent from "../../../components/templates/Chat/Message/MessageContent";
import { MessageContent as MessageContentType } from "../../../types/Message";
import { getUserById, selectOnlineUsers, selectUserById } from "../../../features/user/userSlice";
import {
  addMessage,
  getConversationByUserId,
  selectCurrentConversation,
} from "../../../features/conversation/ConversationSlice";

const MessagesPage: React.FC = ({}) => {
  const userData = useAppSelector(selectUserById);
  const onlineUsers = useAppSelector(selectOnlineUsers);
  const conversation = useAppSelector(selectCurrentConversation);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  // const [messages, setMessages] = useState<Message[]>([]);
  const socket = useContext(SocketContext);
  const currentUser = useAppSelector(selectCurrentUser);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    store.dispatch(fetchCurrentUser());
    if (params?.id) {
      store.dispatch(getUserById(params?.id));
      store.dispatch(getConversationByUserId(params?.id));
      // if (socket) {
      //   socket.emit("message-page", params.id);
      //   socket.emit("seen", params.id);
      //   socket.on("message-user-details", (data) => {
      //     console.log("user Details", data);
      //     setUserData(data);
      //   });

      //   socket.on("message", (message: Message[]) => {
      //     console.log("message", message);
      //     setMessages(message);
      //   });
      // }

      // setMessages(conversation?.messages || []);
    }
  }, [params?.id]);

  const onSendMessage = (messageContent: MessageContentType) => {
    const { text = "", imagesUrl = [], videosUrl = [] } = messageContent || {};
    if (text || (imagesUrl && imagesUrl.length > 0) || (videosUrl && videosUrl.length > 0)) {
      const newMessage: Message = {
        text: messageContent?.text,
        imagesUrl: messageContent?.imagesUrl,
        videosUrl: messageContent?.videosUrl,
        receiver: params?.id,
      };
      if (socket) {
        store.dispatch(addMessage({ id: params?.id!, newMessage: newMessage }));
      }
      // setMessages((prevMessages) => [...(prevMessages || []), newMessage]);
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  return (
    <div className='message-section'>
      <MessageSectionHeader
        userName={userData?.name}
        userImage={userData?.profile_pic}
        isOnline={onlineUsers?.includes(userData?._id)}
      />
      <div className='message-section__messages' ref={messageContainerRef}>
        {conversation ? (
          conversation?.messages?.map((message, key) => (
            <MessageContent
              key={key}
              message={message}
              isUser={currentUser?._id === message?.sender}
              user={userData!}
            />
          ))
        ) : (
          <Empty description='Start The conversation' />
        )}
      </div>
      <ChatInput onSendMessage={(message) => onSendMessage(message)} />
    </div>
  );
};

export default MessagesPage;
