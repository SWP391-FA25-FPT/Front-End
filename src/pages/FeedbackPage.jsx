import React, { useState } from "react";
import { Card, Form, Input, Button, message, Select, Alert } from "antd";
import { Icon } from "@iconify/react";
import AppLayout from "../components/layout/AppLayout";
import { createFeedback } from "../apis/feedback";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

const FeedbackPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated()) {
      message.warning("Vui lòng đăng nhập để gửi feedback");
      navigate("/login", { state: { from: "/feedback" } });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await createFeedback({
        type: values.type || "other",
        subject: values.subject,
        message: values.message,
      });

      if (response.success) {
        message.success("Gửi feedback thành công! Cảm ơn bạn đã đóng góp ý kiến.");
        form.resetFields();
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      message.error(err.message || "Lỗi khi gửi feedback");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null; // Will redirect
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
        <Card>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon icon="mdi:message-text" style={{ fontSize: "28px" }} />
              Gửi Feedback / Tin nhắn cho Admin
            </h2>
            <p style={{ color: "#666", marginBottom: 0 }}>
              Chúng tôi rất mong nhận được ý kiến đóng góp của bạn để cải thiện dịch vụ
            </p>
          </div>

          <Alert
            message="Thông tin"
            description="Feedback của bạn sẽ được gửi trực tiếp đến đội ngũ quản trị viên. Chúng tôi sẽ phản hồi sớm nhất có thể."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="type"
              label="Loại feedback"
              initialValue="other"
            >
              <Select>
                <Option value="bug">Báo lỗi</Option>
                <Option value="feature">Đề xuất tính năng</Option>
                <Option value="improvement">Cải thiện</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="subject"
              label="Tiêu đề"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề" },
                { min: 5, message: "Tiêu đề phải có ít nhất 5 ký tự" },
              ]}
            >
              <Input
                placeholder="Nhập tiêu đề feedback của bạn"
                maxLength={200}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="message"
              label="Nội dung"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung feedback" },
                { min: 10, message: "Nội dung phải có ít nhất 10 ký tự" },
              ]}
            >
              <TextArea
                rows={8}
                placeholder="Nhập feedback, câu hỏi hoặc tin nhắn của bạn..."
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<Icon icon="mdi:send" />}
                size="large"
                block
              >
                Gửi Feedback
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FeedbackPage;

