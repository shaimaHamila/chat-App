import "./MessagesPage.scss";
import { useContext, useEffect, useRef, useState } from "react";
import Message from "../../../components/templates/Chat/Message/Message";
import ChatInput from "../../../components/templates/Chat/ChatInput/ChatInput";
import MessageSectionHeader from "../../../components/templates/Chat/MessageSectionHeader/MessageSectionHeader";
import { Empty } from "antd";
import { fetchCurrentUser, selectCurrentUser } from "../../../features/auth/authSlice";
import { store } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../../socket/socket";

// Fake messages data
const initialMessages: any = [
  { id: "1", messageContent: "Hey there!", senderId: "66e8b30bbd7607be8a84ea26" },
  { id: "2", messageContent: "How are you?", senderId: "2" },
  { id: "3", messageContent: "I'm good, how about you?", senderId: "1" },
];

const MessagesPage: React.FC = ({}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const socket = useContext(SocketContext);
  const currentUser = useAppSelector(selectCurrentUser);
  const params = useParams();

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

  const onSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now().toString(), // Temporary ID using timestamp
        messageContent: inputValue,
        senderId: currentUser?._id || "1",
      };
      setMessages((prevMessages: any) => [...prevMessages, newMessage]);
      setInputValue("");
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
          messages.map((message: any) => (
            <Message key={message.id} text={message.messageContent} isUser={currentUser?._id === message.senderId} />
          ))
        ) : (
          <Empty description='Start The conversation' />
        )}
      </div>
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default MessagesPage;
