// src/apis/friendApi.js (Giữ nguyên, chỉ kiểm tra lại)
import axios from 'axios';
// (Em giả định đường dẫn này đúng, dựa theo file messageService.js của anh)
import { getAuthToken } from '../utils/authUtils'; 

// Cùng một BASE URL với các service khác
const API_BASE_URL = 'http://localhost:7860/api';

// 1. Tạo một instance axios riêng cho file này
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Gắn Interceptor (giống hệt messageService)
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Export các hàm API mà mình đã định nghĩa

// Gửi lời mời kết bạn
export const sendRequest = (recipientId) => {
  // Logic gọi API đã đúng, vấn đề là ở front-end không cập nhật trạng thái sau khi gửi thành công
  return api.post('/friends/request', { recipientId });
};

// Chấp nhận lời mời
export const acceptRequest = (requestId) => {
  return api.post(`/friends/accept/${requestId}`);
};

// Từ chối / Hủy lời mời
export const declineRequest = (requestId) => {
  return api.post(`/friends/decline/${requestId}`);
};

// Hủy kết bạn
export const unfriend = (friendId) => {
  return api.post('/friends/unfriend', { friendId });
};

// Lấy danh sách bạn bè (cho trang Message)
export const getMyFriends = () => {
  return api.get('/friends/me');
};