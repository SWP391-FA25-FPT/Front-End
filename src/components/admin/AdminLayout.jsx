import React, { useState } from "react";
import { Layout } from "antd";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { Outlet } from "react-router-dom";
import "../../pages/style/AdminLayout.css";

export default function AdminLayout() {
  const { Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="admin-layout">

      {/* SIDEBAR */}
      <Sider
        width={265}
        theme="light"
        collapsed={collapsed}
      >
        <AdminSidebar
          collapsed={collapsed}
          toggleCollapsed={() => setCollapsed(!collapsed)}
        />
      </Sider>

      {/* MAIN LAYOUT */}
      <Layout>

        {/* HEADER */}
        <AdminHeader
          collapsed={collapsed}
          toggleCollapsed={() => setCollapsed(!collapsed)}
        />

        {/* CONTENT */}
        <Content className="admin-content">
          <Outlet />
        </Content>

        {/* FOOTER */}
        <AdminFooter />

      </Layout>
    </Layout>
  );
}
