// src/components/Message/MessageList.jsx
// SỬA LỖI: Thêm lại logic auto-scroll

import React, { useRef, useEffect } from 'react'; // 1. Thêm useRef, useEffect
import MessageItem from './MessageItem'; 
import { useAuth } from '../../context/useAuth'; 
import { useSocket } from '../../context/useSocket.jsx'; 

// Hàm helper (Giữ lại)
const getSenderId = (sender) => {
    if (typeof sender === 'string') return sender;
    if (typeof sender === 'object' && sender !== null && sender._id) return sender._id;
    if (typeof sender === 'object' && sender !== null && sender.id) return sender.id;
    return null; 
};

const MessageList = ({ messages, setMessages }) => {
    // 2. Thêm ref và logic auto-scroll
    const listRef = useRef(null);
    const { user } = useAuth(); 
    const { newMessageSignal } = useSocket(); 

    const scrollToBottom = () => {
        if (listRef.current) {
            // Dùng 'lastElementChild' để cuộn mượt hơn
            listRef.current.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 3. Tự động cuộn khi 'messages' thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    // Logic socket (Giữ nguyên, đã đúng)
    useEffect(() => {
        if (!newMessageSignal) return;
        setMessages(prev => {
            if (!newMessageSignal.messageId) {
                 if (!prev.find(msg => msg._id === newMessageSignal._id)) {
                    return [...prev, newMessageSignal]; 
                 } else {
                    return prev;
                 }
            }
            return prev.map(msg => {
                if (newMessageSignal.messageId === msg._id) {
                    if (newMessageSignal.newContent) {
                        return { ...msg, content: newMessageSignal.newContent, updatedAt: newMessageSignal.updatedAt };
                    }
                    if (newMessageSignal.conversationId) {
                        return { ...msg, isDeleted: true, updatedAt: newMessageSignal.updatedAt || new Date() };
                    }
                }
                return msg;
            });
        });
    }, [newMessageSignal, setMessages]);

    return (
        <div 
            ref={listRef} // 4. Gán ref
            className="p-3" 
        >
            {messages.length === 0 ? (
                <div className="text-center text-muted mt-5">
                    Bắt đầu cuộc trò chuyện.
                </div>
            ) : (
                messages.map((message) => {
                    const senderId = getSenderId(message.senderId);
                    const currentUserId = getSenderId(user);
                    const isMine = senderId && currentUserId ? (String(senderId) === String(currentUserId)) : false;

                    return (
                        <MessageItem 
                            key={message._id || message.createdAt} 
                            message={message} 
                            isMine={isMine} 
                        />
                    );
                })
            )}
        </div>
    );
};

export default MessageList;