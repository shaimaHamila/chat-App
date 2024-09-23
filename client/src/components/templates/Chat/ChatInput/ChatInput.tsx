import React, { useEffect, useRef, useState } from "react";
import { Button, Upload, Image, UploadFile, UploadProps, Form, FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined, CloseOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import "./ChatInput.scss";
import { uploadFile } from "../../../../helper/UploadFile";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { MessageContent } from "../../../../types/Message";

interface ChatInputProps {
  onSendMessage: (message: MessageContent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [videoFiles, setVideoFiles] = useState<UploadFile[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [chatForm] = Form.useForm();
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const onFinish: FormProps<MessageContent>["onFinish"] = async () => {
    const imagesUrl: string[] = [];
    const videosUrl: string[] = [];

    setLoading(true);

    // Upload images and videos concurrently
    const imageUploadPromises = imageFiles.map((file) =>
      uploadFile(file).then((uploadPhoto) => {
        if (uploadPhoto?.url) {
          imagesUrl.push(uploadPhoto.url);
        }
      }),
    );

    const videoUploadPromises = videoFiles.map((file) =>
      uploadFile(file).then((uploadVideo) => {
        if (uploadVideo?.url) {
          videosUrl.push(uploadVideo.url);
        }
      }),
    );

    // Wait for all uploads to complete
    await Promise.all([...imageUploadPromises, ...videoUploadPromises]);

    // Set URLs to the form fields
    const messageContent = {
      ...chatForm.getFieldsValue(),
      imagesUrl: imagesUrl.length > 0 ? imagesUrl : [],
      videosUrl: videosUrl.length > 0 ? videosUrl : [],
    };
    console.log("chat imagesUrll", imagesUrl);
    console.log("chatForm.getFieldsValue imagesUrl", chatForm.getFieldValue("imagesUrl"));
    console.log("chatForm.getFieldsValue videosUrl", chatForm.getFieldValue("videosUrl"));
    // Send the message
    onSendMessage(messageContent);

    // Reset form fields and state
    chatForm.resetFields();
    setFileList([]);
    setImageFiles([]);
    setVideoFiles([]);
    setImagePreviews([]);
    setVideoPreviews([]);

    setLoading(false);
  };

  const handleChange: UploadProps["onChange"] = async ({ fileList }) => {
    const imageFiles = fileList.filter((file) => file.originFileObj && file.originFileObj.type.startsWith("image"));
    const videoFiles = fileList.filter((file) => file.originFileObj && file.originFileObj.type.startsWith("video"));

    setFileList(fileList); // Update the main fileList state
    setImageFiles(imageFiles);
    setVideoFiles(videoFiles);

    const imagePromises = imageFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        if (file.originFileObj) {
          reader.readAsDataURL(file.originFileObj as Blob);
          reader.onload = () => resolve(reader.result as string);
        }
      });
    });

    const videoPromises = videoFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        if (file.originFileObj) {
          reader.readAsDataURL(file.originFileObj as Blob);
          reader.onload = () => resolve(reader.result as string);
        }
      });
    });

    const images = await Promise.all(imagePromises);
    const videos = await Promise.all(videoPromises);
    setImagePreviews(images);
    setVideoPreviews(videos);
  };

  const handleDeleteImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newFileList = fileList.filter(
      (file) => !file.originFileObj?.type.startsWith("image") || file !== imageFiles[index],
    );

    setImageFiles(newImageFiles);
    setFileList(newFileList); // Update the fileList in Upload component
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteVideo = (index: number) => {
    const newVideoFiles = videoFiles.filter((_, i) => i !== index);
    const newFileList = fileList.filter(
      (file) => !file.originFileObj?.type.startsWith("video") || file !== videoFiles[index],
    );

    setVideoFiles(newVideoFiles);
    setFileList(newFileList); // Update the fileList in Upload component
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  //Emoji
  const handleEmojiSelect = (emoji: any) => {
    const currentValue = chatForm.getFieldValue("text") || "";
    const newValue = currentValue + emoji.native;
    chatForm.setFieldValue("text", newValue);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
      setEmojiPickerVisible(false); // Close the emoji picker if clicked outside
    }
  };

  useEffect(() => {
    if (emojiPickerVisible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick); // Clean up when component unmounts
    };
  }, [emojiPickerVisible]);

  return (
    <div className='message-section__input'>
      {(imageFiles.length || videoFiles.length) > 0 && (
        <div className='uploaded-media'>
          {/* Uploaded Images */}
          {imagePreviews.map((preview, index) => (
            <div key={index} className='uploaded-image' style={{ position: "relative", marginRight: 8 }}>
              <Image style={{ borderRadius: "6px" }} src={preview} width={70} height={70} />
              <Button
                size='small'
                danger
                shape='circle'
                icon={<CloseOutlined />}
                onClick={() => handleDeleteImage(index)}
                style={{ position: "absolute", top: 4, right: 4, transform: "translate(50%, -50%)" }}
              />
            </div>
          ))}

          {/* Uploaded Videos */}
          {videoPreviews.map((preview, index) => (
            <div key={index} className='uploaded-video' style={{ position: "relative", marginRight: 8 }}>
              <video style={{ borderRadius: "6px" }} width={70} height={70} controls muted autoPlay>
                <source src={preview} />
                Your browser does not support the video tag.
              </video>
              <Button
                size='small'
                danger
                shape='circle'
                icon={<CloseOutlined />}
                onClick={() => handleDeleteVideo(index)}
                style={{ position: "absolute", top: 4, right: 4, transform: "translate(50%, -50%)" }}
              />
            </div>
          ))}
        </div>
      )}

      <Form layout='vertical' name='chat-form' form={chatForm} onFinish={onFinish} autoComplete='off'>
        <div className='chat-form'>
          <Upload
            name='media'
            showUploadList={false}
            multiple
            onChange={handleChange}
            beforeUpload={() => false}
            fileList={fileList}
            accept='image/*,video/*'
          >
            <Button icon={<UploadOutlined />} />
          </Upload>

          <Form.Item name='text' style={{ margin: 0, width: "100%" }}>
            <TextArea autoSize={{ minRows: 1, maxRows: 6 }} allowClear placeholder='Type your message...' />
          </Form.Item>
          <div>
            <Button
              icon={<SmileOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Prevent click event from bubbling up
                setEmojiPickerVisible(!emojiPickerVisible);
              }}
              style={{ color: "#ffac00" }}
            />
            {emojiPickerVisible && (
              <div className='emoji-picker' ref={emojiPickerRef}>
                <Picker theme={"light"} data={data} onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>

          <Button loading={loading} type='primary' htmlType='submit' icon={<SendOutlined />}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChatInput;
