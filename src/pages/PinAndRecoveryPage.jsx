// src/pages/PinAndRecoveryPage.jsx

import React, { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useNavigate } from "react-router-dom"; 
import {
  Card,
  Button,
  Typography,
  Space,
  Alert,
  Input,
  Form,
  Select,
  Row,
  Col,
  Modal, // Import Modal
} from "antd";
import { Icon } from "@iconify/react";

const { Title } = Typography;
const { Option } = Select;

const securityQuestions = [
    "Tên thú cưng đầu tiên của bạn là gì?",
    "Tên người bạn thời thơ ấu thân nhất của bạn là gì?",
    "Thành phố bạn sinh ra là gì?",
    "Món ăn yêu thích của bạn là gì?",
];

const PinAndRecoveryPage = () => {
  const navigate = useNavigate();
  const [isSetup, setIsSetup] = useState(true); // Giả định đã thiết lập
  const [form] = Form.useForm();

  const handleSetup = (values) => {
    // Logic gọi API để thiết lập Mã PIN và Câu hỏi bảo mật
    console.log('Thiết lập bảo mật:', values);
    Modal.success({ title: 'Thành công', content: 'Mã PIN và Khôi phục đã được cập nhật thành công!' });
    setIsSetup(true);
    navigate('/settings');
  };

  const handleReset = () => {
    // Giả định flow khôi phục
    Modal.info({
        title: 'Khôi phục Mã PIN',
        content: 'Bạn sẽ được chuyển đến trang khôi phục để trả lời câu hỏi bảo mật.',
        okText: 'Đã hiểu'
    });
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
            <Icon icon="mdi:key-variant" style={{ verticalAlign: 'middle' }} />
            Mã PIN & Khôi phục
          </Space>
        </Title>

        <Card 
            title={isSetup ? "Cập nhật Thiết lập Bảo mật" : "Thiết lập Bảo mật Lần đầu"}
            style={{ maxWidth: 700, margin: '0 auto' }}
        >
            <Alert
                message={isSetup ? "Mã PIN đã thiết lập" : "Bảo mật tài khoản"}
                description={isSetup 
                    ? "Mã PIN và câu hỏi bảo mật đã được thiết lập. Bạn có thể thay đổi bất cứ lúc nào."
                    : "Vui lòng thiết lập Mã PIN 6 chữ số và chọn một câu hỏi bảo mật để khôi phục tài khoản khi cần."
                }
                type={isSetup ? "success" : "warning"}
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Form
                form={form}
                name="pin_setup"
                layout="vertical"
                onFinish={handleSetup}
                initialValues={{ question: securityQuestions[0] }}
            >
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        {/* 1. Thiết lập Mã PIN */}
                        <Form.Item
                            label="Mã PIN 6 chữ số"
                            name="pin"
                            rules={[
                                { required: true, message: 'Vui lòng nhập Mã PIN!' },
                                { len: 6, message: 'Mã PIN phải có đúng 6 chữ số.', type: 'string' },
                                { pattern: /^[0-9]+$/, message: 'Mã PIN chỉ được chứa chữ số.' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="******" maxLength={6} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        {/* 2. Xác nhận Mã PIN */}
                         <Form.Item
                            label="Xác nhận Mã PIN"
                            name="confirmPin"
                            dependencies={['pin']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận Mã PIN!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('pin') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Hai Mã PIN không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại Mã PIN" maxLength={6} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* 3. Câu hỏi bảo mật */}
                <Form.Item
                    label="Câu hỏi Khôi phục Bí mật"
                    name="question"
                    rules={[{ required: true, message: 'Vui lòng chọn câu hỏi!' }]}
                >
                    <Select placeholder="Chọn một câu hỏi bảo mật">
                        {securityQuestions.map((q, index) => (
                            <Option key={index} value={q}>{q}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Câu trả lời của bạn"
                    name="answer"
                    rules={[{ required: true, message: 'Vui lòng nhập câu trả lời!' }]}
                >
                    <Input placeholder="Câu trả lời phải dễ nhớ với bạn nhưng khó đoán với người khác" />
                </Form.Item>

                <Form.Item style={{ marginTop: 20 }}>
                    <Button type="primary" htmlType="submit" block>
                        {isSetup ? "Cập nhật Thiết lập Bảo mật" : "Thiết lập Mã PIN & Khôi phục"}
                    </Button>
                </Form.Item>
                
                <Button type="link" onClick={handleReset} style={{ padding: 0 }}>
                    Quên Mã PIN? Khôi phục bằng câu hỏi bảo mật.
                </Button>

            </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PinAndRecoveryPage;