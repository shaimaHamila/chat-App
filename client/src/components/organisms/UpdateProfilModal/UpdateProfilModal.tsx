import { Image, Form, FormProps, Input, Modal, Upload, UploadFile, UploadProps } from "antd";
import "./UpdateProfilModal.scss";
import { useState, useEffect } from "react";
import { User } from "../../../types/User";
import { PlusOutlined } from "@ant-design/icons";
import { uploadFile } from "../../../helper/UploadFile";

export interface UpdateProfilModalProps {
  isUpdateProfileModalOpen: boolean;
  handleClose: () => void;
  onUpdateProfile: (updatedProfil: User) => void;
  currentUser: User;
}

const UpdateProfilModal: React.FC<UpdateProfilModalProps> = ({
  isUpdateProfileModalOpen,
  handleClose,
  onUpdateProfile,
  currentUser,
}) => {
  const [profilePic, setProfilePic] = useState<UploadFile | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(currentUser?.profile_pic);
  const [form] = Form.useForm<User>();
  const [loading, setLoading] = useState(false);
  const [isProfilePicChanged, setIsProfilePicChanged] = useState(false);

  useEffect(() => {
    if (currentUser?.profile_pic) {
      setFileList([
        {
          uid: "-1",
          name: "profile_pic",
          status: "done",
          url: currentUser.profile_pic,
        } as UploadFile,
      ]);
    }
  }, [currentUser]);

  const onFinish: FormProps<User>["onFinish"] = async () => {
    if (profilePic && isProfilePicChanged) {
      setLoading(true);
      const uploadPhoto = await uploadFile(profilePic);
      form.setFieldValue("profile_pic", uploadPhoto?.url);
      setIsProfilePicChanged(false);
    }

    onUpdateProfile(form.getFieldsValue());
    setLoading(false);
    handleClose();
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setProfilePic(newFileList[0]);
      setIsProfilePicChanged(true);
    } else {
      setProfilePic(null);
      setIsProfilePicChanged(false);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as Blob);
      reader.onload = () => setPreviewImage(reader.result as string);
    }
    setPreviewOpen(true);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Modal
        title='Profile Details'
        open={isUpdateProfileModalOpen}
        onCancel={handleClose}
        okText='Update'
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <span>Edit user details</span>
        <div>
          <Form
            initialValues={currentUser}
            className='update-profile-form'
            layout='vertical'
            name='register'
            form={form}
            onFinish={onFinish}
            autoComplete='off'
          >
            <Form.Item
              label='Username'
              name='name'
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label='Profile picture' name='profile_pic'>
              <div>
                <Upload
                  listType='picture-circle'
                  maxCount={1}
                  fileList={fileList}
                  onChange={handleChange}
                  onPreview={handlePreview}
                  beforeUpload={() => false} // Prevent automatic upload
                  onRemove={() => {
                    form.setFieldValue("profile_pic", "");
                  }}
                >
                  {fileList.length === 0 && uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default UpdateProfilModal;
