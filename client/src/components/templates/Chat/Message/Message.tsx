import "./Message.scss";

interface MessageProps {
  text: string;
  isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isUser }) => {
  return (
    <div style={{ whiteSpace: "pre-wrap" }} className={`message ${isUser ? "message--user" : "message--other"}`}>
      {text}
    </div>
  );
};

export default Message;
