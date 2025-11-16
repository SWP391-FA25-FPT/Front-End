import React, { useState } from 'react';
import { acceptRequest, declineRequest } from '../../apis/friendApi'; 
import { message, Spin, Button } from 'antd'; // Sử dụng Antd components

// Component này chỉ render các nút hành động cho thông báo kết bạn (type: friend_request)
const FriendRequestNotification = ({ notification, onAction }) => {
    const [loading, setLoading] = useState(false);
    
    // Lấy requestId từ metadata mà Back-end đã gửi
    // Giả định: notification.metadata = { requestId: '...', senderId: '...' }
    const requestId = notification.metadata?.requestId;
    
    // Nếu không có ID hoặc thông báo đã được đọc, không hiển thị nút
    if (!requestId || notification.readAt) {
        return null; 
    }

    const handleAction = async (actionType) => {
        setLoading(true);
        try {
            if (actionType === 'accept') {
                await acceptRequest(requestId);
                message.success(`Đã chấp nhận kết bạn với ${notification.actor.name || 'người gửi'}!`);
            } else if (actionType === 'decline') {
                await declineRequest(requestId);
                message.info('Đã từ chối lời mời.');
            }
            
            // QUAN TRỌNG: Gọi hàm callback để xóa thông báo khỏi list và cập nhật UI
            if (onAction) {
                onAction(notification._id);
            }
            
        } catch (error) {
            console.error(`Lỗi khi ${actionType} lời mời:`, error);
            const serverMessage = error.response?.data?.error || 'Không rõ.';
            message.error(`Lỗi khi xử lý lời mời: ${serverMessage}`);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return <Spin size="small" />;
    }

    return (
        <div className="d-flex gap-2">
            <Button 
                type="primary" 
                size="small"
                onClick={() => handleAction('accept')}
            >
                Chấp nhận
            </Button>
            <Button 
                danger 
                type="dashed" 
                size="small"
                onClick={() => handleAction('decline')}
            >
                Từ chối
            </Button>
        </div>
    );
};

export default FriendRequestNotification;