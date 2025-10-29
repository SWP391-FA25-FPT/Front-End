import React, { useState } from "react";
import { Layout } from "antd";
import SideBar from "../SideBar";
import Head from "./Header";
import Foot from "./Footer";
import SearchBar from "../SearchBar/Index";

const SearchingLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <React.Fragment>
      <Layout style={{ backgroundColor: "#f8f6f2", padding: "5px" }}>
        <Sider
          theme="light"
          width={265}
          style={{
            minHeight: "calc(100vh - 10px)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        </Sider>
        <Layout
          style={{ borderRadius: "8px", overflow: "hidden", marginLeft: "5px" }}
        >
          <Header
            style={{ 
              backgroundColor: "white",
              borderRadius: "8px",
              margin: "0 8px 0 8px",
              padding: "0 24px"
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
              margin: "8px",
              backgroundColor: "white",
              borderRadius: "8px",
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
  );
};

export default SearchingLayout;

