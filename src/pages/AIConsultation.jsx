import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Card, Input, Button, Typography, Avatar, Space, Tag, message, List, Spin } from "antd";
import { Container } from "react-bootstrap";
import { SendOutlined, RobotOutlined, UserOutlined, CameraOutlined, FileTextOutlined, HeartOutlined, HistoryOutlined, PlusOutlined } from "@ant-design/icons";
import Layout from "../components/layout/SettingLayout";
import { useTheme } from "../context/ThemeContext"; // <--- BỔ SUNG: Import useTheme
import { sendMessageToAI, getConversations, getConversationHistory } from "../services/geminiAI";
import "../pages/style/AIConsultation.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function AIConsultation() {
  const { themeMode } = useTheme(); // <--- BỔ SUNG: Lấy themeMode
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
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

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

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const data = await getConversations();
      setConversations(data || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      // Don't show error message, just log it
    } finally {
      setLoadingConversations(false);
    }
  };

  const handleSelectConversation = async (selectedConvId) => {
    if (selectedConvId === conversationId) return;
    
    try {
      setLoadingHistory(true);
      const history = await getConversationHistory(selectedConvId);
      
      // Convert Qdrant messages to UI format
      const formattedMessages = history.map((msg, idx) => ({
        id: idx + 1,
        type: msg.role === "user" ? "user" : "ai",
        content: msg.content,
        timestamp: msg.timestamp 
          ? new Date(msg.timestamp).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
      }));

      // If no messages, show welcome message
      if (formattedMessages.length === 0) {
        setMessages([
          {
            id: 1,
            type: "ai",
            content: "Xin chào! Tôi là AI Tư Vấn M&M. Tôi có thể giúp bạn tư vấn về dinh dưỡng, thực đơn, và các mẹo nấu ăn. Bạn cần hỗ trợ gì hôm nay? 😊",
            timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setMessages(formattedMessages);
      }
      
      setConversationId(selectedConvId);
    } catch (error) {
      console.error("Failed to load conversation history:", error);
      message.error("Không thể tải lịch sử hội thoại");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([
      {
        id: 1,
        type: "ai",
        content: "Xin chào! Tôi là AI Tư Vấn M&M. Tôi có thể giúp bạn tư vấn về dinh dưỡng, thực đơn, và các mẹo nấu ăn. Bạn cần hỗ trợ gì hôm nay? 😊",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

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

      // Call Gemini AI (with persistent conversationId)
      const aiResponseData = await sendMessageToAI(
        userMessageContent,
        conversationHistory,
        conversationId
      );
      if (aiResponseData?.conversationId && aiResponseData.conversationId !== conversationId) {
        setConversationId(aiResponseData.conversationId);
        // Reload conversations list to include new conversation
        loadConversations();
      }

      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: aiResponseData?.message,
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
              {loadingHistory && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin tip="Đang tải lịch sử..." />
                </div>
              )}
              <div className="chat-messages" style={{ opacity: loadingHistory ? 0.5 : 1 }}>
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
              {/* Conversations History */}
              <Card 
                title={
                  <Space>
                    <HistoryOutlined />
                    <span>Lịch sử hội thoại</span>
                  </Space>
                }
                className="conversations-card"
                extra={
                  <Button 
                    type="text" 
                    icon={<PlusOutlined />} 
                    size="small"
                    onClick={handleNewConversation}
                  >
                    Mới
                  </Button>
                }
              >
                {loadingConversations ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                  </div>
                ) : conversations.length === 0 ? (
                  <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '20px' }}>
                    Chưa có hội thoại nào
                  </Text>
                ) : (
                  <List
                    dataSource={conversations}
                    renderItem={(conv) => (
                      <List.Item
                        style={{
                          cursor: 'pointer',
                          // SỬA LỖI: Dùng biến theme cho nền khi active/hover
                          backgroundColor: conv.conversationId === conversationId ? 'var(--color-primary-faded)' : 'transparent',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          marginBottom: '4px'
                        }}
                        className={conv.conversationId !== conversationId ? "conversation-item" : ""} // Thêm class cho hover
                        onClick={() => handleSelectConversation(conv.conversationId)}
                      >
                        <List.Item.Meta
                          title={
                            <Text ellipsis style={{ maxWidth: '200px' }}>
                              {conv.conversationId?.split('-').pop() || 'Hội thoại'}
                            </Text>
                          }
                          description={
                            <Space>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {conv.messageCount || 0} tin nhắn
                              </Text>
                              {conv.lastTimestamp && (
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  {new Date(conv.lastTimestamp).toLocaleDateString("vi-VN", {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Text>
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>

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