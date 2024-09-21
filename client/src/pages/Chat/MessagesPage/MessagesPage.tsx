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
import { Message, Message as MessageType } from "../../../types/Message";
import { User } from "../../../types/User";
import MessageContent from "../../../components/templates/Chat/Message/MessageContent";
import { MessageContent as MessageContentType } from "../../../types/Message";

// Fake messages data
const initialMessages: MessageType[] = [
  { _id: "1", text: "Hey there!", imagesUrl: [], videosUrl: [], from: "66e8b30bbd7607be8a84ea26" },
  {
    _id: "2",
    text: "How are you?",
    imagesUrl: [],
    videosUrl: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    from: "2",
  },
  {
    _id: "3",

    text: "I'm good, how about you?",
    imagesUrl: ["https://picsum.photos/200", "https://picsum.photos/200"],
    videosUrl: ["https://www.w3schools.com/html/mov_bbb.mp4"],

    from: "1",
  },
];
const MessagesPage: React.FC = ({}) => {
  const [userData, setUserData] = useState<User>({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const socket = useContext(SocketContext);
  const currentUser = useAppSelector(selectCurrentUser);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    store.dispatch(fetchCurrentUser());
    console.log("message_page");
    console.log("socket", socket);

    if (socket) {
      console.log("message_page", params.id);
      socket.emit("message_page", params.id);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("message-page", params.id);

      socket.on("message-user", (data) => {
        console.log("user Details", data);
        setUserData(data);
      });
    }
  }, [socket, params?.id]);

  const onSendMessage = (messageContent: MessageContentType) => {
    const { text = "", imagesUrl = [], videosUrl = [] } = messageContent || {};
    if (text || (imagesUrl && imagesUrl.length > 0) || (videosUrl && videosUrl.length > 0)) {
      const newMessage: Message = {
        text: messageContent?.text,
        imagesUrl: messageContent?.imagesUrl,
        videosUrl: messageContent?.videosUrl,
        from: currentUser?._id || "1",
        to: params?.id,
      };
      if (socket) {
        console.log("message_page", params.id);
        socket.emit("new_message", params.id);
      }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
        {messages.length !== 0 ? (
          messages.map((message, key) => (
            <MessageContent key={key} message={message} isUser={currentUser?._id === message.from} />
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
