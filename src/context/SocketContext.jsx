// src/context/SocketContext.jsx
import React, { useEffect, createContext, useState, useRef } from "react";
import io from "socket.io-client";
import { getAuthToken } from "../utils/authUtils";
import { useAuth } from "./useAuth";
import { baseUrl } from "../utils/constants";

const SOCKET_ENDPOINT = baseUrl;

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  // Lấy ra userId ổn định để làm dependency
  const userId = user?._id;

  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [newMessageSignal, setNewMessageSignal] = useState(null);

  // --- 1. QUẢN LÝ KẾT NỐI SOCKET (ĐÃ SỬA) ---
  useEffect(() => {
    // Chỉ kết nối khi đã xác thực VÀ có userId
    if (isAuthenticated && isAuthenticated() && userId && !socketRef.current) {
      const token = getAuthToken();
      if (!token) return;

      const socket = io(SOCKET_ENDPOINT, {
        query: {
          token: token,
          userId: userId, // Sử dụng biến userId ổn định
        },
      });

      socketRef.current = socket;

      // --- 2. XỬ LÝ SỰ KIỆN KẾT NỐI (ĐÃ SỬA) ---
      socket.on("connect", () => {
        console.log("✅ Socket connected. ID:", socket.id);
        // Gửi sự kiện "join" LÊN SERVER (Backend server.js đang chờ sự kiện này)
        socket.emit("join", userId);
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected.", reason);
      });

      // --- 3. XỬ LÝ CÁC SỰ KIỆN REAL-TIME TỪ SERVER (ĐÃ SỬA) ---

      // SỬA: Tên sự kiện là 'newMessage' (khớp với message.controller.js)
      socket.on("newMessage", (message) => {
        console.log("Nhận được 'newMessage':", message);
        handleMessageReceived(message);
      });

      socket.on("messageUpdated", (data) => {
        console.log("Nhận được 'messageUpdated':", data);
        setNewMessageSignal(data);
        handleConversationUpdate(data.conversationId, "update");
      });

      socket.on("messageDeleted", (data) => {
        console.log("Nhận được 'messageDeleted':", data);
        setNewMessageSignal(data);
        handleConversationUpdate(data.conversationId, "delete");
      });

      // --- CLEANUP ---
      return () => {
        console.log("Cleanup: Ngắt kết nối socket.");
        socket.disconnect();
        socketRef.current = null;
      };
    }
    // FIX: Thay đổi dependency [isAuthenticated, user] thành [isAuthenticated, userId]
  }, [isAuthenticated, userId]);

  // --- 4. HÀM XỬ LÝ SỰ KIỆN CỤ THỂ ---
  const handleConversationUpdate = (
    conversationId,
    type,
    lastMessage = null
  ) => {
    setConversations((prev) => {
      const index = prev.findIndex((c) => c._id === conversationId);
      let updatedConversations = [...prev];

      if (index !== -1) {
        const conversation = updatedConversations[index];

        if (lastMessage) {
          conversation.lastMessage = lastMessage;
        }

        updatedConversations.splice(index, 1);
        updatedConversations.unshift(conversation);
      }

      return updatedConversations;
    });
  };

  const handleMessageReceived = (message) => {
    handleConversationUpdate(message.conversationId, "new", message);

    if (message.conversationId !== currentConversationId) {
      setNotifications((prev) => [...prev, message]);
    }

    setNewMessageSignal(message);
  };

  // --- 5. HÀM GỬI TIN NHẮN (ĐÃ XÓA) ---
  // Chúng ta sẽ dùng API REST (messageService) để gửi, không dùng socket.emit

  // --- 6. HÀM RESET COUNT ---
  const resetUnreadCount = () => {
    setNotifications([]);
  };

  // --- 7. GIÁ TRỊ CONTEXT (ĐÃ SỬA) ---
  const contextValue = {
    socket: socketRef.current,
    currentConversationId,
    setCurrentConversationId,
    notifications,
    setNotifications,
    unreadCount: notifications.length,
    resetUnreadCount,
    conversations,
    setConversations,
    newMessageSignal,
    // ĐÃ XÓA: sendMessage (vì không dùng socket để gửi)
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider };
