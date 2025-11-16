import React, { useState, useEffect, useCallback } from "react";
import AppLayout from "../components/layout/AppLayout"; 
import {
  Typography,
  Card,
  Tabs,
  List,
  Avatar,
  Button,
  Space,
  Empty,
  Spin,
  message,
} from "antd";
import { Icon } from "@iconify/react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../apis/notification";

// THÊM: Import component xử lý lời mời kết bạn (Cần phải tạo file này)
import FriendRequestNotification from "../components/Notifications/FriendRequestNotification"; 

const { Title } = Typography;
const { TabPane } = Tabs;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const resolveNotificationList = (response) => {
    // Logic trích xuất danh sách thông báo
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.notifications)) return response.notifications;
    return [];
  };

  const findNotificationId = (notification) =>
    notification?._id || notification?.id;

  const isUnread = (notification) =>
    !notification?.readAt && !notification?.read;
    
  // HÀM MỚI: Xử lý hành động từ các nút (Accept/Decline)
  const handleNotificationAction = useCallback((notificationId) => {
    // Logic này sẽ loại bỏ thông báo đã được xử lý ra khỏi danh sách hiển thị
    // Hoặc đánh dấu nó là đã đọc và force re-render
    setNotifications(prev => prev.filter(n => findNotificationId(n) !== notificationId));
    
    // Nếu ở tab 'unread', cần fetch lại để đảm bảo count đúng
    if (filter === 'unread') {
        fetchNotifications();
    }
  }, [filter]);


  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter === "unread" ? { unreadOnly: true } : {};
      const data = await getNotifications(params);
      setNotifications(resolveNotificationList(data));
    } catch (error) {
      console.error("Fetch notifications error:", error);
      message.error(error.message || "Lỗi khi tải thông báo");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  const handleMarkAsRead = (id) => {
    // ... (logic đánh dấu đã đọc giữ nguyên)
    if (!id) return;

    const target = notifications.find(
      (notification) => findNotificationId(notification) === id
    );

    if (!target) return;
    if (!isUnread(target)) return;
    
    // Optimistic update
    setNotifications((prev) =>
      prev.map((notification) =>
        findNotificationId(notification) === id
          ? {
              ...notification,
              read: true,
              readAt: notification.readAt || new Date().toISOString(),
            }
          : notification
      )
    );

    markNotificationRead(id).catch((error) => {
      console.error("Mark notification read error:", error);
      message.error(error.message || "Không thể đánh dấu thông báo");
      // Khôi phục trạng thái chưa đọc nếu API lỗi
      setNotifications((prev) =>
        prev.map((notification) =>
          findNotificationId(notification) === id
            ? { ...notification, read: false, readAt: null }
            : notification
        )
      );
    });
  };

  const handleMarkAllAsRead = () => {
    // ... (logic đánh dấu tất cả đã đọc giữ nguyên)
    if (notifications.length === 0) return;

    setMarkingAll(true);
    const readTimestamp = new Date().toISOString();

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
        readAt: notification.readAt || readTimestamp,
      }))
    );

    markAllNotificationsRead()
      .then(() => {
        if (filter === "unread") {
          fetchNotifications();
        }
      })
      .catch((error) => {
        console.error("Mark all notifications read error:", error);
        message.error("Không thể đánh dấu tất cả thông báo");
        fetchNotifications();
      })
      .finally(() => setMarkingAll(false));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter !== "unread") return true;
    return isUnread(n);
  });

  const unreadCount = notifications.filter((n) => isUnread(n)).length;

  const markAllButton = (
    <Button
      type="link"
      onClick={handleMarkAllAsRead}
      disabled={
        loading || markingAll || unreadCount === 0
      }
      loading={markingAll}
    >
      Đánh dấu tất cả là đã đọc
    </Button>
  );

  return (
    <AppLayout>
      <div style={{ padding: "16px 24px" }}>
        <Card
          title={<Title level={3}>Trung tâm thông báo</Title>}
          extra={markAllButton}
          style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" }}
        >
          <Tabs activeKey={filter} onChange={(key) => setFilter(key)}>
            <TabPane tab={`Tất cả (${notifications.length})`} key="all" />
            <TabPane
              tab={`Chưa đọc (${unreadCount})`}
              key="unread"
            />
          </Tabs>

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Empty description="Bạn không có thông báo nào" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={filteredNotifications}
              renderItem={(item) => {
                const unread = isUnread(item);
                
                // Logic Icon và màu sắc
                let iconName = "mdi:bell-outline";
                let bgColor = unread ? "#DBEAFE" : "#E5E7EB";
                let color = "#1D4ED8";
                
                if (item.type === 'friend_request') {
                    iconName = "mdi:account-plus";
                    bgColor = "#FFF3CD"; 
                    color = "#FFC107"; 
                }
                
                const title = item.title || "Thông báo";
                const description = item.message;
                const timestamp = item.createdAt || item.updatedAt;

                return (
                  // BỌC TRONG DIV ĐỂ FIX LỖI BỐ CỤC CỦA ANTD
                  <div
                    key={findNotificationId(item)}
                    // Chỉ đánh dấu đã đọc khi click nếu nó không phải là lời mời kết bạn 
                    onClick={item.type !== 'friend_request' ? () => handleMarkAsRead(findNotificationId(item)) : undefined}
                    style={{
                      opacity: unread ? 1 : 0.6,
                      cursor: unread && item.type !== 'friend_request' ? "pointer" : "default",
                      padding: '12px 0',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<Icon icon={iconName} />}
                          style={{
                            backgroundColor: bgColor,
                            color,
                            width: '32px', height: '32px', lineHeight: '32px', fontSize: '18px'
                          }}
                        />
                      }
                      title={
                        <span style={{ fontWeight: unread ? 600 : 400 }}>
                          {title}
                        </span>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          {description && <span>{description}</span>}
                          {timestamp && (
                            <span
                              style={{
                                color: "#9CA3AF",
                                fontSize: "12px",
                              }}
                            >
                              {new Date(timestamp).toLocaleString("vi-VN")}
                            </span>
                          )}
                        </Space>
                      }
                      style={{ marginBottom: 0 }} 
                    />
                    
                    {/* === LOGIC RENDER NÚT BẤM DỰA TRÊN TYPE (CĂN CHỈNH) === */}
                    {item.type === 'friend_request' && unread && (
                        <div style={{ marginLeft: '48px', marginTop: '8px' }}> 
                            <FriendRequestNotification 
                                notification={item} 
                                onAction={handleNotificationAction} 
                            />
                        </div>
                    )}
                    {/* === END LOGIC RENDER NÚT BẤM === */}
                    
                  </div>
                );
              }}
            />
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default NotificationPage;