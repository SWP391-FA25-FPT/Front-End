import React from "react";
import Logo from "../Logo";
import { Container } from "react-bootstrap";
import { Button, ConfigProvider, Flex, Menu } from "antd";
import { Icon } from "@iconify/react";

const items = [
  {
    key: "1",
    icon: <Icon icon="ion:restaurant-outline" width="24" height="24" />,
    label: <a href="#">Trang Chủ</a>,
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
    label: <p href="#">Premium</p>,
    children: [
      {
        key: "2-1",
        icon: <Icon icon="mdi:robot-outline" width="24" height="24" />,
        label: <a href="#">AI Tư Vấn M&M</a>,
      },
      {
        key: "2-2",
        icon: <Icon icon="mdi:camera-outline" width="24" height="24" />,
        label: <a href="#">Phân tích Dinh Dưỡng Bằng Ảnh</a>,
      },

      {
        key: "2-3",
        icon: <Icon icon="mdi:food-outline" width="24" height="24" />,
        label: <a href="#">Tạo Thực Đơn Premium</a>,
      },
      {
        key: "2-4",
        icon: <Icon icon="mdi:chart-line" width="24" height="24" />,
        label: <a href="#">Theo Dõi Tiến Độ</a>,
      },
      {
        key: "2-5",
        icon: <Icon icon="mdi:crown-outline" width="24" height="24" />,
        label: <a href="#"> Top Thực Đơn Xem Nhiều Nhất</a>,
      },
    ],
  },
  {
    key: "3",
    icon: <Icon icon="mdi:trophy-outline" width="24" height="24" />,
    label: <a href="#">Thử Thách</a>,
  },
  {
    key: "4",
    icon: <Icon icon="mdi:bell-outline" width="24" height="24" />,
    label: <a href="#">Thông Báo</a>,
  },
  {
    key: "5",
    icon: <Icon icon="ic:outline-settings" width="24" height="24" />,
    label: <a href="#">Thiết Lập</a>,
  },
  {
    key: "6",
    icon: <Icon icon="mdi:folder-outline" width="24" height="24" />,
    label: <p href="#">Kho Món Ngon Của Bạn</p>,
    children: [
      {
        key: "6-1",
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
        key: "6-2",
        icon: <Icon icon="mdi:bookmark-outline" width="24" height="24" />,
        label: <a href="#">Đã Lưu</a>,
      },
      {
        key: "6-3",
        icon: <Icon icon="mdi:account-outline" width="24" height="24" />,
        label: <a href="#">Món Của Tôi</a>,
      },
      {
        key: "6-4",
        icon: <Icon icon="et:global" width="24" height="24" />,
        label: <a href="#">Đã Chia Sẻ</a>,
      },
      {
        key: "6-5",
        icon: <Icon icon="mdi:file-document-outline" width="24" height="24" />,
        label: <a href="#">Món Nháp</a>,
      },
    ],
  },
];

const Index = ({ collapsed, toggleCollapsed }) => {

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
        <Container className={`${collapsed ? 'p-1' : 'p-5'} flex flex-col items-center ${collapsed ? 'gap-2' : 'gap-5'}`}>
          <Flex space="between" gap={20} align="center" justify="center">
            <Logo collapsed={collapsed} />
            {!collapsed && (
              <Button onClick={toggleCollapsed} type="button">
                <Icon icon="mingcute:arrows-left-line" width="24" height="24" />
              </Button>
            )}
          </Flex>
          {collapsed && (
            <Button onClick={toggleCollapsed} type="button" className="mb-1" size="small">
              <Icon icon="mingcute:arrows-right-line" width="24" height="24" />
            </Button>
          )}
          <Menu
            defaultSelectedKeys={"1"}
            mode="inline"
            items={items}
            defaultOpenKeys={collapsed ? [] : ["6"]}
            className="font-sans font-semibold"
            inlineCollapsed={collapsed}
            style={{border:"none"}}
          />
        </Container>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default Index;
