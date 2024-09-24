import React from "react";
import Search, { SearchProps } from "antd/es/input/Search";
import { Button, Divider, Empty, Spin } from "antd";
import "./ChatConversationList.scss";
import ConversationCard from "../ChatUserCard/ConversationCard";
import { Conversation } from "../../../../types/Conversation";

interface ChatConversationListProps {
  conversations: Conversation[];
  handleSelectConversationCard: (conversationId: any, receiverId: any) => void;
  isloading: boolean;
  defaultSelectedConversationId?: any;
  loadMoreConversationCards: () => void;
  isLoadMore: boolean;
  onSearchChange: (subject: string) => void;
  onlineUsers: String[];
}

const ChatConversationList: React.FC<ChatConversationListProps> = ({
  conversations,
  handleSelectConversationCard,
  isloading,
  defaultSelectedConversationId,
  loadMoreConversationCards,
  isLoadMore,
  onSearchChange,
  onlineUsers,
}) => {
  const onSelectConversationCard = (conversationId: any, receiverId: any) => {
    handleSelectConversationCard(conversationId, receiverId);
  };
  const onSearch: SearchProps["onSearch"] = (value) => {
    value === "" ? onSearchChange("null") : onSearchChange(value);
  };

  return (
    <div className='ChatConversationList-container'>
      <div className='ChatConversationList-search'>
        <h4 className='ChatConversationList-title'>Messages</h4>

        <Search placeholder={"Search by user name"} allowClear onSearch={onSearch} />
        <Divider />
      </div>
      <div className='ChatConversationList-tab-list'>
        <div
          className='ChatConversationList-list'
          id='scrollableDiv'
          style={{
            padding: "0 8px",
          }}
        >
          {isloading ? (
            <Spin style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }} />
          ) : conversations.length === 0 ? (
            <Empty
              description='Explore users to start a conversation'
              style={{
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            />
          ) : (
            <>
              {conversations.map((conversation, key) => (
                <ConversationCard
                  key={key}
                  _id={conversation._id}
                  userDetails={conversation?.userDetails as any}
                  lastMessage={conversation?.lastMessage}
                  unseenMessageCount={conversation?.unseenMessageCount}
                  onClick={onSelectConversationCard}
                  isOpen={conversation?.userDetails?._id === defaultSelectedConversationId}
                  isOnline={onlineUsers.includes(conversation?.userDetails?._id)}
                />
              ))}
              <Button disabled={isLoadMore} onClick={loadMoreConversationCards} style={{ width: "100%" }}>
                {"Load more"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatConversationList;
