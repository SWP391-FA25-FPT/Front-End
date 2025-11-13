import React, { useState } from "react";
import { Layout, Button, Typography } from "antd"; 
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import User from "../User/User";
import CreateButton from "../CreateButton/CreateButton";
// NOTE: 1. Import hook useTheme
import { useTheme } from "../../context/ThemeContext.jsx";

const SettingLayout = ({ children, hideUserActions = false }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // NOTE: 2. Lấy themeMode
  const { themeMode } = useTheme();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      {/* NOTE: 3. ĐÃ XÓA backgroundColor */}
      <Layout style={{ padding: "5px" }}>
        <Sider
          // NOTE: 3. Sửa 'theme="light"' thành 'theme={themeMode}'
          theme={themeMode}
          width={265}
          style={{
            minHeight: "calc(100vh - 10px)",
            borderRadius: "8px",
            overflow: "hidden",
            // NOTE: 3. XÓA HẾT 'backgroundColor'
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
              // NOTE: 3. ĐÃ XÓA backgroundColor
              borderRadius: "8px",
              margin: "0 8px 0 8px",
            }}
            className="d-flex align-items-center justify-content-between"
          >
            <div>
              <Button
                onClick={handleBack}
                shape="circle"
                icon={<Icon icon="lsicon:left-filled" width="24" height="24" />}
                size="large"
              />
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
              // NOTE: 3. ĐÃ XÓA backgroundColor
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