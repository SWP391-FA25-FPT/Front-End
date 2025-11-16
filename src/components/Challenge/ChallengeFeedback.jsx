import React, { useState } from "react";
import { Card, Form, Input, Button, message, Select } from "antd";
import { Icon } from "@iconify/react";
import { createFeedback } from "../../apis/feedback";

const { TextArea } = Input;
const { Option } = Select;

const ChallengeFeedback = ({ challengeId, challengeTitle }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await createFeedback({
        type: "other",
        subject: `Feedback về thử thách: ${challengeTitle}`,
        message: `Thử thách: ${challengeTitle}\n\n${values.message}`,
        priority: values.priority || "medium",
        challengeId: challengeId,
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

  return (
    <Card className="detail-feedback-card" bordered={false}>
      <h2 className="detail-section-title">
        <Icon icon="mdi:message-text" style={{ marginRight: "8px" }} />
        Gửi Feedback / Tin nhắn cho Admin
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          initialValue="medium"
        >
          <Select>
            <Option value="low">Thấp</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="high">Cao</Option>
          </Select>
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
            rows={6}
            placeholder="Nhập feedback, câu hỏi hoặc tin nhắn của bạn về thử thách này..."
            maxLength={1000}
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
  );
};

export default ChallengeFeedback;

