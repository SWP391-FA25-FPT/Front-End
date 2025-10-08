import React, { useState } from "react";
import { Layout, Typography } from "antd";
import SideBar from "../SideBar";
import Head from "./Header";
import Foot from "./Footer";

const AppLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Title } = Typography;
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
            className="tw:flex tw:justify-center tw:items-center"
          >
            <Title level={3} className=" tw:mr-auto">
              Hello, Patricia
            </Title>
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
