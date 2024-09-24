import "./MessagesPage.scss";
import { useContext, useEffect, useRef, useState } from "react";
import ChatInput from "../../../components/templates/Chat/ChatInput/ChatInput";
import MessageSectionHeader from "../../../components/templates/Chat/MessageSectionHeader/MessageSectionHeader";
import { Empty } from "antd";
import { fetchCurrentUser, selectCurrentUser } from "../../../features/auth/authSlice";
import { store } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../../socket/socket";
import { Message } from "../../../types/Message";
import { User } from "../../../types/User";
import MessageContent from "../../../components/templates/Chat/Message/MessageContent";
import { MessageContent as MessageContentType } from "../../../types/Message";

const MessagesPage: React.FC = ({}) => {
  const [userData, setUserData] = useState<User>({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useContext(SocketContext);
  const currentUser = useAppSelector(selectCurrentUser);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    store.dispatch(fetchCurrentUser());
    console.log("message_page socket", socket);

    if (socket) {
      socket.emit("message-page", params.id);
      socket.emit("seen", params.id);
      socket.on("message-user-details", (data) => {
        console.log("user Details", data);
        setUserData(data);
      });

      socket.on("message", (message: Message[]) => {
        console.log("message", message);
        setMessages(message);
      });
    }
  }, [socket, params?.id]);

  const onSendMessage = (messageContent: MessageContentType) => {
    const { text = "", imagesUrl = [], videosUrl = [] } = messageContent || {};
    console.log("onSendMessage messageContent", messageContent);
    console.log("imagesUrl ", imagesUrl);
    if (text || (imagesUrl && imagesUrl.length > 0) || (videosUrl && videosUrl.length > 0)) {
      const newMessage: Message = {
        text: messageContent?.text,
        imagesUrl: messageContent?.imagesUrl,
        videosUrl: messageContent?.videosUrl,
        sender: currentUser?._id,
        receiver: params?.id,
      };
      if (socket) {
        console.log("socket.emit new_message", newMessage);
        socket.emit("new_message", newMessage);
      }
      setMessages((prevMessages) => [...(prevMessages || []), newMessage]);
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='message-section'>
      <MessageSectionHeader userName={userData.name} userImage={userData.profile_pic} isOnline={userData.online} />
      <div className='message-section__messages' ref={messageContainerRef}>
        {messages?.length !== 0 ? (
          messages?.map((message, key) => (
            <MessageContent key={key} message={message} isUser={currentUser?._id === message?.sender} />
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
