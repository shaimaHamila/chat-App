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
import { Conversation } from "../../../types/Conversation";

// Fake messages data
const initialConversation: Conversation = {
  _id: "1",
  sender: "66e8b30bbd7607be8a84ea26", // current user id
  reciver: "66e5c1c869df6ef3c03f9fd5",
  messages: [
    {
      _id: "1",
      text: "Hey there!",
      imagesUrl: [],
      videosUrl: [],
      sender: "66e5c1c869df6ef3c03f9fd5",
      reciver: "66e8b30bbd7607be8a84ea26",
    },
    {
      _id: "2",
      text: "How are you?",
      imagesUrl: [],
      videosUrl: ["https://www.w3schools.com/html/mov_bbb.mp4"],
      sender: "66e5c1c869df6ef3c03f9fd5",
      reciver: "66e8b30bbd7607be8a84ea26",
    },
    {
      _id: "3",
      text: "How are you?",
      imagesUrl: [],
      videosUrl: ["https://www.w3schools.com/html/mov_bbb.mp4"],
      sender: "66e8b30bbd7607be8a84ea26",
      reciver: "66e5c1c869df6ef3c03f9fd5",
    },
    {
      _id: "4",
      text: "I'm good, how about you?",
      imagesUrl: ["https://picsum.photos/200", "https://picsum.photos/200"],
      videosUrl: ["https://www.w3schools.com/html/mov_bbb.mp4"],
      sender: "66e5c1c869df6ef3c03f9fd5",
      reciver: "66e8b30bbd7607be8a84ea26",
    },
  ],
};
const MessagesPage: React.FC = ({}) => {
  const [userData, setUserData] = useState<User>({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Conversation>(initialConversation);
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

      socket.on("message-user-details", (data) => {
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
        sender: currentUser?._id,
        reciver: params?.id,
      };
      if (socket) {
        console.log("socket.emit new_message", newMessage);
        socket.emit("new_message", newMessage);
      }

      setConversation((prevConversation) => {
        return {
          ...prevConversation,
          messages: [...(prevConversation?.messages || []), newMessage],
        };
      });
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  return (
    <div className='message-section'>
      <MessageSectionHeader userName={userData.name} userImage={userData.profile_pic} isOnline={userData.online} />
      <div className='message-section__messages' ref={messageContainerRef}>
        {conversation?.messages?.length !== 0 ? (
          conversation?.messages?.map((message, key) => (
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
