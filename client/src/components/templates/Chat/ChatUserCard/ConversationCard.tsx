import { Avatar, Badge, Card } from "antd";
import "./ConversationCard.scss";
import { UserOutlined } from "@ant-design/icons";

interface ConversationCardProps {
  id: number;
  userName: string;
  userImage?: string;
  lastMessage?: string;
  unseenMessageCount?: number;
  onClick: () => void;
  isOpen: boolean;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  userName,
  lastMessage,
  unseenMessageCount,
  userImage,
  onClick,
  isOpen,
}) => {
  return (
    <Card
      className={`chatUser-card ${isOpen ? "chatUser-card--selected" : ""}`}
      onClick={onClick}
      // tabIndex={0}
      aria-selected={isOpen}
    >
      <div className='chatUser-card--container'>
        <div className='chatUser-card--data'>
          <Badge dot={true} color='green' offset={[-4, 5]}>
            <Avatar
              src={userImage}
              icon={<UserOutlined />}
              size={36}
              style={{ backgroundColor: "#edd8ff", color: "#4a1d8a" }}
            ></Avatar>
          </Badge>

          <div className='chatUser-card--data-text'>
            <h3 className='chatUser-card--data-username'>{userName} </h3>
            <h5 className='chatUser-card--data-lastMsg'>{lastMessage}</h5>
          </div>
        </div>
        <div className='header-actions'>
          {(unseenMessageCount ?? 0) > 0 && (
            <Badge className='site-badge-count-109' count={unseenMessageCount} style={{ backgroundColor: "#ff4d4f" }} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ConversationCard;
