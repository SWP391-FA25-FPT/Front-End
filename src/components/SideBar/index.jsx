import React from "react";
import Logo from "../Logo";
import { Container } from "react-bootstrap";
import { Button, ConfigProvider, Flex, Menu, Dropdown } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
import { useLocation } from "react-router-dom";

const Index = ({ collapsed, toggleCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine selected key based on current location
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return '1';
    if (path === '/challenge' || path.startsWith('/challenge/')) return '3';
    if (path === '/blog' || path.startsWith('/blog/')) return '4';
    if (path === '/meal-plan') return '2'; // Premium dropdown
    if (path === '/ai-consultation') return '2'; // Premium dropdown
    if (path === '/nutritional-analysis') return '2'; // Premium dropdown
    if (path === '/progress-tracking') return '2'; // Premium dropdown
    if (path === '/top-meal-plans') return '2'; // Premium dropdown
    if (path === '/profile') return '6';
    if (path === '/support') return '7';
    if (path === '/admin') return '9';
    return '1'; // default to home
  };

  // Premium dropdown items
  const premiumDropdownItems = [
    {
      key: "2-1",
      icon: <Icon icon="mdi:robot-outline" width="24" height="24" />,
      label: <a href="/ai-consultation" style={{color: "#6c757d"}}>AI Tư Vấn M&M</a>,
    },
    {
      key: "2-2",
      icon: <Icon icon="mdi:camera-outline" width="24" height="24" />,
      label: <a href="/nutritional-analysis" style={{color: "#6c757d"}}>Phân tích Dinh Dưỡng Bằng Ảnh</a>,
    },
    {
      key: "2-3",
      icon: <Icon icon="mdi:food-outline" width="24" height="24" />,
      label: <a href="/meal-plan" style={{color: "#6c757d"}}>Tạo Thực Đơn Premium</a>,
    },
    {
      key: "2-4",
      icon: <Icon icon="mdi:chart-line" width="24" height="24" />,
      label: <a href="/progress-tracking" style={{color: "#6c757d"}}>Theo Dõi Tiến Độ</a>,
    },
    {
      key: "2-5",
      icon: <Icon icon="mdi:crown-outline" width="24" height="24" />,
      label: <a href="/top-meal-plans" style={{color: "#6c757d"}}> Top Thực Đơn Xem Nhiều Nhất</a>,
    },
  ];

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
        <Dropdown
          menu={{ 
            items: premiumDropdownItems,
            style: {
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }
          }}
          placement="rightTop"
          trigger={['click']}
          overlayStyle={{
            backgroundColor: '#fff',
          }}
        >
          <a 
            href="#" 
            style={{
              color: "#606060",
              transition: 'color 0.3s ease',
            }}
            className={`premium-link ${getSelectedKey() === '2' ? 'selected' : ''}`}
            onClick={(e) => e.preventDefault()}
          >
            Premium
          </a>
        </Dropdown>
      ),
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
      label: <a href="#" style={{color:"#606060"}} title="Kho Món Ngon Của Bạn">Kho Món Ngon</a>,
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

  // Admin menu item - only show for admin users
  const adminItem = {
    key: "9",
    icon: <Icon icon="mdi:shield-account" width="24" height="24" />,
    label: <a href="/admin">Admin</a>,
  };

  // Combine base items with admin item if user is admin
  const items = user && user.role === 'admin' 
    ? [...baseItems, adminItem]
    : baseItems;

  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemColor: "#606060",
              itemHoverColor: "#000",
              itemHoverBg: "#fff",
              itemSelectedBg: "#fff",
              itemSelectedColor: "#f93",
              subMenuItemBg: "#fff",
              subMenuItemSelectedColor: "#f93",
            },
          },
          token: {
            fontSize: 18,
          },
        }}
      >
        <Container className={"d-flex flex-column align-items-center gap-4 p-2"}>
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
            defaultOpenKeys={collapsed ? [] : ["8"]}
            className="font-sans fw-semibold"
            inlineCollapsed={collapsed}
            style={{ border: "none" }}
          />
        </Container>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default Index;
