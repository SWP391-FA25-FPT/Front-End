import React, { useState, useCallback, useEffect } from "react";
import { Layout, Button, Typography, Dropdown, message } from "antd"; 
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import User from "../User/User";
import CreateButton from "../CreateButton/CreateButton";
import SearchBar from "../SearchBar/SearchBar";
import NotificationBell from "../Notifications/NotificationBell";
import NotificationList from "../Notifications/NotificationList";
import { useAuth } from "../../context/useAuth";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../apis/notification";
// NOTE: 1. Import hook useTheme
import { useTheme } from "../../context/ThemeContext.jsx";

const SettingLayout = ({ children, hideUserActions = false }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  // NOTE: 2. Lấy themeMode
  const { themeMode } = useTheme();

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
      } else if (notification.blog?._id) {
        navigate(`/blog/${notification.blog._id}`);
      }
    } catch (error) {
      message.error(error.message || "Không thể mở thông báo");
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      {/* NOTE: 3. ĐÃ XÓA backgroundColor */}
      <Layout style={{ padding: "5px" }}>
        <Sider
          // NOTE: 3. Sửa 'theme="light"' thành 'theme={themeMode}'
          theme={themeMode}
          width={265}
          style={{
            minHeight: "calc(100vh - 10px)",
            borderRadius: "8px",
            overflow: "hidden",
            // NOTE: 3. XÓA HẾT 'backgroundColor'
          }}
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        </Sider>
        <Layout
          style={{ borderRadius: "8px", overflow: "hidden", marginLeft: "5px" }}
        >
          <Header
            style={{
              // NOTE: 3. ĐÃ XÓA backgroundColor
              borderRadius: "8px",
              margin: "0 8px 0 8px",
            }}
            className="d-flex align-items-center justify-content-between"
          >
            <div>
              <Button
                onClick={handleBack}
                shape="circle"
                icon={<Icon icon="lsicon:left-filled" width="24" height="24" />}
                size="large"
              />
            </div>
            <div className="d-flex align-items-center gap-3">
              <SearchBar />
              
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                open={dropdownOpen}
                onOpenChange={handleDropdownOpenChange}
                dropdownRender={() => (
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

              {!hideUserActions && (
                <>
                  <User />
                  <CreateButton />
                </>
              )}
            </div>
          </Header>
          <Content
            style={{
              margin: "8px",
              // NOTE: 3. ĐÃ XÓA backgroundColor
              borderRadius: "8px",
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: "start" }}>
            <Foot />
          </Footer>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default SettingLayout;