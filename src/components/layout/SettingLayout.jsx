import React, { useState } from "react";
import { Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import User from "../User/User";
import CreateButton from "../CreateButton/CreateButton";

const SettingLayout = ({ children, hideUserActions = false }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Title } = Typography;
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleBack = () => {
    navigate(-1);
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
              margin: "0 8px 0 8px"
            }}
            className="d-flex align-items-center justify-content-between"
          >
            <div>
              <button
                onClick={handleBack}
                style={{
                  textDecoration: "none",
                  backgroundColor: "#f8f6f2",
                  border: "1px solid #A098AE",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e8e6e2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f6f2";
                }}
              >
                <Icon
                  icon="lsicon:left-filled"
                  color="black"
                  width="32"
                  height="32"
                />
              </button>
            </div>
            {!hideUserActions && (
              <div className="d-flex align-items-center gap-2">
                <User />
                <CreateButton />
              </div>
            )}
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

export default SettingLayout;
