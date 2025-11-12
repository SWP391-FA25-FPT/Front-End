import React from "react";
import { Flex, Button, Dropdown } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();             
    navigate("/login");    
  };

  const menuItems = [
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <Icon icon="mdi:logout" width="18" />,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      style={{
        width: "100%",
        height: "70px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <Flex gap="16px" align="center">
        <span style={{ fontWeight: 600, color: "#1a202c" }}>
          Xin chào, {user?.username || "Admin"} 👋
        </span>

        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button type="text" style={{ padding: 0 }}>
            <Icon icon="mdi:account-circle" width="34" height="34" />
          </Button>
        </Dropdown>
      </Flex>
    </header>
  );
};

export default AdminHeader;
