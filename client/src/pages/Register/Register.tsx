import { Button, Form, FormProps, Input, Layout, Menu, Upload, UploadFile, UploadProps, Image, Typography } from "antd";
import "./Register.scss";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../types/User";
import { uploadFile } from "../../helper/UploadFile";
import { store } from "../../store/store";
import { selectStatus, signup } from "../../features/auth/authSlice";
import { useAppSelector } from "../../store/hooks";

const { Text } = Typography;
const { Header, Content } = Layout;
const Register: React.FC = () => {
  const [profilePic, setProfilePic] = useState<UploadFile>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerForm] = Form.useForm();
  const status = useAppSelector(selectStatus);

  const navigate = useNavigate();

  const onFinish: FormProps<User>["onFinish"] = async () => {
    //Upload photo if exists
    if (profilePic) {
      setLoading(true);
      const uploadPhoto = await uploadFile(profilePic);
      registerForm.setFieldValue("profile_pic", uploadPhoto?.url);
    }

    store.dispatch(signup(registerForm.getFieldsValue()));
    setLoading(false);
  };
  useEffect(() => {
    if (status === "succeeded") {
      navigate("/login");
    }
  }, [status, navigate]);
  const handleChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    setProfilePic(newFileList[0]);
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
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className='register-logo'>Chat App</div>
        <Menu theme='dark' mode='horizontal' defaultSelectedKeys={["2"]} items={[]} style={{ flex: 1, minWidth: 0 }} />
      </Header>
      <Content className='register-content-container'>
        <Form
          className='register-content-form'
          layout='vertical'
          name='register'
          form={registerForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Title level={2}>Register a user</Title>

          <Form.Item label='Profile picture' name='profile_pic' valuePropName='profile_pic'>
            <div>
              <Upload
                listType='picture-circle'
                maxCount={1}
                onChange={handleChange}
                onPreview={handlePreview}
                beforeUpload={() => false}
              >
                {!profilePic && uploadButton}
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

          <Form.Item label='Username' name='name' rules={[{ required: true, message: "Please input your username!" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: "Please input your password!" }, { min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={loading}>
              Submit
            </Button>
          </Form.Item>
          <Text strong>
            Already have an account?{" "}
            <Link to='/login' relative='path'>
              Login
            </Link>
          </Text>
        </Form>
      </Content>
    </Layout>
  );
};

export default Register;
