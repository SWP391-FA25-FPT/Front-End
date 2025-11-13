import React, { useState, useEffect } from "react";
import Logo from "../Logo/Logo";
import { Container } from "react-bootstrap";
import { Button, ConfigProvider, Menu } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
// NOTE: Sửa import, thêm useNavigate
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

const Index = ({ collapsed, toggleCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // NOTE: Thêm hook

  // Hàm này giữ nguyên, dùng để xác định mục nào đang active
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return "1";

    if (path === "/ai-consultation") return "2-1";
    if (path === "/nutritional-analysis") return "2-2";
    if (path === "/meal-plan") return "2-3";
    if (path === "/progress-tracking") return "2-4";
    if (path === "/top-meal-plans") return "2-5";
    if (
      path.startsWith("/ai-") ||
      path.startsWith("/nutritional-") ||
      path.startsWith("/meal-plan") ||
      path.startsWith("/progress-") ||
      path.startsWith("/top-")
    )
      return "2";

    if (path === "/challenge" || path.startsWith("/challenge/")) return "3";
    if (path === "/blog" || path.startsWith("/blog/")) return "4";

    if (path === "/profile") return "6";
    if (path === "/support") return "7";
    if (path === "/admin") return "9";

    if (path.startsWith("/my-recipes/")) {
      if (path === "/my-recipes/all") return "8-1";
      if (path === "/my-recipes/saved") return "8-2";
      if (path === "/my-recipes/private") return "8-3";
      if (path === "/my-recipes/published") return "8-4";
      if (path === "/my-recipes/drafts") return "8-5";
      return "8";
    }
    return "1";
  };

  // NOTE: Đây là baseItems gốc
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
      label: "Premium",
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
          label: <a href="/top-meal-plans"> Top Thực Đơn Xem Nhiều Nhất</a>,
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
      key: "6",
      icon: <Icon icon="ic:outline-settings" width="24" height="24" />,
      label: <a href="/profile">Hồ Sơ Cá Nhân</a>,
    },
    {
      key: "7",
      icon: <Icon icon="mdi:help-circle-outline" width="24" height="24" />,
      label: <a href="/support">Hỗ Trợ</a>,
    },
    {
      key: "8",
      icon: <Icon icon="mdi:folder-outline" width="24" height="24" />,
      label: "Kho Món Ngon",
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
          label: <a href="/my-recipes/all">Tất Cả</a>,
        },
        {
          key: "8-2",
          icon: <Icon icon="mdi:bookmark-outline" width="24" height="24" />,
          label: <a href="/my-recipes/saved">Đã Lưu</a>,
        },
        {
          key: "8-3",
          icon: <Icon icon="mdi:account-outline" width="24" height="24" />,
          label: <a href="/my-recipes/private">Món Của Tôi</a>,
        },
        {
          key: "8-4",
          icon: <Icon icon="et:global" width="24" height="24" />,
          label: <a href="/my-recipes/published">Đã Chia Sẻ</a>,
        },
        {
          key: "8-5",
          icon: (
            <Icon icon="mdi:file-document-outline" width="24" height="24" />
          ),
          label: <a href="/my-recipes/drafts">Món Nháp</a>,
        },
      ],
    },
  ];

  const adminItem = {
    key: "9",
    icon: <Icon icon="mdi:shield-account" width="24" height="24" />,
    label: <a href="/admin">Admin</a>,
  };

  // 1. Logic cho GUEST (chưa login)
  if (!user) {
    // Sửa "Kho Món Ngon" (key 8)
    const khoMonNgonIndex = baseItems.findIndex(item => item.key === "8");
    if (khoMonNgonIndex !== -1) {
      baseItems[khoMonNgonIndex] = {
        ...baseItems[khoMonNgonIndex],
        label: "Kho Món Ngon",
        children: null, // Xóa menu con
        onClick: () => navigate("/login"), // Thêm click chuyển sang login
      };
    }

    // Sửa "Premium" (key 2)
    const premiumIndex = baseItems.findIndex(item => item.key === "2");
    if (premiumIndex !== -1) {
      // Sửa các mục con bên trong
      baseItems[premiumIndex].children.forEach(childItem => {
        // Giữ nguyên text, bỏ thẻ <a>
        childItem.label = childItem.label.props.children; 
        childItem.onClick = () => navigate("/login"); // Thêm click chuyển sang login
      });
    }
  }

  // 2. Logic thay thế tất cả <a href> bằng onClick (chuẩn SPA)
  // Điều này áp dụng cho Guest (các mục còn lại) và User (tất cả các mục)
  baseItems.forEach(item => {
    // Xử lý mục cha
    if (item.label && typeof item.label === 'object' && item.label.type === 'a') {
      const href = item.label.props.href;
      item.label = item.label.props.children; // Chuyển <a>Text</a> thành "Text"
      if (!item.onClick) { // Chỉ thêm nếu chưa có onClick (tránh ghi đè guest logic)
        item.onClick = () => navigate(href);
      }
    }

    if (item.children) {
      item.children.forEach(child => {
        if (child.label && typeof child.label === 'object' && child.label.type === 'a') {
          const href = child.label.props.href;
          child.label = child.label.props.children;
          if (!child.onClick) { 
            child.onClick = () => navigate(href);
          }
        }
      });
    }
  });

  if (adminItem.label && typeof adminItem.label === 'object' && adminItem.label.type === 'a') {
    const href = adminItem.label.props.href;
    adminItem.label = adminItem.label.props.children;
    adminItem.onClick = () => navigate(href);
  }

  const items =
    user && user.role === "admin" ? [...baseItems, adminItem] : baseItems;

  const [openKeys, setOpenKeys] = useState(() => {
    const selectedKey = getSelectedKey();
    if (selectedKey.startsWith("2-") || selectedKey === "2") {
      return ["2"];
    }
    return [];
  });

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
    } else {
      const currentKey = getSelectedKey();
      if (currentKey.includes("-")) {
        const parentKey = currentKey.split("-")[0];
        setOpenKeys([parentKey]);
      } else {
        setOpenKeys([]); 
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, location.pathname]); 

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
      return;
    }

    const selectedKey = getSelectedKey();
    const isPremiumRoute = selectedKey === "2" || selectedKey.startsWith("2-");

    setOpenKeys((prevKeys) => {
      if (isPremiumRoute && !prevKeys.includes("2")) {
        return [...prevKeys, "2"];
      }

      if (!isPremiumRoute && prevKeys.includes("2")) {
        return prevKeys.filter((key) => key !== "2");
      }

      return prevKeys;
    });
  }, [location.pathname, collapsed]);

  const PremiumCTA = () => {
    if (collapsed) {
      return (
        <a
          href="/subscription"
          className="premium-cta-collapsed"
          title="Nâng Cấp Premium"
        >
          <Icon icon="mdi:diamond-stone" width="24" height="24" />
        </a>
      );
    }

    return (
      <div className="premium-cta-expanded">
        <div className="premium-cta-dots"></div>
        <div className="premium-cta-icon-wrapper">
          <Icon icon="mdi:crown" width="24" height="24" />
        </div>
        <h5 className="fw-bold mb-1 mt-2">Nâng cấp tài khoản</h5>
        <p className="mb-3 px-1">Để nhận tính năng Premium</p>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#FFFFFF",
              colorText: "#D97706",
            },
          }}
        >
          <Button
            type="primary"
            href="/subscription" 
            size="large"
            block
            className="premium-cta-button"
          >
            Nâng Cấp Ngay
          </Button>
        </ConfigProvider>
      </div>
    );
  };
  // ==========================================

  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemColor: "#69758fff",
              itemHoverColor: "#D97706",
              itemHoverBg: "#FFF8E1",
              itemSelectedBg: "#FEF3C7",
              itemSelectedColor: "#F59E0B",
              itemActiveBg: "#FDE68A",
              colorPrimary: "#F59E0B",
              subMenuItemBg: "#FFFFFF",
              subMenuItemColor: "#5C5100",
              subMenuItemHoverColor: "#FBBF24",
            },
          },
          token: {
            fontSize: 16,
          },
        }}
      >
        <Container
          className={
            "d-flex flex-column align-items-center gap-4 p-2 sidebar-scroll-container"
          }
        >
          <div className="d-flex align-items-center justify-content-center w-100 position-relative">
            <Logo collapsed={collapsed} />
            {!collapsed && (
              <Button
                onClick={toggleCollapsed}
                type="button"
                className="position-absolute end-0"
                size="small"
              >
                <Icon icon="mingcute:arrows-left-line" width="24" height="24" />
              </Button>
            )}
          </div>
          {collapsed && (
            <Button
              onClick={toggleCollapsed}
              type="button"
              className="mb-1"
              size="small"
            >
              <Icon icon="mingcute:arrows-right-line" width="24" height="24" />
            </Button>
          )}
          <Menu
            selectedKeys={[getSelectedKey()]}
            mode="inline"
            items={items} 
            openKeys={openKeys} 
            onOpenChange={setOpenKeys}
            className="font-sans fw-semibold"
            inlineCollapsed={collapsed}
            style={{ border: "none" }}
          />

          {user && user.role !== "admin" && (
            <div className="w-100 d-flex justify-content-center">
              <PremiumCTA />
            </div>
          )}
        </Container>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default Index;
