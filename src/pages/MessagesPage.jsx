// src/pages/MessagesPage.jsx
// SỬA LỖI: Quay lại 'bottom: 0' để fix lỗi đè lên Footer

import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/AppLayout.jsx'; // 1. Giữ AppLayout wrapper
import { Input, Spin, Typography } from 'antd'; 
import { useSocket } from '../context/useSocket.jsx';
import { useAuth } from '../context/useAuth';
import { getMessagesHistory, getConversations } from '../services/messageService';
import ConversationList from '../components/Message/ConversationList';
import MessageInput from '../components/Message/MessageInput.jsx'; 
import { Search } from 'lucide-react'; 
import MessageList from '../components/Message/MessageList';

const { Title } = Typography;

const MessagesPage = () => {
    // --- Toàn bộ state và useEffect của bạn giữ nguyên ---
    const { isAuthenticated, user } = useAuth(); 
    const { 
        currentConversationId, 
        setCurrentConversationId, 
        conversations,
        setConversations,
        resetUnreadCount, 
    } = useSocket();

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // (Toàn bộ các useEffects... giữ nguyên y hệt)
    useEffect(() => {
        if (resetUnreadCount) {
            resetUnreadCount();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    useEffect(() => {
        if (!isAuthenticated || !isAuthenticated()) return; 
        
        const fetchConversations = async () => {
            try {
                const data = await getConversations();
                setConversations(data); 
                if (data.length > 0 && !currentConversationId) {
                    setCurrentConversationId(data[0]._id);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            } finally {
                setIsInitialLoad(false);
            }
        };

        if (conversations.length === 0 && isInitialLoad) {
            fetchConversations();
        } else {
             setIsInitialLoad(false);
        }
    }, [isAuthenticated, conversations.length, isInitialLoad, setConversations, setCurrentConversationId, currentConversationId]);

    useEffect(() => {
        if (!currentConversationId) {
            setMessages([]);
            return;
        }
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const data = await getMessagesHistory(currentConversationId, 1, 50); 
                setMessages(data.messages); 
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();
    }, [currentConversationId]);

    const recipient = conversations.find(c => c._id === currentConversationId)?.members.find(m => String(m._id) !== String(user?._id));
    const headerTitle = recipient?.username || 'Chọn cuộc trò chuyện';

    if (isInitialLoad) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </div>
            </Layout>
        );
    }
    
    // --- SỬA LỖI LAYOUT ---
    return (
        <Layout>
            {/* Div cha (position: relative) - Giữ nguyên */}
            <div 
                style={{ 
                    position: 'relative', 
                    height: '100%', 
                    margin: '-16px' // Hủy padding 16px của <Content>
                }}
            >
                {/* ==================================================
                  ===     ⬇️ SỬA LỖI CHÍNH NẰM Ở ĐÂY ⬇️           ===
                  ================================================== */}
                
                {/* Div con (position: absolute) */}
                <div 
                    className="border rounded-lg shadow-lg bg-white" 
                    style={{ 
                        position: 'absolute',
                        top: 0,
                        // Sửa 'bottom: -160px' (gây đè) thành 'bottom: 0'
                        bottom: 0, 
                        left: 0,
                        right: 0,
                        overflow: 'hidden'
                    }}
                >
                    {/* (Toàn bộ code bên trong (chia 2 cột) giữ nguyên y hệt) */}
                    <div className="row g-0 h-100">
                        {/* CỘT TRÁI (List) */}
                        <div className="col-12 col-sm-8 col-md-4 col-lg-3 border-end d-flex flex-column h-100">
                            {/* Search (Không cuộn) */}
                            <div className="p-3 border-bottom" style={{flexShrink: 0}}>
                                <Input 
                                    placeholder="Tìm kiếm hội thoại..."
                                    prefix={<Search className="text-gray-400" size={16} />}
                                />
                            </div>
                            {/* List (Cuộn độc lập) */}
                            <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
                                <ConversationList
                                    conversations={conversations}
                                    onSelectConversation={setCurrentConversationId}
                                    currentSelectedId={currentConversationId}
                                />
                            </div>
                        </div>

                        {/* CỘT PHẢI (Chat) */}
                        <div className="col-12 col-sm-4 col-md-8 col-lg-9 d-flex flex-column h-100">
                            {currentConversationId ? (
                                <React.Fragment>
                                    {/* Header (Không cuộn) */}
                                    <div className="p-3 border-bottom bg-light" style={{flexShrink: 0}}>
                                        <Title level={4} style={{ margin: 0 }}>
                                            <img 
                                                src={recipient?.profile?.avatar || 'https://placehold.co/40x40/c0c0c0/ffffff?text=U'}
                                                alt={headerTitle}
                                                style={{width: '32px', height: '32px', borderRadius: '50%', marginRight: '12px', objectFit: 'cover', display: 'inline-block'}}
                                            />
                                            {headerTitle}
                                        </Title>
                                    </div>

                                    {/* KHUNG CHAT (Cuộn độc lập) */}
                                    <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
                                        <MessageList 
                                            messages={messages} 
                                            setMessages={setMessages}
                                        />
                                    </div>

                                    {/* INPUT (Cố định ở dưới, không cuộn) */}
                                    <div style={{ flexShrink: 0 }}>
                                        <MessageInput conversationId={currentConversationId} />
                                    </div>
                                </React.Fragment>
                            ) : (
                                <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
                                    {conversations.length === 0 ? (
                                        <span>Bạn chưa có cuộc trò chuyện nào.</span>
                                    ) : (
                                        <span>Chọn một cuộc trò chuyện để xem tin nhắn.</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MessagesPage;