import React, { useState } from "react";
import { Button, Upload, Image, UploadFile, UploadProps, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import "./ChatInput.scss";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, setInputValue, onSendMessage }) => {
  const [profilePic, setProfilePic] = useState<UploadFile[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange: UploadProps["onChange"] = async ({ fileList }) => {
    setProfilePic(fileList);

    const previewPromises = fileList.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    });

    const previews = await Promise.all(previewPromises);
    setImagePreviews(previews);
  };

  const handleDelete = (index: number) => {
    setProfilePic((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='message-section__input'>
      <div className='uploaded-images'>
        {imagePreviews.map((preview, index) => (
          <div key={index} className='uploaded-image' style={{ position: "relative", marginRight: 8 }}>
            <Image style={{ borderRadius: "6px" }} src={preview} width={70} height={70} />
            <Button
              size='small'
              danger
              shape='circle'
              icon={<CloseOutlined />}
              onClick={() => handleDelete(index)}
              style={{ position: "absolute", top: 4, right: 4, transform: "translate(50%, -50%)" }}
            />
          </div>
        ))}
      </div>
      <Form>
        <div className='chat-form'>
          <Upload showUploadList={false} multiple onChange={handleChange} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />} />
          </Upload>

          <TextArea
            autoSize={{ minRows: 1, maxRows: 6 }}
            allowClear
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Type your message...'
          />
          <Button onClick={onSendMessage}>Send</Button>
        </div>
      </Form>
    </div>
  );
};

export default ChatInput;
