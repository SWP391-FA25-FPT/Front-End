// src/services/messageService.js
// FIX: Sửa lỗi đường dẫn cho update/delete

import axios from 'axios';
import { getAuthToken } from '../utils/authUtils'; 

const API_BASE_URL = 'http://localhost:7860/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

// --- CONVERSATION API (Đã đúng) ---

export const createOrGetConversation = async (recipientId) => {
    try {
        const response = await api.post('/conversations', { recipientId });
        return response.data.conversation; 
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getConversations = async () => {
    try {
        const response = await api.get('/conversations');
        return response.data.conversations; 
    } catch (error) {
        throw error.response?.data || error;
    }
};

// --- MESSAGE API (Sửa đường dẫn update/delete) ---

export const getMessagesHistory = async (conversationId, page = 1, limit = 50) => {
    try {
        const response = await api.get(`/conversations/${conversationId}/messages`, {
            params: { page, limit }
        });
        return response.data; 
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const sendMessage = async (conversationId, content) => {
    try {
        const response = await api.post(`/conversations/${conversationId}/messages`, {
            content 
        });
        return response.data.newMessage; 
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateMessageContent = async (messageId, newContent) => {
    try {
        // FIX: Giả định endpoint sửa tin nhắn là /messages/:messageId
        const response = await api.put(`/messages/${messageId}`, { content: newContent });
        return response.data; 
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteMessage = async (messageId) => {
    try {
        // FIX: Giả định endpoint xóa tin nhắn là /messages/:messageId
        const response = await api.delete(`/messages/${messageId}`);
        return response.data; 
    } catch (error) {
        throw error.response?.data || error;
    }
};