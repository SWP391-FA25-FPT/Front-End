import React from "react";
import Logo from "../Logo";
import { Container } from "react-bootstrap";
import { Button, ConfigProvider, Flex, Menu } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
import { useLocation } from "react-router-dom";

const Index = ({ collapsed, toggleCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  const baseItems = [
    {
      key: "1",
      icon: <Icon icon="ion:restaurant-outline" width="24" height="24" />,
      label: <a href="/">Trang Chủ</a>,
    },
    {
      key: "2",
      icon: (
        <Icon
          icon="material-symbols:workspace-premium-outline"
          width="24"
          height="24"
        />
      ),
      label: (
        <a href="#" style={{ color: "#A098AE" }}>
          Premium
        </a>
      ),
      children: [
        {
          key: "2-1",
          icon: <Icon icon="mdi:robot-outline" width="24" height="24" />,
          label: <a href="/ai-consultation">AI Tư Vấn M&M</a>,
        },
        {
          key: "2-2",
          icon: <Icon icon="mdi:camera-outline" width="24" height="24" />,
          label: (
            <a href="/nutritional-analysis">Phân tích Dinh Dưỡng Bằng Ảnh</a>
          ),
        },

        {
          key: "2-3",
          icon: <Icon icon="mdi:food-outline" width="24" height="24" />,
          label: <a href="/meal-plan">Tạo Thực Đơn Premium</a>,
        },
        {
          key: "2-4",
          icon: <Icon icon="mdi:chart-line" width="24" height="24" />,
          label: <a href="/progress-tracking">Theo Dõi Tiến Độ</a>,
        },
        {
          key: "2-5",
          icon: <Icon icon="mdi:crown-outline" width="24" height="24" />,
          label: <a href="/top-meal-plans">Top Thực Đơn Xem Nhiều Nhất</a>,
        },
      ],
    },
    {
      key: "3",
      icon: <Icon icon="mdi:trophy-outline" width="24" height="24" />,
      label: <a href="/challenge">Thử Thách</a>,
    },
    {
      key: "4",
      icon: <Icon icon="ion:restaurant-outline" width="24" height="24" />,
      label: <a href="/blog">Blog</a>,
    },
    {
      key: "5",
      icon: <Icon icon="mdi:bell-outline" width="24" height="24" />,
      label: <a href="#">Thông Báo</a>,
    },
    {
      key: "6",
      icon: <Icon icon="ic:outline-settings" width="24" height="24" />,
      label: <a href="/profile">Thiết Lập</a>,
    },
    {
      key: "7",
      icon: <Icon icon="mdi:help-circle-outline" width="24" height="24" />,
      label: <a href="/support">Hỗ Trợ</a>,
    },
    {
      key: "8",
      icon: <Icon icon="mdi:folder-outline" width="24" height="24" />,
      label: (
        <a href="#" style={{ color: "#A098AE" }}>
          Kho Món Ngon Của Bạn
        </a>
      ),
      children: [
        {
          key: "8-1",
          icon: (
            <Icon
              icon="material-symbols:menu-book-2-outline"
              width="24"
              height="24"
            />
          ),
          label: <a href="#">Tất Cả</a>,
        },
        {
          key: "8-2",
          icon: <Icon icon="mdi:bookmark-outline" width="24" height="24" />,
          label: <a href="#">Đã Lưu</a>,
        },
        {
          key: "8-3",
          icon: <Icon icon="mdi:account-outline" width="24" height="24" />,
          label: <a href="#">Món Của Tôi</a>,
        },
        {
          key: "8-4",
          icon: <Icon icon="et:global" width="24" height="24" />,
          label: <a href="#">Đã Chia Sẻ</a>,
        },
        {
          key: "8-5",
          icon: (
            <Icon icon="mdi:file-document-outline" width="24" height="24" />
          ),
          label: <a href="#">Món Nháp</a>,
        },
      ],
    },
  ];

  // Admin menu item - only show for admin users
  const adminItem = {
    key: "9",
    icon: <Icon icon="mdi:shield-account" width="24" height="24" />,
    label: <a href="/admin">Admin</a>,
  };

  // Combine base items with admin item if user is admin
  const items =
    user && user.role === "admin" ? [...baseItems, adminItem] : baseItems;

  // Determine selected key based on current location
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return "1";
    if (path === "/challenge" || path.startsWith("/challenge/")) return "3";
    if (path === "/blog" || path.startsWith("/blog/")) return "4";
    if (path === "/meal-plan") return "2-3"; // Premium submenu
    if (path === "/ai-consultation") return "2-1"; // AI Tư Vấn M&M
    if (path === "/nutritional-analysis") return "2-2"; // Phân tích Dinh Dưỡng Bằng Ảnh
    if (path === "/progress-tracking") return "2-4"; // Theo Dõi Tiến Độ
    if (path === "/top-meal-plans") return "2-5"; // Top Thực Đơn Xem Nhiều Nhất
    if (path === "/profile") return "6";
    if (path === "/support") return "7";
    if (path === "/admin") return "9";
    return "1"; // default to home
  };
  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemColor: "#A098AE",
              itemHoverColor: "#fff",
              itemHoverBg: "#F8B602",
              itemSelectedBg: "#F8B602",
              itemSelectedColor: "#fff",
              subMenuItemBg: "#fff",
              subMenuItemSelectedColor: " #F8B602",
            },
          },
          token: {
            fontSize: 18,
          },
        }}
      >
        <Container
          className={"tw:flex tw:flex-col tw:items-center tw:gap-4 p-2"}
        >
          <Flex space="between" gap={20} align="center" justify="center">
            <Logo collapsed={collapsed} />
            {!collapsed && (
              <Button onClick={toggleCollapsed} type="button">
                <Icon icon="mingcute:arrows-left-line" width="24" height="24" />
              </Button>
            )}
          </Flex>
          {collapsed && (
            <Button
              onClick={toggleCollapsed}
              type="button"
              className="tw:mb-1"
              size="small"
            >
              <Icon icon="mingcute:arrows-right-line" width="24" height="24" />
            </Button>
          )}
          <Menu
            selectedKeys={[getSelectedKey()]}
            mode="inline"
            items={items}
            defaultOpenKeys={
              collapsed ? [] : getSelectedKey().startsWith("2-") ? ["2"] : ["6"]
            }
            className="tw:font-sans tw:font-semibold"
            inlineCollapsed={collapsed}
            style={{ border: "none" }}
          />
        </Container>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default Index;
