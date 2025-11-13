// src/pages/ChangePasswordPage.jsx

import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { useNavigate } from "react-router-dom"; 
import {
  Card,
  Button,
  Typography,
  Form,
  Input,
  message,
  Space,
  Alert,
} from "antd";
import { Icon } from "@iconify/react";

const { Title } = Typography;

const ChangePasswordPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const passwordValidationRules = [
    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự.' },
    { pattern: /[A-Z]/, message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa.' },
    { pattern: /[0-9]/, message: 'Mật khẩu phải chứa ít nhất 1 chữ số.' },
    { pattern: /[^A-Za-z0-9]/, message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.' },
  ];

  const onFinish = (values) => {
    // Logic gọi API đổi mật khẩu (thực tế cần gửi currentPassword, newPassword)
    console.log('Đã đổi mật khẩu với: ', values);
    message.success('Mật khẩu đã được đổi thành công và an toàn hơn!');
    form.resetFields();
  };

  return (
    <AppLayout>
      <div style={{ padding: "16px 24px" }}>
        {/* NÚT QUAY LẠI MỚI (CHỈ ICON) */}
        <Button 
            type="text" 
            onClick={() => navigate('/settings')} 
            style={{ marginBottom: 24, paddingLeft: 0 }}
            icon={<Icon icon="mdi:chevron-left" style={{ fontSize: '28px' }} />}
        >
            <span style={{ fontSize: '16px' }}>Quay lại Thiết Lập</span>
        </Button>
        
        <Title level={3} style={{ marginTop: 0, marginBottom: "24px" }}>
          <Space>
            <Icon icon="mdi:lock-reset" style={{ verticalAlign: 'middle' }} />
            Đổi Mật Khẩu
          </Space>
        </Title>

        <Card title="Cập nhật Mật khẩu Tài khoản" style={{ maxWidth: 600, margin: '0 auto' }}>
            <Alert
                message="Mật khẩu mạnh là cần thiết"
                description="Mật khẩu mới của bạn cần chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ số, và ký tự đặc biệt để đảm bảo an toàn."
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
            />
          <Form
            form={form}
            name="change_password"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Mật khẩu Hiện tại */}
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu hiện tại của bạn" />
            </Form.Item>

            {/* Mật khẩu Mới (Áp dụng quy tắc bảo mật) */}
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={passwordValidationRules}
              hasFeedback
            >
              <Input.Password placeholder="Mật khẩu mới (Tối thiểu 8 ký tự, có đủ chữ hoa, số, ký tự đặc biệt)" />
            </Form.Item>

            {/* Xác nhận Mật khẩu Mới */}
            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Hai mật khẩu đã nhập không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đổi Mật Khẩu
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ChangePasswordPage;