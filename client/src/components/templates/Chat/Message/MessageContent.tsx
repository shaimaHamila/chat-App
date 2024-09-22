import { Message } from "../../../../types/Message";
import { Image } from "antd";
import "./MessageContent.scss";

interface MessageProps {
  message: Message;
  isUser: boolean;
}

const MessageContent: React.FC<MessageProps> = ({ message, isUser }) => {
  return (
    <div style={{ whiteSpace: "pre-wrap" }} className={`message ${isUser ? "message--user" : "message--other"}`}>
      <div className={`text-container ${isUser ? "text--user" : "text--other"}`}>
        <p className={`message__text`}> {message?.text}</p>
      </div>
      {message?.imagesUrl?.map((imageUrl, index) => (
        <Image key={index} src={imageUrl} alt='message' className='message__media' />
      ))}
      {message?.videosUrl?.map((videoUrl, index) => (
        <video key={index} src={videoUrl} controls muted autoPlay className='message__media' />
      ))}
    </div>
  );
};

export default MessageContent;
