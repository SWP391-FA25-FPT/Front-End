import React from "react";
import Logo from "../Logo";
import { Container } from "react-bootstrap";
import { Button, ConfigProvider, Flex, Menu } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
import { useLocation } from "react-router-dom";
<<<<<<< Updated upstream:src/components/SideBar/index.jsx
=======
// 5. Thêm thư viện motion
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";
>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx

const Index = ({ collapsed, toggleCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

<<<<<<< Updated upstream:src/components/SideBar/index.jsx
=======
  // 1. Màu sắc: Định nghĩa chủ đề màu xanh ngọc (đã cập nhật)
  const tealTheme = {
    components: {
      Menu: {
        itemColor: "#004d40", // Chữ xanh đậm (trên nền nhạt)
        itemHoverColor: "#00695c", // Chữ xanh đậm hơn khi hover
        itemHoverBg: "#b2dfdb", // Nền xanh vừa khi hover
        itemSelectedBg: "#00695c", // 1. Nền xanh đậm khi được chọn
        itemSelectedColor: "#ffffff", // 1. Chữ trắng khi được chọn
        subMenuItemBg: "#e0f2f1", // 2. (Yêu cầu 2) Nền của submenu con (dropdown)
        subMenuItemSelectedColor: "#00695c", // Màu chữ submenu cha khi con được chọn
      },
    },
    token: {
      fontSize: 18,
      colorPrimary: "#00897b", // Màu chính
    },
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return '1';
    
    // 3. Dropdown: Cập nhật logic chọn cho Premium
    const premiumPaths = [
      '/ai-consultation', 
      '/nutritional-analysis', 
      '/meal-plan', 
      '/progress-tracking', 
      '/top-meal-plans'
    ];
    // Sửa logic: phải là '2' nếu path nằm trong premiumPaths
    if (premiumPaths.includes(path)) return '2'; 

    if (path === '/challenge' || path.startsWith('/challenge/')) return '3';
    if (path === '/blog' || path.startsWith('/blog/')) return '4';
    if (path === '/profile') return '6';
    if (path === '/support') return '7';
    if (path === '/admin') return '9';
    
    if (path.startsWith('/my-recipes/')) {
      if (path === '/my-recipes/all') return '8-1';
      if (path === '/my-recipes/saved') return '8-2';
      if (path === '/my-recipes/private') return '8-3';
      if (path === '/my-recipes/published') return '8-4';
      if (path === '/my-recipes/drafts') return '8-5';
      return '8';
    }
    return '1';
  };

>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx
  const baseItems = [
    {
      key: "1",
      icon: <Icon icon="ion:restaurant-outline" width="24" height="24" />,
      label: <a href="/">Trang Chủ</a>,
    },
    // 3. Dropdown: Chuyển Premium sang submenu
    {
      key: "2",
      icon: (
        <Icon
          icon="material-symbols:workspace-premium-outline"
          width="24"
          height="24"
        />
      ),
<<<<<<< Updated upstream:src/components/SideBar/index.jsx
      label: <a href="#" style={{color:"#A098AE"}}>Premium</a>,
      children: [
=======
      label: "Premium", // Chỉ là text
      children: [ // Thêm children
>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx
        {
          key: "2-1",
          icon: <Icon icon="mdi:robot-outline" width="24" height="24" />,
          label: <a href="/ai-consultation">AI Tư Vấn M&M</a>,
        },
        {
          key: "2-2",
          icon: <Icon icon="mdi:camera-outline" width="24" height="24" />,
          label: <a href="/nutritional-analysis">Phân tích Dinh Dưỡng Bằng Ảnh</a>,
        },
<<<<<<< Updated upstream:src/components/SideBar/index.jsx

=======
>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx
        {
          key: "2-3",
          icon: <Icon icon="mdi:food-outline" width="24" height="24" />,
          label: <a href="/meal-plan">Tạo Thực Đơn Premium</a>,
        },
        {
          key: "2-4",
          icon: <Icon icon="mdi:chart-line" width="24" height="24" />,
<<<<<<< Updated upstream:src/components/SideBar/index.jsx
          label: <a href="#">Theo Dõi Tiến Độ</a>,
=======
          label: <a href="/progress-tracking">Theo Dõi Tiến Độ</a>,
>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx
        },
        {
          key: "2-5",
          icon: <Icon icon="mdi:crown-outline" width="24" height="24" />,
<<<<<<< Updated upstream:src/components/SideBar/index.jsx
          label: <a href="#"> Top Thực Đơn Xem Nhiều Nhất</a>,
=======
          label: <a href="/top-meal-plans">Top Thực Đơn Xem Nhiều Nhất</a>,
>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx
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
<<<<<<< Updated upstream:src/components/SideBar/index.jsx
      label: <a href="#" style={{color:"#A098AE"}}>Kho Món Ngon Của Bạn</a>,
=======
      label: "Kho Món Ngon", // 2. (Yêu cầu 2) Chỉnh lại chữ: Bỏ thẻ <a>
>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx
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
          icon: <Icon icon="mdi:file-document-outline" width="24" height="24" />,
          label: <a href="#">Món Nháp</a>,
        },
      ],
    },
  ];

  const adminItem = {
    key: "9",
    icon: <Icon icon="mdi:shield-account" width="24" height="24" />,
    label: <a href="/admin">Admin</a>,
  };

  const items = user && user.role === 'admin' 
    ? [...baseItems, adminItem]
    : baseItems;

  // Determine selected key based on current location
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return '1';
    if (path === '/challenge' || path.startsWith('/challenge/')) return '3';
    if (path === '/blog' || path.startsWith('/blog/')) return '4';
    if (path === '/meal-plan') return '2-3'; // Premium submenu
    if (path === '/ai-consultation') return '2-1'; // AI Tư Vấn M&M
    if (path === '/nutritional-analysis') return '2-2'; // Phân tích Dinh Dưỡng Bằng Ảnh
    if (path === '/profile') return '6';
    if (path === '/support') return '7';
    if (path === '/admin') return '9';
    return '1'; // default to home
  };
  return (
<<<<<<< Updated upstream:src/components/SideBar/index.jsx
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
        <Container className={"tw:flex tw:flex-col tw:items-center tw:gap-4 tw:p-2"}>
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
            defaultOpenKeys={collapsed ? [] : getSelectedKey().startsWith('2-') ? ["2"] : ["6"]}
            className="tw:font-sans tw:font-semibold"
            inlineCollapsed={collapsed}
            style={{ border: "none" }}
          />
=======
    // 2. Sticky Sidebar: Thêm div bao bọc để xử lý cuộn nội bộ
    <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
      <ConfigProvider theme={tealTheme}>
        <Container className={"d-flex flex-column align-items-center gap-4 p-2"}>
          
          <div className="d-flex align-items-center justify-content-center w-100 position-relative">
            <Logo collapsed={collapsed} />
            {/* 5. Hiệu ứng: Thêm AnimatePresence cho nút toggle */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  key="btn-collapse-open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="position-absolute end-0"
                >
                  <Button
                    onClick={toggleCollapsed}
                    type="button"
                    size="small"
                  >
                    <Icon icon="mingcute:arrows-left-line" width="24" height="24" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {collapsed && (
              <motion.div
                key="btn-collapse-closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={toggleCollapsed}
                  type="button"
                  className="mb-1"
                  size="small"
                >
                  <Icon icon="mingcute:arrows-right-line" width="24" height="24" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. Hiệu ứng: Thêm motion.div cho Menu */}
          <motion.div
            key={collapsed ? 'menu-collapsed' : 'menu-expanded'}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-100"
          >
            <Menu
              selectedKeys={[getSelectedKey()]}
              mode="inline"
              items={items}
              // 1. (Yêu cầu 1) Xóa defaultOpenKeys để ngăn tự động mở
              // defaultOpenKeys={collapsed ? [] : ["2", "8"]} 
              className="font-sans fw-semibold"
              inlineCollapsed={collapsed}
              // 1. (Yêu cầu 2) Bỏ nền của Menu để nền của Sider hiển thị
              style={{ border: "none", backgroundColor: "transparent" }}
            />
          </motion.div>
>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx
        </Container>
      </ConfigProvider>
    </div>
  );
};

export default Index;
<<<<<<< Updated upstream:src/components/SideBar/index.jsx
=======

>>>>>>> Stashed changes:src/components/SideBar/SideBar.jsx
