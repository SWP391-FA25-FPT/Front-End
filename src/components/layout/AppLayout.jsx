import React, { useState } from "react";
import { Layout, Typography } from "antd";
import { useAuth } from "../../context/useAuth";
import SideBar from "../SideBar/SideBar";
import Head from "./Header";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import SearchBar from "../SearchBar/SearchBar";
const AppLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Title } = Typography;
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <React.Fragment>
      <Layout style={{ backgroundColor: "#f8f6f2", padding: "5px" }}>
        {/* <SideBar /> */}
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
              margin: "0 8px 0 8px"
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

export default AppLayout;
