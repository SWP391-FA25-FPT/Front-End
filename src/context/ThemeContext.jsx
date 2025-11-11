// src/context/ThemeContext.jsx (FIX HOÀN CHỈNH)

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { theme as antdTheme, ConfigProvider } from "antd";

// 1. TẠO CONTEXT
const ThemeContext = createContext();

// 2. HÀM HELPER (ĐỂ ĐỔI MÀU HEX SANG RGB)
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "0,0,0";
}

// 3. TẠO PROVIDER
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("themeMode") || "light"
  );
  const [accentColorName, setAccentColorName] = useState(
    () => localStorage.getItem("accentColorName") || "amber"
  );

  // 5. NÂNG CẤP "BỘ NÃO" THEME
  const colorMap = {
    amber: "#F59E0B",
    green: "#059669",
    blue: "#2563EB",
  };

  const lightModeBgColors = {
    amber: { hover: "#FFF8E1", selected: "#FEF3C7" },
    green: { hover: "#D1FAE5", selected: "#A7F3D0" },
    blue: { hover: "#DBEAFE", selected: "#BFDBFE" },
  };

  const accentColor = colorMap[accentColorName] || colorMap.amber;

  // TÍNH TOÁN LẠI CONFIG KHI THAY ĐỔI
  const antdThemeConfig = useMemo(() => {
    const isDark = themeMode === "dark";
    const lightHoverBg = lightModeBgColors[accentColorName].hover;
    const lightSelectedBg = lightModeBgColors[accentColorName].selected;
    const darkHoverBg = `rgba(${hexToRgb(accentColor)}, 0.15)`;
    const darkSelectedBg = `rgba(${hexToRgb(accentColor)}, 0.25)`;

    // Lấy thuật toán
    const algorithm = isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;
    
    // Lấy token
    const token = antdTheme.getDesignToken({ algorithm });
    
    // Destructure chỉ những biến cần dùng cho ANTD config
    const { 
        colorBgContainer, 
        colorBgElevated, 
        colorBgBody,
        // Cần colorBorderSecondary để fix List
        colorBorderSecondary 
    } = token; 

    // HÀM NÀY SẼ TRẢ VỀ CÁC TOKEN ĐỂ SỬ DỤNG TRONG useEffect
    const themeTokens = {
        ...token, // Pass ALL ANTD tokens here
        lightSelectedBg,
        darkSelectedBg,
        lightHoverBg,
        darkHoverBg,
        accentColor, 
    };

    return {
      algorithm,
      token: {
        colorPrimary: accentColor,
      },
      components: {
        // Config cho Menu (Sidebar)
        Menu: {
          itemSelectedColor: accentColor,
          itemHoverColor: accentColor,
          itemSelectedBg: isDark ? darkSelectedBg : lightSelectedBg,
          itemHoverBg: isDark ? darkHoverBg : lightHoverBg,
          colorItemBg: "transparent", 
          colorSubItemBg: "transparent",
        },
        // Config cho Layout (Header, Sider, Content)
        Layout: {
          headerBg: colorBgElevated, 
          siderBg: colorBgElevated,  
          bodyBg: colorBgBody,       
        },
        
        // FIX CUỐI: Cấu hình List để sử dụng màu viền phụ (colorBorderSecondary)
        List: {
             colorBorder: colorBorderSecondary, // <-- Dùng biến màu viền phụ đã destructure
             itemBg: 'transparent',
        },
        
        // Các config khác giữ nguyên...
        Dropdown: { colorBgElevated: colorBgElevated },
        Card: { colorBgContainer: colorBgElevated },
        Select: { colorBgElevated: colorBgElevated },
        Input: { colorBgContainer: isDark ? colorBgContainer : "#ffffff" },
        // Trả về themeTokens object cho external use (useEffect)
        themeTokens 
      },
    };
  }, [themeMode, accentColorName, accentColor]);

// (KHỐI CODE THIẾU TRƯỚC ĐÓ) KHỐI useEffect LỚN ĐỂ INJECT CSS VARIABLES VÀO :root
  useEffect(() => {
    const root = window.document.documentElement;
    // Lấy themeTokens từ antdThemeConfig.components (do nó là object trả về)
    const tokens = antdThemeConfig.components.themeTokens;

    // 1. Lưu vào localStorage và set data-* attributes
    root.setAttribute("data-theme", themeMode);
    root.setAttribute("data-accent", accentColorName);
    localStorage.setItem("themeMode", themeMode);
    localStorage.setItem("accentColorName", accentColorName);

    // 2. INJECT CSS VARIABLES VÀO :root
    if (tokens) {
        root.style.setProperty('--color-primary', tokens.accentColor);
        // Sử dụng logic ternary cho các màu accent hover/selected để đảm bảo đúng chế độ sáng/tối
        const isDark = themeMode === 'dark';
        
        root.style.setProperty('--color-primary-hover', isDark ? tokens.darkHoverBg : tokens.lightHoverBg);
        root.style.setProperty('--color-primary-selected', isDark ? tokens.darkSelectedBg : tokens.lightSelectedBg); 
        
        // Backgrounds và Text
        root.style.setProperty('--color-bg-body', tokens.colorBgBody);
        root.style.setProperty('--color-bg-container', tokens.colorBgContainer);
        // FIX LỖI: BIẾN NỀN ELEVATED
        root.style.setProperty('--color-bg-elevated', tokens.colorBgElevated);
        root.style.setProperty('--color-text-primary', tokens.colorText);
        root.style.setProperty('--color-text-secondary', tokens.colorTextSecondary);
        root.style.setProperty('--color-border', tokens.colorBorder);
        // Biến Border Secondary được inject
        root.style.setProperty('--color-border-secondary', tokens.colorBorderSecondary || tokens.colorBorder); 
    }
// Đã thêm antdThemeConfig vào dependencies
  }, [themeMode, accentColorName, antdThemeConfig]);


  // 6. GIÁ TRỊ CUNG CẤP
  const value = {
    themeMode,
    setThemeMode,
    accentColorName,
    setAccentColorName,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdThemeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// 7. TẠO HOOK
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};