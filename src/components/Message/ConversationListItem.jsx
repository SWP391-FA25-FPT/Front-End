// src/components/Message/ConversationListItem.jsx
// SỬA LỖI: Viết lại bằng Bootstrap 5 (d-flex, rounded-circle)

import React from 'react';
import { useAuth } from '../../context/useAuth';
import { useSocket } from '../../context/useSocket.jsx';

const ConversationListItem = ({ conversation, onSelectConversation, isSelected }) => {
    const { user } = useAuth();
    const { notifications } = useSocket(); 

    // Lấy thông tin người nhận (recipient)
    const recipient = conversation.members.find(m => String(m._id) !== String(user?._id));
    
    // Kiểm tra tin nhắn chưa đọc
    const hasUnread = notifications.some(
        (notif) => notif.conversationId === conversation._id
    );

    // Lấy nội dung tin nhắn cuối
    const lastMessageContent = conversation.lastMessage 
        ? (conversation.lastMessage.isDeleted ? 'Tin nhắn đã bị gỡ.' : conversation.lastMessage.content)
        : 'Chưa có tin nhắn nào.';
    
    // Lấy thời gian
    const lastMessageTime = conversation.lastMessage 
        ? new Date(conversation.lastMessage.createdAt || conversation.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        : '';
        
    // Lấy Avatar
    const avatarUrl = recipient?.profile?.avatar || `https://placehold.co/40x40/c0c0c0/ffffff?text=${recipient?.username?.charAt(0) || 'U'}`;

    // --- SỬA LỖI LAYOUT BẰNG BOOTSTRAP 5 ---
    return (
        <div
            // d-flex: Avatar và Content chung hàng
            className={`d-flex align-items-center p-3 border-bottom ${isSelected ? 'bg-primary-subtle' : 'bg-white'}`}
            style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
            onClick={() => onSelectConversation(conversation._id)}
        >
            {/* 1. AVATAR (position: relative để đặt chấm đỏ) */}
            <div className="position-relative flex-shrink-0 me-3">
                <img
                    src={avatarUrl}
                    alt={recipient?.username || 'User'}
                    // SỬA LỖI: 'rounded-circle' (Avatar hình tròn)
                    className="rounded-circle" 
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                {/* Chấm đỏ (dùng Bootstrap position-absolute) */}
                {hasUnread && (
                    <span 
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{width: '12px', height: '12px'}}
                    />
                )}
            </div>

            {/* 2. CONTENT (Username, Time, Last Message) */}
            <div className="flex-grow-1" style={{minWidth: 0}}>
                {/* Hàng 1: Username và Time (Chung hàng) */}
                <div className="d-flex justify-content-between align-items-center">
                    <p className="fw-semibold text-truncate mb-0">
                        {recipient?.username || 'Tài khoản đã xóa'}
                    </p>
                    <span className="text-muted" style={{fontSize: '0.75rem', marginLeft: '8px', flexShrink: 0}}>
                        {lastMessageTime}
                    </span>
                </div>
                {/* Hàng 2: Last Message */}
                <p className={`text-truncate mb-0 ${hasUnread ? 'fw-bold text-dark' : 'text-muted'}`} style={{fontSize: '0.85rem'}}>
                    {lastMessageContent}
                </p>
            </div>
        </div>
    );
};

export default ConversationListItem;