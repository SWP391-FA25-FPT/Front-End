import React, { useState } from "react";
import { Layout, Typography } from "antd";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../SideBar";
import Head from "./Header";
import Foot from "./Footer";
import { Icon } from "@iconify/react";

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
