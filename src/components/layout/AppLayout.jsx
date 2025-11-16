import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Typography, Dropdown, message } from "antd";
import { useAuth } from "../../context/useAuth";
import SideBar from "../SideBar/SideBar";
import Head from "./Header";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import SearchBar from "../SearchBar/SearchBar";
import NotificationBell from "../Notifications/NotificationBell";
import NotificationList from "../Notifications/NotificationList";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../apis/notification";
import { useTheme } from "../../context/ThemeContext.jsx";


const AppLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const {Title} = Typography;

  const userId = user?._id;

  const fetchNotifications = useCallback(
    async (options = {}) => {
      if (!userId) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        setLoadingNotifications(true);
        const response = await getNotifications({
          limit: 10,
          ...options,
        });

        setNotifications(response.data || []);
        setUnreadCount(response.meta?.unreadCount ?? 0);
      } catch (error) {
        message.error(error.message || "Không thể tải thông báo");
      } finally {
        setLoadingNotifications(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setDropdownOpen(false);
    }
  }, [userId, fetchNotifications]);

  const handleDropdownOpenChange = (open) => {
    if (open) {
      if (!userId) {
        message.info("Vui lòng đăng nhập để xem thông báo");
        return;
      }
      setDropdownOpen(true);
      fetchNotifications();
    } else {
      setDropdownOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId || unreadCount === 0) return;

    try {
      setMarkingAll(true);
      await markAllNotificationsRead();
      const now = new Date().toISOString();
      setNotifications((prev) =>
        prev.map((item) => (item.readAt ? item : { ...item, readAt: now }))
      );
      setUnreadCount(0);
    } catch (error) {
      message.error(error.message || "Không thể cập nhật thông báo");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification) return;

    try {
      if (!notification.readAt) {
        await markNotificationRead(notification._id);
        const timestamp = new Date().toISOString();
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? { ...item, readAt: timestamp }
              : item
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      setDropdownOpen(false);

      if (notification.metadata?.url) {
        navigate(notification.metadata.url);
      } else if (notification.metadata?.route) {
        navigate(notification.metadata.route);
      } else if (notification.recipe?._id) {
        navigate(`/recipe/${notification.recipe._id}`);
      }
    } catch (error) {
      message.error(error.message || "Không thể mở thông báo");
    }
  };
  const { themeMode } = useTheme();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Màu nền phân cách (container) và khối nổi (elevated)
  const containerBg = themeMode === "dark" ? "#2a2a2a" : "#f5f5f5"; // đậm hơn để phân biệt
  const elevatedBg = themeMode === "dark" ? "#1f1f1f" : "#ffffff";

  const componentShadow = {
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  return (
    <React.Fragment>
      <Layout style={{ minHeight: "100vh", backgroundColor: containerBg }}>
        <Sider
          theme={themeMode}
          width={265}
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            backgroundColor: elevatedBg, // làm Sidebar nổi bật
          }}
          collapsed={collapsed}
          breakpoint="lg"
          onCollapse={setCollapsed}
        >
          <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        </Sider>

        <Layout style={{ overflowY: "auto", backgroundColor: containerBg }}>
          <Header
            style={{
              backgroundColor: elevatedBg,
              margin: "8px",
              borderRadius: "8px",
              ...componentShadow,
            }}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="d-none d-lg-flex align-items-center gap-2 ms-4">
              <Icon
                icon="mdi:hand-wave"
                width="24"
                height="24"
                className="bounce-animation"
                style={{ color: "#F8B602" }}
              />

              <Title level={3} className="m-0 gradient-text pulse-animation">
                Hello, {user?.username || "User"}
              </Title>
            </div>

            <div className="d-flex align-items-center gap-3">
              <SearchBar />

              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                open={dropdownOpen}
                onOpenChange={handleDropdownOpenChange}
                popupRender={() => (
                  <NotificationList
                    notifications={notifications}
                    loading={loadingNotifications}
                    markingAll={markingAll}
                    onItemClick={handleNotificationClick}
                    onMarkAll={handleMarkAllRead}
                  />
                )}
              >
                <div>
                  <NotificationBell
                    count={unreadCount}
                    loading={loadingNotifications && dropdownOpen}
                  />
                </div>
              </Dropdown>

              <Head />
            </div>
          </Header>

          <Content
            style={{
              backgroundColor: elevatedBg,
              margin: "8px",
              marginTop: 0,
              borderRadius: "8px",
              padding: "16px",
              ...componentShadow,
            }}
          >
            {children}
          </Content>

          <Footer
            style={{
              textAlign: "start",
              padding: 0,
              backgroundColor: elevatedBg,
            }}
          >
            <Foot />
          </Footer>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default AppLayout;
