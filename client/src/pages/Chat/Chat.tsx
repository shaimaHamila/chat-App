import "./Chat.scss";
import { Outlet, useNavigate } from "react-router-dom";
import ChatConversationList from "../../components/templates/Chat/ChatConversationList/ChatConversationList";
const Chat = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
  //     auth: {
  //       token: localStorage.getItem("token"),
  //     },
  //   });

  //   socketConnection.on("onlineUser", (data: string[]) => {
  //     store.dispatch(setOnlineUsers(data));
  //   });

  //   store.dispatch(setSocketConnection(socketConnection));

  //   return () => {
  //     socketConnection.disconnect();
  //   };
  // }, []);

  return (
    <div className='chat-window'>
      <ChatConversationList
        conversations={[
          {
            _id: "1",
            user: { _id: "1", name: "Shaima Hamila" },
            messages: [{ text: "Hii" }, { text: "Yo" }, { text: "Nice" }],
          },
          {
            _id: "2",
            user: { _id: "2", name: "Test Test" },
            messages: [{ text: "Hii" }, { text: "Yo" }, { text: "Nice" }],
          },
          {
            _id: "3",
            user: { _id: "3", name: "Test2 Test" },
            messages: [{ text: "Hii" }, { text: "Yo" }, { text: "Nice" }],
          },
        ]}
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
