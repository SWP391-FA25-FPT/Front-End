import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Card, Input, Button, Typography, Avatar, Space, Tag, message } from "antd";
import { Container } from "react-bootstrap";
import { SendOutlined, RobotOutlined, UserOutlined, CameraOutlined, FileTextOutlined, HeartOutlined } from "@ant-design/icons";
import Layout from "../components/layout/SettingLayout";
import { sendMessageToAI } from "../services/geminiAI";
import "../pages/style/AIConsultation.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function AIConsultation() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Xin chào! Tôi là AI Tư Vấn M&M. Tôi có thể giúp bạn tư vấn về dinh dưỡng, thực đơn, và các mẹo nấu ăn. Bạn cần hỗ trợ gì hôm nay? 😊",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto scroll to bottom smoothly
  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }, 100);
  };

  // Only scroll when new messages arrive (not on every render)
  useEffect(() => {
    if (messages.length > 1) { // Skip initial message
      scrollToBottom();
    }
  }, [messages.length]); // Only when message count changes

  // Scroll when typing indicator appears
  useEffect(() => {
    if (isTyping) {
      scrollToBottom();
    }
  }, [isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessageContent = inputMessage.trim();
    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Prepare conversation history for AI
      const conversationHistory = messages
        .filter(msg => msg.type !== "system") // Exclude system messages if any
        .map(msg => ({
          type: msg.type,
          content: msg.content
        }));

      // Call Gemini AI
      const aiResponseText = await sendMessageToAI(userMessageContent, conversationHistory);

      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: aiResponseText,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      const errorMessage = {
        id: messages.length + 2,
        type: "ai",
        content: error.message || "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau. 😔",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
      message.error("Không thể kết nối với AI. Vui lòng thử lại!");
    } finally {
      setIsTyping(false);
    }
  };

  // Handle quick action click
  const handleQuickAction = (actionTitle) => {
    let prompt = "";
    
    switch (actionTitle) {
      case "Phân tích ảnh món ăn":
        prompt = "Tôi muốn biết cách phân tích dinh dưỡng của món ăn từ ảnh. Bạn có thể hướng dẫn tôi không?";
        break;
      case "Tạo thực đơn":
        prompt = "Tôi muốn tạo thực đơn ăn uống lành mạnh cho 1 tuần. Bạn có thể giúp tôi không?";
        break;
      case "Tư vấn sức khỏe":
        prompt = "Tôi muốn có lời khuyên về chế độ ăn uống để cải thiện sức khỏe. Bạn có thể tư vấn cho tôi không?";
        break;
      default:
        return;
    }

    setInputMessage(prompt);
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
                <div ref={messagesEndRef} />
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
                  <div 
                    key={index} 
                    className="quick-action-item"
                    onClick={() => handleQuickAction(action.title)}
                  >
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
