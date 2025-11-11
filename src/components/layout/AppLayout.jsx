// src/components/layout/AppLayout.jsx

import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Layout,
  Typography, // Typography được import ở đây
  Badge,
  Button,
  Dropdown,
  List,
  Avatar,
  Space,
} from "antd";
import { useAuth } from "../../context/useAuth";
import SideBar from "../SideBar/SideBar";
import Head from "./Header";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import SearchBar from "../SearchBar/SearchBar";
// NOTE: 1. Import hook useTheme
import { useTheme } from "../../context/ThemeContext.jsx";

// FIX: Destructure Typography ở đây, sau khi nó đã được import từ "antd"
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
  // NOTE: 2. Lấy themeMode
  const { themeMode } = useTheme();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const componentShadow = {
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  // NOTE: Sửa Dropdown (theo antd v5+)
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
      {/* NOTE: 3. ĐÃ XÓA backgroundColor */}
      <Layout 
        style={{ 
            minHeight: "100vh",
            // FIX NỀN TỔNG THỂ: Áp dụng biến body
            backgroundColor: 'var(--color-bg-body)' 
        }}
       >
        <Sider
          // NOTE: 3. Sửa 'theme="dark"' thành 'theme={themeMode}'
          theme={themeMode}
          width={265}
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
          collapsed={collapsed}
          breakpoint="lg"
          onCollapse={setCollapsed}
        >
          <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        </Sider>

        <Layout
          style={{
            overflowY: "auto",
            // FIX: Đảm bảo Layout lồng bên trong cũng dùng màu nền body (Không được trong suốt)
            backgroundColor: 'var(--color-bg-body)' 
          }}
        >
          <Header
            style={{
              // NOTE: 3. ĐÃ XÓA backgroundColor
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
                styles={{
                  menu: {
                    width: 360,
                    ...componentShadow,
                  },
                }}
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
              margin: "8px",
              marginTop: 0,
              // NOTE: 3. ĐÃ XÓA backgroundColor
              borderRadius: "8px",
              padding: "16px",
              ...componentShadow,
              // FIX MÀU CONTENT: Buộc Content dùng màu nền khối nổi
              backgroundColor: 'var(--color-bg-elevated)', // <--- DÒNG NÀY ĐÃ FIX NỀN TRUNG TÂM
            }}
          >
            {children}
          </Content>

          <Footer
            style={{
              textAlign: "start",
              padding: 0,
              // NOTE: 3. ĐÃ XÓA backgroundColor
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