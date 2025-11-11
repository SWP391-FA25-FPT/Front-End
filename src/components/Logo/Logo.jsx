import React from "react";
import { Flex } from "antd";
import Logo from "../../assets/icon.svg";
// NOTE: 1. Import "bộ não" useTheme
import { useTheme } from "../../context/ThemeContext.jsx";

const Index = ({ collapsed }) => {
  // NOTE: 2. Lấy themeMode (light hoặc dark)
  const { themeMode } = useTheme();

  // NOTE: 3. Quyết định màu chữ
  // Nếu là Tối -> chữ Trắng, nếu là Sáng -> chữ Đen
  const logoTextColor = themeMode === "dark" ? "#FFFFFF" : "#111827";

  return (
    <React.Fragment>
      <Flex
        gap={10}
        align="center"
        justify="center"
        className="d-flex align-items-center justify-content-center logo-container"
      >
        <img src={Logo} className={collapsed ? "w-8 h-8" : "w-10 h-10"} />
        {!collapsed && (
          <p
            className="fs-1 fw-bold m-0"
            style={{ color: logoTextColor, whiteSpace: "nowrap" }}
          >
            M&M
          </p>
        )}
      </Flex>
    </React.Fragment>
  );
};

export default Index;