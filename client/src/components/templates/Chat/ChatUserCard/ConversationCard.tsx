import { Avatar, Badge, Card } from "antd";
import "./ConversationCard.scss";
import { UserOutlined } from "@ant-design/icons";
import { Message } from "../../../../types/Message";
import { FileImageOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { User } from "../../../../types/User";
interface ConversationCardProps {
  _id: any;
  userDetails: User;
  lastMessage?: Message;
  unseenMessageCount?: number;
  onClick: (convId: any, receiverId: any) => void;
  isOpen: boolean;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  _id,
  userDetails,
  lastMessage,
  unseenMessageCount,
  onClick,
  isOpen,
}) => {
  console.log("ConversationCard userDetails", userDetails);
  return (
    <Card
      className={`chatUser-card ${isOpen ? "chatUser-card--selected" : ""}`}
      onClick={() => onClick(_id, userDetails._id)}
      // tabIndex={1}
      aria-selected={isOpen}
    >
      <div className='chatUser-card--container'>
        <div className='chatUser-card--data'>
          <Badge dot={true} color='green' offset={[-4, 5]}>
            <Avatar
              src={userDetails.profile_pic}
              icon={<UserOutlined />}
              size={36}
              style={{ backgroundColor: "#edd8ff", color: "#4a1d8a" }}
            ></Avatar>
          </Badge>

          <div className='chatUser-card--data-text'>
            <h3 className='chatUser-card--data-username'>{userDetails?.name} </h3>
            <h5 className='chatUser-card--data-lastMsg'>
              {lastMessage?.text ||
                (lastMessage?.imagesUrl?.length ? (
                  <>
                    <FileImageOutlined /> Image
                  </>
                ) : lastMessage?.videosUrl?.length ? (
                  <>
                    <VideoCameraOutlined /> Video
                  </>
                ) : (
                  ""
                ))}
            </h5>
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
