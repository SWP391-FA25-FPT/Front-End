import React from "react";
import { List, Avatar, Button, Spin, Empty, Typography } from "antd";
import { Icon } from "@iconify/react";

const typeIcons = {
  recipe_publish: "mdi:chef-hat",
  comment: "mdi:comment-outline",
  rating: "mdi:star-outline",
  reaction: "mdi:emoticon-happy-outline",
  admin: "mdi:shield-account",
  system: "mdi:information-outline",
};

const formatTimestamp = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

const NotificationList = ({
  notifications = [],
  loading = false,
  markingAll = false,
  onItemClick,
  onMarkAll,
}) => {
  const unreadCount = notifications.filter((item) => !item.readAt).length;

  return (
    <div
      style={{
        width: 360,
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #f0f0f0",
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          Thông báo
        </Typography.Title>
        <Button
          type="link"
          size="small"
          onClick={onMarkAll}
          disabled={unreadCount === 0}
          loading={markingAll}
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {loading ? (
          <div
            style={{
              padding: "40px 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            description="Không có thông báo mới"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: "24px 0" }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(item) => {
              const icon =
                typeIcons[item.type] || typeIcons.system;
              const isUnread = !item.readAt;
              const actorName = item.actor?.name || item.actor?.username || "Hệ thống";
              const avatarSrc =
                item.actor?.profile?.profileImageUrl ||
                item.actor?.profileImageUrl ||
                null;

              return (
                <List.Item
                  key={item._id}
                  style={{
                    backgroundColor: isUnread ? "#F5F7FF" : "white",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                    padding: "12px 16px",
                  }}
                  onClick={() => onItemClick && onItemClick(item)}
                >
                  <List.Item.Meta
                    avatar={
                      avatarSrc ? (
                        <Avatar src={avatarSrc} />
                      ) : (
                        <Avatar
                          icon={<Icon icon={icon} width="20" height="20" />}
                          style={{ backgroundColor: "#E0E7FF", color: "#4C51BF" }}
                        />
                      )
                    }
                    title={
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: isUnread ? 600 : 500 }}>
                          {item.title || actorName}
                        </span>
                        <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                          {formatTimestamp(item.createdAt)}
                        </Typography.Text>
                      </div>
                    }
                    description={
                      <Typography.Text style={{ whiteSpace: "pre-line" }}>
                        {item.message}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationList;


