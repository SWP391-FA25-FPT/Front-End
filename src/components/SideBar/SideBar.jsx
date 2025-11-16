// src/components/SideBar/SideBar.jsx
import React, { useState, useEffect } from "react";
import Logo from "../Logo/Logo";
import { Container } from "react-bootstrap";
// THÊM: Import 'Badge'
import { Button, ConfigProvider, Menu, Badge } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
// THÊM: Import 'useSocket' (sửa đường dẫn nếu cần)
import { useSocket } from "../../context/useSocket.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

const Index = ({ collapsed, toggleCollapsed }) => {
  const { user } = useAuth();
  // THÊM: Lấy unreadCount từ Socket Context
  const { unreadCount } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const profilePath = user?._id ? `/user/${user._id}` : "/";

  const IS_ADMIN = user && user.role === "admin";

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

    // -> THÊM LOGIC CHO TIN NHẮN
    if (path === "/messages" || path.startsWith("/messages/")) return "5-1";

    if (path === "/notifications" || path.startsWith("/notifications/"))
      return "5-2";
    
    // Key cha cho Thông Báo và Tin Nhắn
    if (path.startsWith("/notifications") || path.startsWith("/messages"))
      return "5";
    // <- END THÊM LOGIC CHO TIN NHẮN

    if (path.startsWith("/user/")) return "6-1";
    if (path === "/support") return "7";
    // ✅ ADD THIS (phần admin sidebar)
if (path.startsWith("/admin")) {
  if (path === "/admin/dashboard") return "admin-dashboard";
  if (path === "/admin/content-moderation") return "admin-content";
  if (path === "/admin/payment") return "admin-payment";
  if (path === "/admin/statistics") return "admin-statistics";
  if (path === "/admin/report") return "admin-report";
  if (path === "/admin/feedback") return "admin-feedback";
  if (path === "/admin/users") return "admin-users";
  if (path === "/admin/setting") return "admin-system-setting";
}
    if (path === "/profile" || path.startsWith("/profile/")) return "10";
    if (path === "/settings" || path.startsWith("/settings/")) return "6";

    if (path === "/support") return "7";
    // Logic Admin chi tiết
    if (path.startsWith("/admin")) {
      if (path === "/admin/dashboard") return "admin-dashboard";
      if (path === "/admin/content-moderation") return "admin-content";
      if (path === "/admin/payment") return "admin-payment";
      if (path === "/admin/statistics") return "admin-statistics";
      if (path === "/admin/report") return "admin-report";
      if (path === "/admin/feedback") return "admin-feedback";
      if (path === "/admin/users") return "admin-users";
      if (path === "/admin/setting") return "admin-system-setting";
      return "9"; // key tổng quát cho /admin
    }

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

  let baseItems = [
    {
      key: "1",
      icon: <Icon icon="ion:restaurant-outline" width="24" height="24" />,
      label: <a href="/">Trang Chủ</a>,
    },
    // ... giữ nguyên mục Premium (key 2)
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
    // ... giữ nguyên mục Thử Thách (key 3)
    {
      key: "3",
      icon: <Icon icon="mdi:trophy-outline" width="24" height="24" />,
      label: <a href="/challenge">Thử Thách</a>,
    },
    // ... giữ nguyên mục Blog (key 4)
    {
      key: "4",
      icon: <Icon icon="ion:restaurant-outline" width="24" height="24" />,
      label: <a href="/blog">Blog</a>,
    },
    // -> SỬA MỤC THÔNG BÁO THÀNH MỤC CHUNG (key 5)
    {
      key: "5",
      icon: <Icon icon="mdi:email-outline" width="24" height="24" />, // Đổi icon thành icon tin nhắn
      label: "Hộp thư",
      children: [
        {
          key: "5-1",
          icon: <Icon icon="mdi:message-text-outline" width="20" height="20" />, // Icon Tin Nhắn
          // ĐỂ NGUYÊN <a href> Ở ĐÂY, VÒNG LẶP SẼ XỬ LÝ BADGE
          label: <a href="/messages">Tin Nhắn</a>, 
        },
        {
          key: "5-2",
          icon: <Icon icon="mdi:bell-outline" width="20" height="20" />, // Icon Thông báo
          label: <a href="/notifications">Thông Báo</a>,
        },
      ],
    },
    // <- END SỬA MỤC THÔNG BÁO

    // ... giữ nguyên mục Cá Nhân (key 6)
    {
      key: "10",
      icon: <Icon icon="mdi:account-circle-outline" width="24" height="24" />,
      label: <a href="/profile">Hồ Sơ</a>,
    },
    {
      key: "6",
      icon: <Icon icon="ic:outline-settings" width="24" height="24" />,
      label: "Cá Nhân",
      children: [
        {
          key: "6-1",
          icon: <Icon icon="mdi:account-outline" width="20" height="20" />,
          label: (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate(profilePath)}
            >
              Hồ Sơ Cá Nhân
            </span>
          ),
        },
        {
          key: "6-2",
          icon: <Icon icon="mdi:comment-text-outline" width="20" height="20" />, // Sửa icon cho Feedback
          label: <a href="/feedback">Feedback</a>,
        },
      ],
    },
    // ... giữ nguyên các mục còn lại (Hỗ Trợ, Kho Món Ngon)
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

  // ... giữ nguyên adminMenuItems ...
  const adminMenuItems = [
    {
      key: "admin-dashboard",
      icon: <Icon icon="mdi:view-dashboard-outline" width="24" height="24" />,
      label: "Bảng Điều Khiển",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "admin-content",
      icon: <Icon icon="mdi:camera-outline" width="24" height="24" />,
      label: "Kiểm Duyệt Nội Dung",
      onClick: () => navigate("/admin/content-moderation"),
    },
    {
      key: "admin-payment",
      icon: <Icon icon="mdi:credit-card-outline" width="24" height="24" />,
      label: "Gói & Thanh Toán",
      onClick: () => navigate("/admin/payment"),
    },
    {
      key: "admin-statistics",
      icon: <Icon icon="mdi:chart-box-outline" width="24" height="24" />,
      label: "Thống Kê Hệ Thống",
      onClick: () => navigate("/admin/statistics"),
    },
    {
      key: "admin-report",
      icon: <Icon icon="mdi:flag-outline" width="24" height="24" />,
      label: "Báo Cáo Hệ Thống",
      onClick: () => navigate("/admin/report"),
    },
    {
      key: "admin-feedback",
      icon: <Icon icon="mdi:comment-outline" width="24" height="24" />,
      label: "Phản Hồi Người Dùng",
      onClick: () => navigate("/admin/feedback"),
    },
    {
      key: "admin-users",
      icon: <Icon icon="mdi:account-group-outline" width="24" height="24" />,
      label: "Quản Lý Người Dùng",
      onClick: () => navigate("/admin/users"),
    },
    {
      key: "admin-system-setting",
      icon: <Icon icon="mdi:cog-outline" width="24" height="24" />,
      label: "Cài đặt hệ thống",
      onClick: () => navigate("/admin/setting"),
    },
  ];

  // Thêm mục Admin vào menu nếu người dùng là Admin
  if (IS_ADMIN) {
    baseItems.push({
      key: "9",
      icon: <Icon icon="mdi:shield-account" width="24" height="24" />,
      label: "Admin",
      children: adminMenuItems,
    });
  }


  // 1. Logic cho GUEST (chưa login) - Đảm bảo rằng việc sửa đổi chỉ xảy ra khi user là null
  if (!user) {
    // Sửa đổi một bản sao của baseItems để tránh ảnh hưởng đến định nghĩa gốc
    baseItems = baseItems.map(item => ({...item, children: item.children ? [...item.children] : item.children}));
    
    // Blog (key 4)
    const blogIndex = baseItems.findIndex((item) => item.key === "4");
    if (blogIndex !== -1) {
      baseItems[blogIndex] = {
        ...baseItems[blogIndex],
        children: null,
        onClick: () => navigate("/login"),
      };
    }

    // Kho Món Ngon (key 8)
    const khoMonNgonIndex = baseItems.findIndex((item) => item.key === "8");
    if (khoMonNgonIndex !== -1) {
      baseItems[khoMonNgonIndex] = {
        ...baseItems[khoMonNgonIndex],
        children: null,
        onClick: () => navigate("/login"),
      };
    }

    // Premium (key 2)
    const premiumIndex = baseItems.findIndex((item) => item.key === "2");
    if (premiumIndex !== -1 && baseItems[premiumIndex].children) {
      // Hợp nhất logic chuyển hướng cho menu Premium
      baseItems[premiumIndex].children.forEach((childItem) => {
        childItem.label = childItem.label.props.children;
        childItem.onClick = () => navigate("/login");
      });
    }
    
    // Hộp thư (key 5 - bao gồm Thông Báo và Tin Nhắn)
    const inboxIndex = baseItems.findIndex((item) => item.key === "5");
    if (inboxIndex !== -1) {
      baseItems[inboxIndex] = {
        ...baseItems[inboxIndex],
        children: null,
        onClick: () => navigate("/login"),
      };
    }

    // Cá Nhân (key 6 - bao gồm Hồ Sơ và Feedback)
    const personalIndex = baseItems.findIndex((item) => item.key === "6");
    if (personalIndex !== -1) {
      baseItems[personalIndex] = {
        ...baseItems[personalIndex],
        children: null,
        onClick: () => navigate("/login"),
      };
    }
  }

  // 2. Chuyển đổi các thẻ <a> thành onClick cho tất cả người dùng
  baseItems.forEach((item) => {
    if (
      item.label &&
      typeof item.label === "object" &&
      item.label.type === "a"
    ) {
      const href = item.label.props.href;
      item.label = item.label.props.children;
      if (!item.onClick) {
        item.onClick = () => navigate(href);
      }
    }

    if (item.children) {
      item.children.forEach((child) => {
        if (
          child.label &&
          typeof child.label === "object" &&
          child.label.type === "a"
        ) {
          const href = child.label.props.href;
          let labelContent = child.label.props.children; // Lấy nội dung text (ví dụ: "Tin Nhắn")

          // SỬA ĐỔI: Thêm Badge vào 'Tin Nhắn' (key 5-1)
          if (child.key === "5-1" && unreadCount > 0) {
            child.label = (
              <Badge count={unreadCount} overflowCount={9} offset={[10, 0]}>
                {labelContent}
              </Badge>
            );
          } else {
            child.label = labelContent;
          }
          // KẾT THÚC SỬA ĐỔI

          if (!child.onClick) {
            child.onClick = () => navigate(href);
          }
        }
      });
    }
  });


  // Chọn menu hiển thị (user thường hoặc admin)
  const items = IS_ADMIN
    ? baseItems.find(item => item.key === "9").children // Admin chỉ thấy menu Admin (con của key 9)
    : baseItems; // User thường thấy menu user đầy đủ


  const [openKeys, setOpenKeys] = useState(() => {
    // Chỉ xử lý cho user thường
    if (IS_ADMIN) return [];

    const selectedKey = getSelectedKey();
    if (selectedKey.startsWith("2-") || selectedKey === "2") {
      return ["2"];
    }
    if (selectedKey.startsWith("4-") || selectedKey === "4") {
      return ["4"];
    }
    // -> THÊM logic cho Hộp thư (key 5)
    if (selectedKey.startsWith("5-") || selectedKey === "5") {
      return ["5"];
    }
    // <- END THÊM logic cho Hộp thư (key 5)
    if (selectedKey.startsWith("6-") || selectedKey === "6") {
      return ["6"];
    }
    if (selectedKey.startsWith("8-") || selectedKey === "8") {
      return ["8"];
    }
    return [];
  });

  // Hợp nhất logic useEffect từ cả hai phiên bản để xử lý mở/đóng menu khi thu gọn hoặc chuyển trang
  useEffect(() => {
    if (IS_ADMIN) {
      setOpenKeys([]); // Admin: luôn đóng dropdown (vì menu Admin không cần mở/đóng cấp cha)
      return;
    }

    if (collapsed) {
      setOpenKeys([]);
      return;
    }

    const selectedKey = getSelectedKey();
    let parentKey = null;

    if (selectedKey.includes("-")) {
      parentKey = selectedKey.split("-")[0];
    } else if (selectedKey === "2" || selectedKey === "4" || selectedKey === "5" || selectedKey === "8" || selectedKey === "9") {
      // Cập nhật key 5 vào danh sách menu cha
      parentKey = selectedKey; 
    }

    setOpenKeys((prevKeys) => {
      // Quan tâm đến menu Premium (2), Blog (4), Hộp thư (5), Cá Nhân (6) và Kho Món Ngon (8)
      const keysToManage = ["2", "4", "5", "6", "8"];
      let newKeys = prevKeys.filter(key => !keysToManage.includes(key));
      
      // Mở menu cha nếu đang ở route của nó
      if (parentKey && keysToManage.includes(parentKey) && !newKeys.includes(parentKey)) {
        newKeys.push(parentKey);
      }
      return newKeys;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, location.pathname, IS_ADMIN]); 

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
      <div className="premium-cta-expanded premium-sidebar-box">
        {/* DÒNG NÀY LÀ DIV GỐC, KHÔNG ĐƯỢC XÓA */}
        <div className="premium-cta-dots"></div>
        <div className="premium-cta-icon-wrapper">
          <Icon icon="mdi:crown" width="24" height="24" />
        </div>

        <h5 className="fw-bold mb-1 mt-2">Nâng cấp tài khoản</h5>
        <p className="mb-3 px-1 premium-text-secondary">
          Để nhận tính năng Premium
        </p>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "var(--color-bg-elevated)",
              colorText: "var(--color-warning)",
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

  return (
    // THAY ĐỔI: Loại bỏ Container và class name
    <div 
      className="d-flex flex-column align-items-center gap-4 p-2 sidebar-scroll-container" 
      style={{ backgroundColor: 'inherit' }} // Đảm bảo nền Sidebar tuân theo Ant Design Sider theme
    >
      <div className="d-flex align-items-center justify-content-center w-100 position-relative">
        <Logo collapsed={collapsed} />
        {/* Nút thu gọn / mở rộng */}
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
        className="font-sans fw-semibold w-100" // THAY ĐỔI: Đặt w-100 để Menu đầy đủ chiều rộng
        inlineCollapsed={collapsed}
        style={{ border: "none", backgroundColor: 'inherit' }} // THAY ĐỔI: Đảm bảo Menu thừa hưởng màu nền
      />

      {/* Chỉ hiển thị Premium CTA nếu không phải Admin */}
      {user && !IS_ADMIN && ( 
        <div className="w-100 d-flex justify-content-center">
          <PremiumCTA />
        </div>
      )}
    </div>
  );
};

export default Index;