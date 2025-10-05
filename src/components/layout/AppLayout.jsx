import React, { useState } from "react";
import { Layout } from "antd";
import SideBar from "../SideBar";
import Head from "./Header";
import Foot from "./Footer";
import SearchBar from "../SearchBar/Index";
const AppLayout = () => {
  const { Header, Footer, Sider, Content } = Layout;
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
          <Header style={{backgroundColor:"white"}} className="flex justify-center items-center">
            <h1 className="text-2xl font-bold text-black mr-auto">Hello, Patricia</h1>
            <Head/>
          </Header>
          <Content style={{ margin:"24px 0 0 24px ", backgroundColor:"white" ,borderRadius:"16px 0 0 16px"}}>content</Content>
          <Footer  style={{ textAlign: 'center' }}>   Ant Design ©{new Date().getFullYear()} Created by Ant UED <Foot/> </Footer>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default AppLayout;
