import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Layout,
  Typography,
  Badge,
  Button,
  Dropdown,
  Avatar,
  Space,
} from "antd";
import { useAuth } from "../../context/useAuth";
import SideBar from "../SideBar/SideBar";
import Head from "./Header";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import SearchBar from "../SearchBar/SearchBar";
import { useTheme } from "../../context/ThemeContext.jsx";

const { Title, Text, Link: AntLink } = Typography;

const notifications = [
  {
    id: 1,
    icon: "mdi:file-document-outline",
    title: "Cập nhật tài liệu",
    description: 'Tài liệu "Món Nháp" đã được cập nhật.',
    color: "#1D4ED8",
    bgColor: "#DBEAFE",
  },
  {
    id: 2,
    icon: "mdi:trophy-outline",
    title: "Thử thách mới!",
    description: 'Bạn đã tham gia "Thử thách 7 ngày Keto".',
    color: "#059669",
    bgColor: "#D1FAE5",
  },
  {
    id: 3,
    icon: "mdi:comment-outline",
    title: "Bình luận mới",
    description: 'Khoale đã bình luận về món "Cá Hồi Nướng".',
    color: "#D97706",
    bgColor: "#FEF3C7",
  },
];

const AppLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { themeMode } = useTheme();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Màu nền phân cách (container) và khối nổi (elevated)
  const containerBg = themeMode === "dark" ? "#2a2a2a" : "#f5f5f5"; // đậm hơn để phân biệt
  const elevatedBg = themeMode === "dark" ? "#1f1f1f" : "#ffffff";

  const componentShadow = {
    boxShadow:
      themeMode === "dark"
        ? "0 2px 5px rgba(0,0,0,0.4)"
        : "0 1px 3px rgba(0,0,0,0.05)",
  };

  const notificationItems = [
    {
      key: "header",
      label: (
        <Title level={5} style={{ margin: 0, padding: "8px 12px" }}>
          Thông báo
        </Title>
      ),
      type: "group",
    },
    { type: "divider" },
    ...notifications.map((item) => ({
      key: item.id,
      label: (
        <Space style={{ width: "100%" }}>
          <Avatar
            icon={<Icon icon={item.icon} />}
            style={{ backgroundColor: item.bgColor, color: item.color }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text strong>{item.title}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {item.description}
            </Text>
          </div>
        </Space>
      ),
      style: { padding: "12px 16px" },
    })),
    { type: "divider" },
    {
      key: "footer",
      label: (
        <AntLink style={{ display: "block", textAlign: "center" }}>
          <RouterLink to="/notifications" style={{ color: "inherit" }}>
            Xem tất cả thông báo
          </RouterLink>
        </AntLink>
      ),
      style: { padding: "10px 16px" },
    },
  ];

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
                menu={{ items: notificationItems }}
                trigger={["click"]}
                placement="bottomRight"
                dropdownRender={(menu) => (
                  <div style={{ width: 360, ...componentShadow }}>{menu}</div>
                )}
              >
                <Badge count={5} size="small">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<Icon icon="mdi:bell-outline" width="24" height="24" />}
                  />
                </Badge>
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
