import React, { useState } from "react";
import { Layout } from "antd";
// NOTE: 1. Import hook useTheme
import { useTheme } from "../../context/ThemeContext.jsx";
import SideBar from "../SideBar/SideBar";
import Head from "./Header";
import Foot from "./Footer";
import SearchBar from "../SearchBar/SearchBar";

const SearchingLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  // NOTE: 2. Lấy themeMode để áp dụng cho Sider
  const { themeMode } = useTheme(); 

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Shadow dùng cho Header và Content
  const componentShadow = {
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  return (
    <React.Fragment>
      {/* FIX LAYOUT: BỎ style hardcode, dùng AntD Layout mặc định */}
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          // FIX THEME: Đảm bảo Sider dùng themeMode
          theme={themeMode} 
          width={265}
          style={{
            height: "100vh", 
            position: "sticky",
            top: 0,
            overflow: "auto",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
        >
          <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        </Sider>

        <Layout
          style={{ 
            overflowY: "auto",
          }}
        >
          <Header
            style={{ 
              // FIX: Dùng margin/borderRadius/shadow như Header của AppLayout
              margin: "8px", 
              borderRadius: "8px",
              ...componentShadow, 
              zIndex: 10, 
            }}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center" style={{ flex: 1 }}>
              <SearchBar />
            </div>
            <Head />
          </Header>
          <Content
            style={{
              // FIX: Dùng margin/borderRadius/shadow như Content của AppLayout
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
            }}
          >
            <Foot />
          </Footer>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default SearchingLayout;