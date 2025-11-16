// src/components/Message/MessageInput.jsx
// SỬA LỖI: Tự động focus lại input sau khi gửi

import React, { useState, useRef } from 'react'; // 1. Thêm useRef
import { Input, Button, Tooltip, App } from 'antd'; 
import { Send } from 'lucide-react'; 
import { sendMessage as sendMessageAPI } from '../../services/messageService'; 

const MessageInput = ({ conversationId }) => {
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false); 
    const { message } = App.useApp(); 
    
    // 2. Tạo ref cho input
    const inputRef = useRef(null); 

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedContent = content.trim();
        if (!trimmedContent || !conversationId || isSending) return;

        setIsSending(true);
        try {
            await sendMessageAPI(conversationId, trimmedContent);
            setContent('');
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error.message || error);
            message.error(error.message || "Không thể gửi tin nhắn. Vui lòng thử lại.");
        } finally {
            setIsSending(false);
            // 3. Focus lại input
            if (inputRef.current) {
                // Dùng setTimeout để đảm bảo focus sau khi DOM cập nhật
                setTimeout(() => inputRef.current.focus(), 0);
            }
        }
    };

    return (
        <form 
            onSubmit={handleSendMessage} 
            className="p-3 border-top" 
            style={{background: '#fafafa'}}
        >
            <Input.Group compact className="d-flex">
                <Input
                    ref={inputRef} // 4. Gán ref
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    size="large"
                    onPressEnter={handleSendMessage}
                    disabled={isSending}
                    style={{ flex: 1 }} 
                />
                <Tooltip title="Gửi (Enter)">
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<Send size={18} />}
                        size="large"
                        disabled={content.trim().length === 0 || isSending}
                        loading={isSending}
                    />
                </Tooltip>
            </Input.Group>
        </form>
    );
};

export default MessageInput;