import React from "react";
import { Flex } from "antd";
import Logo from "../../assets/icon.svg";
import { useTheme } from "../../context/ThemeContext.jsx";

const LogoIndex = ({ collapsed }) => { 
  const { themeMode } = useTheme();

  // FIX: Sử dụng biến CSS để đồng bộ màu chữ chính xác với theme.
  const logoColorStyle = { 
      color: 'var(--color-text-primary)', 
      whiteSpace: "nowrap" 
   };

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
            style={logoColorStyle}
          >
            M&M
          </p>
        )}
      </Flex>
    </React.Fragment>
  );
};

export default LogoIndex;