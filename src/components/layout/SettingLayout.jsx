import React, { useState } from "react";
import { Layout, Typography, Button } from "antd";
// import { useAuth } from "../../context/AuthContext";
import SideBar from "../SideBar";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import User from "../../components/User";
import CreateButton from "../../components/CreateButton";

const SettingLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Title } = Typography;
  //   const { user } = useAuth();
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
            style={{
              backgroundColor: "white",
            }}
            className="tw:items-center tw:flex tw:justify-between"
          >
            <div>
              <a
                href="/dashboard"
                style={{
                  
                  textDecoration: "none",
                  backgroundColor: "rgb(248 246 242/var(--tw-bg-opacity,1))",
                  borderColor: "#A098AE",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  icon="lsicon:left-filled"
                  color="black"
                  width="32"
                  height="32"
                />
              </a>
            </div>
            <div className="tw:flex tw:items-center tw:gap-2">
              <User />
              <CreateButton />
            </div>
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

export default SettingLayout;
