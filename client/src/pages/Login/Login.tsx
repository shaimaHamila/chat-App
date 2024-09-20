import { Button, Form, FormProps, Input, Layout, Menu, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { login, selectStatus } from "../../features/auth/authSlice";
import { store } from "../../store/store";
import { useEffect } from "react";

const { Text } = Typography;
const { Header, Content } = Layout;

type LoginProps = {
  email: string;
  password: string;
};

const Login = () => {
  const [form] = Form.useForm();
  const status = useAppSelector(selectStatus);
  const navigate = useNavigate();

  const onFinish: FormProps<LoginProps>["onFinish"] = async () => {
    store.dispatch(login(form.getFieldsValue()));
  };

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/chat");
    }
  }, [status, navigate]);

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className='register-logo'>Chat App</div>
        <Menu theme='dark' mode='horizontal' defaultSelectedKeys={["2"]} items={[]} style={{ flex: 1, minWidth: 0 }} />
      </Header>
      <Content className='register-content-container'>
        <Form
          className='login-content-form'
          layout='vertical'
          name='login'
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Title level={2}>Login</Title>

          {/* Email Field */}
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

          {/* Password Field */}
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={status == "loading"}>
              Submit
            </Button>
          </Form.Item>

          <Text strong>
            Don't have an account?{" "}
            <Link to='/register' relative='path'>
              Register
            </Link>
          </Text>
        </Form>
      </Content>
    </Layout>
  );
};

export default Login;
