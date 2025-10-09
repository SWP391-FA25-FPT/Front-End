import React, { useState } from "react";
import { Row, Col, Card, Input, Button, Typography, Avatar, Space, Tag } from "antd";
import { Container } from "react-bootstrap";
import { SendOutlined, RobotOutlined, UserOutlined, CameraOutlined, FileTextOutlined, HeartOutlined } from "@ant-design/icons";
import Layout from "../components/layout/SettingLayout";
import "../pages/style/AIConsultation.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function AIConsultation() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Xin chào! Tôi là AI Tư Vấn M&M. Tôi có thể giúp bạn tư vấn về dinh dưỡng, thực đơn, và các mẹo nấu ăn. Bạn cần hỗ trợ gì hôm nay?",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: "Cảm ơn bạn đã hỏi! Tôi đang phân tích câu hỏi của bạn và sẽ đưa ra lời khuyên phù hợp nhất. Đây là một tính năng premium, bạn sẽ nhận được tư vấn chi tiết và chuyên nghiệp.",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const quickActions = [
    { icon: <CameraOutlined />, title: "Phân tích ảnh món ăn", desc: "Tải ảnh để phân tích dinh dưỡng" },
    { icon: <FileTextOutlined />, title: "Tạo thực đơn", desc: "Lên thực đơn theo nhu cầu" },
    { icon: <HeartOutlined />, title: "Tư vấn sức khỏe", desc: "Lời khuyên dinh dưỡng cá nhân" }
  ];

  return (
    <Layout>
      <Container className="ai-consultation-container">
        <div className="ai-header">
          <div className="ai-header-content">
            <div className="ai-title-section">
              <RobotOutlined className="ai-main-icon" />
              <div>
                <Title level={2} className="ai-title">AI Tư Vấn M&M</Title>
                <Text className="ai-subtitle">Trợ lý dinh dưỡng thông minh của bạn</Text>
              </div>
            </div>
            <Tag color="gold" className="premium-badge">PREMIUM</Tag>
          </div>
        </div>

        <Row gutter={[24, 24]} className="ai-content">
          {/* Chat Section */}
          <Col xs={24} lg={16}>
            <Card className="chat-container">
              <div className="chat-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-avatar">
                      {message.type === "ai" ? (
                        <Avatar icon={<RobotOutlined />} className="ai-avatar" />
                      ) : (
                        <Avatar icon={<UserOutlined />} className="user-avatar" />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <Paragraph className="message-text">{message.content}</Paragraph>
                        <Text className="message-time">{message.timestamp}</Text>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message ai">
                    <div className="message-avatar">
                      <Avatar icon={<RobotOutlined />} className="ai-avatar" />
                    </div>
                    <div className="message-content">
                      <div className="message-bubble typing">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input">
                <TextArea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn về dinh dưỡng, thực đơn, hoặc nấu ăn..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="send-button"
                >
                  Gửi
                </Button>
              </div>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <div className="ai-sidebar">
              {/* Quick Actions */}
              <Card title="Tính năng nhanh" className="quick-actions-card">
                {quickActions.map((action, index) => (
                  <div key={index} className="quick-action-item">
                    <div className="quick-action-icon">{action.icon}</div>
                    <div className="quick-action-content">
                      <Text strong>{action.title}</Text>
                      <Text type="secondary" className="quick-action-desc">
                        {action.desc}
                      </Text>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Premium Features */}
              <Card title="Tính năng Premium" className="premium-features-card">
                <div className="premium-feature">
                  <Text strong>🎯 Tư vấn cá nhân hóa</Text>
                  <Text type="secondary">Dựa trên sở thích và nhu cầu của bạn</Text>
                </div>
                <div className="premium-feature">
                  <Text strong>📊 Phân tích dinh dưỡng chi tiết</Text>
                  <Text type="secondary">Đánh giá calo, protein, vitamin...</Text>
                </div>
                <div className="premium-feature">
                  <Text strong>🍽️ Thực đơn tối ưu</Text>
                  <Text type="secondary">Gợi ý món ăn phù hợp với mục tiêu</Text>
                </div>
                <div className="premium-feature">
                  <Text strong>📱 Phân tích ảnh món ăn</Text>
                  <Text type="secondary">AI nhận diện và đánh giá món ăn</Text>
                </div>
              </Card>

              {/* Tips */}
              <Card title="Mẹo sử dụng" className="tips-card">
                <ul className="tips-list">
                  <li>Hỏi cụ thể về mục tiêu dinh dưỡng của bạn</li>
                  <li>Mô tả chi tiết về tình trạng sức khỏe</li>
                  <li>Chia sẻ sở thích ăn uống và hạn chế</li>
                  <li>Tải ảnh món ăn để phân tích dinh dưỡng</li>
                </ul>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
