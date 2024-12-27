import { Message } from "../../../../types/Message";
import { Image } from "antd";
import "./MessageContent.scss";
import moment from "moment";
import { User } from "../../../../types/User"; // Assuming you have a User type that contains the profile picture.

interface MessageProps {
  message: Message;
  isUser: boolean;
  user?: User; // Add user prop to display their image for the other user
}

const MessageContent: React.FC<MessageProps> = ({ message, isUser, user }) => {
  return (
    <div style={{ whiteSpace: "pre-wrap" }} className={`message ${isUser ? "message--user" : "message--other"}`}>
      {/* If the message is from the other user, display their profile image */}
      {!isUser && user && (
        <div className='message__user-image'>
          <Image
            src={user?.profile_pic}
            alt='user'
            className='message__user-image--img'
            preview={false} // Disable preview on hover
          />
        </div>
      )}

      {/* Message content (text, images, videos) */}
      <div className='message__content'>
        {message?.imagesUrl?.map((imageUrl, index) => (
          <Image key={index} src={imageUrl} alt='message' className='message__media' />
        ))}
        {message?.videosUrl?.map((videoUrl, index) => (
          <video key={index} src={videoUrl} controls muted autoPlay className='message__media' />
        ))}
        {message?.text && (
          <div className={`${isUser ? "message__text-container" : ""}`}>
            <div className={`text-container ${isUser ? "text--user" : "text--other"}`}>
              <p className='message__text'>{message?.text}</p>
            </div>
          </div>
        )}
      </div>

      <p className='message__time'>{moment(message?.createdAt).format("hh:mm a")}</p>
    </div>
  );
};

export default MessageContent;
