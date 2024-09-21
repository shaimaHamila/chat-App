import { MessageContent as MessageContentType } from "../../../../types/Message";
import { Image } from "antd";
import "./MessageContent.scss";

interface MessageProps {
  messageContent: MessageContentType;
  isUser: boolean;
}

const MessageContent: React.FC<MessageProps> = ({ messageContent, isUser }) => {
  return (
    <div style={{ whiteSpace: "pre-wrap" }} className={`message ${isUser ? "message--user" : "message--other"}`}>
      <p className='message__text'> {messageContent?.text}</p>

      {messageContent?.imagesUrl?.map((imageUrl, index) => (
        <Image key={index} src={imageUrl} alt='message' className='message__media' />
      ))}
      {messageContent?.videosUrl?.map((videoUrl, index) => (
        <video key={index} src={videoUrl} controls muted autoPlay className='message__media' />
      ))}
    </div>
  );
};

export default MessageContent;
