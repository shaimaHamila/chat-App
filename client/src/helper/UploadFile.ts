import { UploadFile } from "antd";
import toast from "react-hot-toast";

// const url = `https://api.cloudinary.com/v1_1/do94aukfs/auto/upload`;
const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;

export const uploadFile = async (file: UploadFile) => {
  const formData = new FormData();
  formData.append("file", file.originFileObj as Blob);
  // formData.append("upload_preset", `chat-app-files`);
  formData.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_FOLDER_NAME}`);
  try {
    const response = await fetch(url, {
      body: formData,
      method: "POST",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading file: ", error);
    toast.error("Error in uploading");
  }
};
