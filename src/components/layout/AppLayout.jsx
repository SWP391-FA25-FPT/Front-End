import React, { useState, useEffect } from "react";
// 1. Thêm Switch, ConfigProvider, và theme từ Ant Design
import { Layout, Typography, Switch, ConfigProvider, theme as antdTheme } from "antd"; 
import { useAuth } from "../../context/useAuth";
import SideBar from "../SideBar";
import Head from "./Header";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
<<<<<<< Updated upstream
=======
import SearchBar from "../SearchBar/SearchBar";

// 1. Lấy thuật toán theme của AntD
const { darkAlgorithm, defaultAlgorithm } = antdTheme;
>>>>>>> Stashed changes

const AppLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Title } = Typography;
  const { user } = useAuth();
  
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  // --- 2. Logic chuyển đổi Theme ---
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Cập nhật localStorage và class 'dark' trên thẻ <html> (cho Tailwind/CSS)
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  // --- Hết Logic Theme ---

  const handleCollapse = (isCollapsed) => {
    setCollapsed(isCollapsed);
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  };

  const toggleCollapsed = () => {
    handleCollapse(!collapsed);
  };

  return (
<<<<<<< Updated upstream
    <React.Fragment>
      <Layout>
        {/* <SideBar /> */}
        <Sider
          theme="light"
          width={250}
          style={{ minHeight: "100vh" }}
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        </Sider>
        <Layout>
          <Header
            style={{ backgroundColor: "white" }}
            className="tw:flex tw:justify-between tw:items-center"
          >
            <div className="tw:flex tw:items-center tw:gap-2 tw:ml-4">
              <Icon 
                icon="mdi:hand-wave" 
                width="24" 
                height="24" 
                className="tw:animate-bounce"
                style={{ color: '#ff7a00' }}
              />
              <Title 
                level={3} 
                className="tw:m-0 tw:bg-gradient-to-r tw:from-orange-500 tw:to-orange-600 tw:bg-clip-text tw:text-transparent tw:animate-pulse"
              >
                Hello, {user?.username || 'User'}
              </Title>
            </div>
            <Head />
          </Header>
          <Content
            style={{
              margin: "24px 0 0 24px ",
              backgroundColor: "white",
              borderRadius: "16px 0 0 16px",
=======
    // 3. Bọc toàn bộ ứng dụng trong ConfigProvider
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <React.Fragment>
        {/* Cập nhật: Chỉnh lại khoảng cách viền xung quanh đều 8px */}
        <Layout style={{ padding: "8px", minHeight: "100vh" }}>
          <Sider
            theme="light" // Giữ "light" để màu teal tùy chỉnh của bạn hoạt động
            width={265}
            style={{
              // Cập nhật: Chỉnh lại chiều cao và vị trí top cho đều
              height: "calc(100vh - 16px)", 
              position: "sticky",
              top: "8px",
              borderRadius: "8px",
              // Cập nhật: Sidebar sẽ là màu xanh đậm (#00695c) sáng hơn
              backgroundColor: isDarkMode ? "#00695c" : "#e0f2f1", 
>>>>>>> Stashed changes
            }}
            collapsed={collapsed}
            onCollapse={handleCollapse}
          >
            <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
          </Sider>
          <Layout
            // Cập nhật: Chỉnh lại lề trái cho đều
            style={{ borderRadius: "8px", overflow: "hidden", marginLeft: "8px" }}
          >
            <Header
              style={{
                // Cập nhật: Header sẽ có màu giống Sidebar, sáng hơn
                backgroundColor: isDarkMode ? "#00695c" : "#e0f2f1", 
                borderRadius: "8px",
                // Cập nhật: Bỏ margin cũ để dùng padding của layout cha
                margin: "0",
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center gap-2 ms-4">
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
              <SearchBar />
              
              {/* 4. Thêm Switch vào nhóm điều khiển bên phải */}
              <div className="d-flex align-items-center gap-3">
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  checkedChildren={<Icon icon="mdi:weather-night" width="16" height="16" style={{color: 'white'}} />}
                  unCheckedChildren={<Icon icon="mdi:weather-sunny" width="16" height="16" style={{color: 'rgba(0,0,0,0.65)'}} />}
                />
                <Head />
              </div>

            </Header>
            <Content
              style={{
                // Cập nhật: Chỉ thêm margin top 8px để tách khỏi Header
                margin: "8px 0 0 0",
                // 5. Cập nhật nền Content động theo theme (trắng/đen chuẩn)
                backgroundColor: isDarkMode ? "#141414" : "white",
                borderRadius: "8px",
                padding: "16px",
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
    </ConfigProvider>
  );
};

export default AppLayout;

