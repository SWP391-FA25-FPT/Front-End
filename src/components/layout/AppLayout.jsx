import React, { useState } from "react";
// NOTE: Thêm Link từ react-router-dom
import { Link } from "react-router-dom"; 
import { Layout, Typography, Badge, Button, Dropdown, List, Avatar } from "antd";
import { useAuth } from "../../context/useAuth";
import SideBar from "../SideBar/SideBar";
import Head from "./Header";
import Foot from "./Footer";
import { Icon } from "@iconify/react";
import SearchBar from "../SearchBar/SearchBar";

const notifications = [
  { 
    id: 1, 
    icon: 'mdi:file-document-outline', 
    title: 'Cập nhật tài liệu', 
    description: 'Tài liệu "Món Nháp" đã được cập nhật.',
    color: '#1D4ED8',
    bgColor: '#DBEAFE',
  },
  { 
    id: 2, 
    icon: 'mdi:trophy-outline', 
    title: 'Thử thách mới!', 
    description: 'Bạn đã tham gia "Thử thách 7 ngày Keto".',
    color: '#059669',
    bgColor: '#D1FAE5',
  },
  { 
    id: 3, 
    icon: 'mdi:comment-outline', 
    title: 'Bình luận mới', 
    description: 'Khoale đã bình luận về món "Cá Hồi Nướng".',
    color: '#D97706',
    bgColor: '#FEF3C7',
  },
];


const AppLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Title } = Typography;
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const componentShadow = {
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  // Nội dung của Dropdown thông báo
  const notificationOverlay = (
    <div style={{ 
      width: 360, 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid #f0f0f0'
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={5} style={{ margin: 0 }}>Thông báo</Title>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <div style={{ borderBottom: '1px solid #f0f0f0' }}>
            <List.Item style={{ padding: '12px 16px', cursor: 'pointer' }}>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<Icon icon={item.icon} />} 
                    style={{ backgroundColor: item.bgColor, color: item.color }} 
                  />
                }
                title={<a href="#">{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          </div>
        )}
        style={{ maxHeight: 300, overflowY: 'auto' }}
      />
      <div style={{ 
        padding: '10px 16px', 
        borderTop: '1px solid #f0f0f0', 
        textAlign: 'center' 
      }}>
        
        <Link to="/notifications" style={{ fontWeight: 500 }}>
          Xem tất cả thông báo
        </Link>
        
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {/* Giữ nguyên layout của bạn */}
      <Layout style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
        
        <Sider
          theme="dark"
          width={265}
          style={{
            height: "100vh",
            position: "sticky", 
            top: 0,
            backgroundColor: "#ffffffff", 
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
          collapsed={collapsed}
          breakpoint="lg" 
          onCollapse={setCollapsed} 
        >
          <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        </Sider>
        
        <Layout
          style={{
            overflowY: "auto",
            backgroundColor: "#F9FAFB",
          }}
        >
          <Header
            style={{
              backgroundColor: "white",
              margin: "8px",
              borderRadius: "8px",
              ...componentShadow,
            }}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="d-none d-lg-flex align-items-center gap-2 ms-4">
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
            
            <div className="d-flex align-items-center gap-3">
              <SearchBar />
              
              <Dropdown
  trigger={["click"]}
  placement="bottomRight"
  menu={{
    items: notifications.map((item) => ({
      key: item.id,
      label: (
        <div onClick={(e) => e.domEvent.stopPropagation()}>
          <strong>{item.title}</strong>
          <p>{item.description}</p>
        </div>
      ),
    })),
  }}
>
  <Badge count={5} size="small">
    <Button
      type="text"
      shape="circle"
      icon={<Icon icon="mdi:bell-outline" width="24" height="24" />}
      style={{ color: "#4A5568" }}
    />
  </Badge>
</Dropdown>


              <Head />
            </div>
          </Header>

          <Content
            style={{
              margin: "8px",
              marginTop: 0,
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "16px",
              ...componentShadow,
            }}
          >
            {children}
          </Content>

          <Footer style={{ textAlign: "start", backgroundColor: "#F9FAFB", padding: 0 }}>
            <Foot />
          </Footer>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default AppLayout;