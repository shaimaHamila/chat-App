import React, { useEffect, useState } from "react";
import Search, { SearchProps } from "antd/es/input/Search";
import { Button, Divider, Empty, Spin } from "antd";
import "./ChatConversationList.scss";
import ConversationCard from "../ChatUserCard/ConversationCard";

interface ChatConversationListProps {
  conversations: any[];
  handleSelectConversationCard: (id: any) => void;
  isloading: boolean;
  defaultSelectedConversationId: number | null;
  loadMoreConversationCards: () => void;
  isLoadMore: boolean;
  onSearchChange: (subject: string) => void;
}

const ChatConversationList: React.FC<ChatConversationListProps> = ({
  conversations,
  handleSelectConversationCard,
  isloading,
  defaultSelectedConversationId,
  loadMoreConversationCards,
  isLoadMore,
  onSearchChange,
}) => {
  const [selectedConversationCard, setSelectedConversationCard] = useState(defaultSelectedConversationId);

  useEffect(() => {
    setSelectedConversationCard(defaultSelectedConversationId);
  }, [defaultSelectedConversationId]);

  const onSelectConversationCard = (conversationId: any) => {
    handleSelectConversationCard(conversationId);
    setSelectedConversationCard(conversationId);
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
                  id={conversation.id}
                  userName={conversation.user.name}
                  lastMessage={"12dfdfdf"}
                  newMessages={5}
                  onClick={() => onSelectConversationCard(conversation._id)}
                  isOpen={selectedConversationCard === conversation._id}
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
