// src/components/Message/MessageItem.jsx
// NÂNG CẤP: Chuyển thời gian lên cùng hàng (sửa style)

import React, { useState } from 'react';
import { Popconfirm, Input, Button, App } from 'antd';
import { Edit, Trash2, X, Check } from 'lucide-react';
import { updateMessageContent, deleteMessage } from '../../services/messageService';

// --- ĐỊNH NGHĨA STYLE ---
const styles = {
    messageContainer: { width: '100%', display: 'flex', marginBottom: '8px' },
    messageContainer_isMine: { justifyContent: 'flex-end' },
    messageContainer_isTheirs: { justifyContent: 'flex-start' },
    messageWrapper: { display: 'flex', alignItems: 'flex-end', maxWidth: '80%', position: 'relative' },
    avatar: { width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px', objectFit: 'cover', flexShrink: 0 },
    
    // SỬA LỖI: Đổi 'flexDirection' thành 'row' để đưa thời gian lên cùng hàng
    bubbleWrapper: { 
        display: 'flex', 
        alignItems: 'flex-end', // Căn đáy (bubble và time)
        gap: '8px' // Khoảng cách giữa bubble và time
    },
    
    bubble: { padding: '8px 12px', borderRadius: '12px' },
    bubble_isMine: { backgroundColor: '#007bff', color: 'white' },
    bubble_isTheirs: { backgroundColor: '#e9ecef', color: '#333' },
    content: { margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
    content_deleted: { fontStyle: 'italic', fontSize: '14px', color: '#6c757d' },
    
    // SỬA LỖI: Bỏ 'marginTop', 'textAlign'
    time: { 
        fontSize: '11px', 
        color: '#6c757d', 
        flexShrink: 0, // Không co lại
        marginBottom: '2px' // Căn chỉnh với đáy bubble
    },
    
    actionsWrapper: {
        display: 'flex', position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', padding: '2px',
    },
    actionsWrapper_isMine: { left: 0, transform: 'translate(-105%, -50%)' },
    actionsWrapper_isTheirs: { right: 0, transform: 'translate(105%, -50%)' },
    actionButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    editInputWrapper: { display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' },
    editInputActions: { display: 'flex', gap: '4px', justifyContent: 'flex-end' },
    editedMark: { fontSize: '10px', color: '#aaa', marginLeft: '5px' }
};

// --- COMPONENT ---
const MessageItem = ({ message, isMine }) => {
    const { _id, senderId, content, createdAt, updatedAt, isDeleted } = message;
    const { message: antMessage } = App.useApp(); 

    const [isHovering, setIsHovering] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [isLoading, setIsLoading] = useState(false);

    // --- Các hàm xử lý sự kiện (Giữ nguyên) ---
    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteMessage(_id);
        } catch (error) {
            antMessage.error(error.message || "Không thể xóa tin nhắn");
        }
    };
    const handleEdit = async () => {
        const trimmedContent = editedContent.trim();
        if (trimmedContent === content || trimmedContent.length === 0) {
            setIsEditing(false);
            setEditedContent(content);
            return;
        }
        setIsLoading(true);
        try {
            await updateMessageContent(_id, trimmedContent);
            setIsEditing(false);
        } catch (error) {
            antMessage.error(error.message || "Không thể sửa tin nhắn");
        } finally {
            setIsLoading(false);
        }
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(content);
    };

    // --- Các biến phụ (Giữ nguyên) ---
    const sender = isMine ? null : senderId;
    const isSenderObject = sender && typeof sender === 'object';
    const avatar = isSenderObject ? (sender.profile?.avatar || `https://placehold.co/40x40/c0c0c0/ffffff?text=${sender.username?.charAt(0) || 'U'}`) : `https://placehold.co/40x40/c0c0c0/ffffff?text=U`;
    const time = new Date(createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const isEdited = new Date(updatedAt).getTime() > new Date(createdAt).getTime() + 1000; // Thêm 1s đệm

    // --- Áp dụng style ---
    const finalContainerStyle = { ...styles.messageContainer, ...(isMine ? styles.messageContainer_isMine : styles.messageContainer_isTheirs) };
    const finalBubbleStyle = { ...styles.bubble, ...(isMine ? styles.bubble_isMine : styles.bubble_isTheirs) };
    
    // SỬA LỖI: Đảo thứ tự bubble và time cho 'isMine'
    const finalBubbleWrapperStyle = {
        ...styles.bubbleWrapper,
        // Tin của mình: [Bubble] [Time] (DOM) -> [Time] [Bubble] (Visual)
        // Tin của người: [Bubble] [Time] (DOM) -> [Bubble] [Time] (Visual)
        flexDirection: isMine ? 'row-reverse' : 'row' 
    };
    
    const finalActionsStyle = { ...styles.actionsWrapper, ...(isMine ? styles.actionsWrapper_isMine : styles.actionsWrapper_isTheirs) };

    // --- RENDER ---
    return (
        <div 
            style={finalContainerStyle}
            onMouseEnter={() => !isDeleted && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div style={styles.messageWrapper}>
                
                {!isMine && ( <img src={avatar} alt={isSenderObject ? sender.username : 'User'} style={styles.avatar} /> )}
                
                {/* SỬA LỖI: Sắp xếp lại bubble và time */}
                <div style={finalBubbleWrapperStyle}>
                    {/* 1. Bong bóng chat */}
                    <div style={finalBubbleStyle}>
                        {isDeleted ? (
                            <p style={styles.content_deleted}>Tin nhắn đã bị gỡ.</p>
                        ) : isEditing ? (
                            // Giao diện Edit (Giữ nguyên)
                            <div style={styles.editInputWrapper}>
                                <Input.TextArea 
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                />
                                <div style={styles.editInputActions}>
                                    <Button size="small" icon={<X size={14} />} onClick={handleCancelEdit} disabled={isLoading}>Hủy</Button>
                                    <Button size="small" type="primary" icon={<Check size={14} />} onClick={handleEdit} loading={isLoading}>Lưu</Button>
                                </div>
                            </div>
                        ) : (
                            // Giao diện Hiển thị
                            <p style={styles.content}>
                                {content}
                                {isEdited && <span style={styles.editedMark}>(đã chỉnh sửa)</span>}
                            </p>
                        )}
                    </div>
                    
                    {/* 2. Thời gian (luôn nằm ngoài bubble) */}
                    {!isEditing && !isDeleted && (
                        <span style={styles.time}>{time}</span>
                    )}
                </div>
                
                {/* Nút bấm (Giữ nguyên) */}
                {isHovering && !isEditing && isMine && !isDeleted && (
                    <div style={finalActionsStyle}>
                        <button style={styles.actionButton} onClick={() => setIsEditing(true)}>
                            <Edit size={14} color="#555" />
                        </button>
                        <Popconfirm
                            title="Xác nhận xóa?"
                            description="Bạn không thể hoàn tác."
                            onConfirm={handleDelete}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isLoading }}
                        >
                            <button style={styles.actionButton}>
                                <Trash2 size={14} color="#E74C3C" />
                            </button>
                        </Popconfirm>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageItem;