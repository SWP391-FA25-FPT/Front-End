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
  
  // 5. BỘ NÃO THEME
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

  // TÍNH TOÁN CONFIG CỦA ANT DESIGN
  const antdThemeConfig = useMemo(() => {
    const isDark = themeMode === "dark";
    const lightHoverBg = lightModeBgColors[accentColorName].hover;
    const lightSelectedBg = lightModeBgColors[accentColorName].selected;
    
    const algorithm = isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;
    
    const config = {
      algorithm,
      token: {
        colorPrimary: accentColor,
      }
    };
    
    const token = antdTheme.getDesignToken(config);
    
    const { 
      colorBgContainer, 
      colorBgElevated, 
      colorText,
      colorPrimary
    } = token;

    return {
      algorithm,
      token: {
        colorPrimary: accentColor,
        colorText: colorText, 
      },
      components: {
        // Config cho Menu (Sửa Deprecation)
        Menu: {
          itemSelectedColor: accentColor,
          itemHoverColor: accentColor,
          itemSelectedBg: isDark
            ? `rgba(${hexToRgb(accentColor)}, 0.25)`
            : lightSelectedBg,
          itemHoverBg: isDark
            ? `rgba(${hexToRgb(accentColor)}, 0.15)`
            : lightHoverBg,
          // FIX DEPRECATION: Dùng itemBg và subMenuBg thay cho colorItemBg/colorSubItemBg
          itemBg: "transparent", 
          subMenuBg: "transparent",
        },
        // Config cho Layout
        Layout: {
          headerBg: colorBgElevated, 
          siderBg: colorBgElevated, 
          bodyBg: colorBgContainer, 
        },
        // Config cho Dropdown, Card, Select, Input
        Dropdown: { colorBgElevated: colorBgElevated },
        Card: { colorBgContainer: colorBgElevated },
        Select: { 
          colorBgElevated: colorBgElevated, 
          controlItemBgActive: colorBgContainer,
          controlItemBgHover: colorBgContainer,
          controlItemBg: colorBgContainer, 
        },
        Input: { 
          colorBgContainer: isDark ? colorBgElevated : "#ffffff", 
        }
      },
    };
  }, [themeMode, accentColorName, accentColor]);
  
  // 4. LOGIC LƯU TRỮ VÀ THIẾT LẬP BIẾN CSS (CSS Variables)
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", themeMode);
    root.setAttribute("data-accent", accentColorName);
    localStorage.setItem("themeMode", themeMode);
    localStorage.setItem("accentColorName", accentColorName);
    
    // Lấy Design Token lần nữa để có các giá trị màu chính xác
    const token = antdTheme.getDesignToken(antdThemeConfig);
    const { 
      colorBgContainer, 
      colorBgElevated, 
      colorTextBase, 
      colorTextSecondary, 
      colorWarning, 
      colorBgBase,
      colorPrimary,
      colorPrimaryDark 
    } = token;

    // Tính toán các giá trị màu cho CSS
    const primaryRgb = hexToRgb(colorPrimary);
    const warningRgb = hexToRgb(colorWarning);
    
    // Thiết lập CSS Variables trên thẻ <html>
    root.style.setProperty("--color-bg-elevated", colorBgElevated);
    root.style.setProperty("--color-bg-container", colorBgContainer);
    root.style.setProperty("--color-bg-base", colorBgBase);
    root.style.setProperty("--color-bg-body", colorBgBase); // Dùng Base cho body
    
    root.style.setProperty("--color-text-primary", colorTextBase);
    root.style.setProperty("--color-text-secondary", colorTextSecondary);
    root.style.setProperty("--color-warning", colorWarning);

    // Accent Colors
    root.style.setProperty("--color-primary", colorPrimary);
    root.style.setProperty("--color-primary-dark", colorPrimaryDark || colorPrimary); // Fallback
    root.style.setProperty("--color-primary-faded", `rgba(${primaryRgb}, 0.2)`); // Màu accent mờ
    root.style.setProperty("--color-primary-shadow", `rgba(${primaryRgb}, 0.3)`); // Màu shadow accent
    
    // Dark Mode Shadow
    const shadowColor = themeMode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)';
    root.style.setProperty("--color-shadow", shadowColor);


    // ÁP DỤNG MÀU NỀN CỦA BODY LÊN THẺ BODY/HTML TRONG DARK MODE
    if (themeMode === 'dark') {
      window.document.body.style.backgroundColor = colorBgBase;
    } else {
      // Xóa style để CSS gốc trong file Support/AI Consultation có thể áp dụng gradient
      window.document.body.style.backgroundColor = '';
    }
    
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

// 7. TẠO HOOK VÀ EXPORT
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};