import React, { useState, useEffect, useCallback } from "react";
// NOTE: Thêm import AppLayout
import AppLayout from "../components/layout/AppLayout"; 
import {
  Layout,
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

const { Title } = Typography;
const { TabPane } = Tabs;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const resolveNotificationList = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.notifications)) return response.notifications;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.items)) return response.items;
    return [];
  };

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

  const findNotificationId = (notification) =>
    notification?._id || notification?.id;

  const isUnread = (notification) =>
    !notification?.readAt && !notification?.read;

  const handleMarkAsRead = (id) => {
    if (!id) return;

    const target = notifications.find(
      (notification) => findNotificationId(notification) === id
    );

    if (!target) {
      return;
    }

    if (!isUnread(target)) {
      return;
    }

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
        message.error(error.message || "Không thể đánh dấu tất cả thông báo");
        // Khôi phục trạng thái cũ nếu thất bại
        fetchNotifications();
      })
      .finally(() => setMarkingAll(false));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter !== "unread") return true;
    return isUnread(n);
  });

  const markAllButton = (
    <Button
      type="link"
      onClick={handleMarkAllAsRead}
      disabled={
        loading ||
        markingAll ||
        notifications.length === 0 ||
        notifications.every((n) => !isUnread(n))
      }
      loading={markingAll}
    >
      Đánh dấu tất cả là đã đọc
    </Button>
  );

  return (
    // NOTE: Bọc toàn bộ nội dung trong <AppLayout>
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
              tab={`Chưa đọc (${notifications.filter((n) => isUnread(n)).length})`}
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
                const iconName = item.icon || "mdi:bell-outline";
                const bgColor = item.bgColor || (unread ? "#DBEAFE" : "#E5E7EB");
                const color = item.color || "#1D4ED8";
                const title =
                  item.title ||
                  item.message ||
                  item.actor?.name ||
                  "Thông báo";
                const description = item.description || item.message;
                const timestamp = item.date || item.createdAt || item.updatedAt;

                return (
                  <List.Item
                    onClick={() => handleMarkAsRead(findNotificationId(item))}
                    style={{
                      opacity: unread ? 1 : 0.6,
                      cursor: unread ? "pointer" : "default",
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<Icon icon={iconName} />}
                          style={{
                            backgroundColor: bgColor,
                            color,
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
                    />
                  </List.Item>
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