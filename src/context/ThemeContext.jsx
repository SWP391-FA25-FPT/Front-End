// src/context/ThemeContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
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

  // 4. LOGIC LƯU TRỮ
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", themeMode);
    root.setAttribute("data-accent", accentColorName);
    localStorage.setItem("themeMode", themeMode);
    localStorage.setItem("accentColorName", accentColorName);
  }, [themeMode, accentColorName]);

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

    // Lấy thuật toán
    const algorithm = isDark
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm;

    // NOTE: ĐÂY LÀ DÒNG ĐÃ SỬA LỖI (Bỏ dấu {} đi)
    const token = antdTheme.getDesignToken({ algorithm });

    const { colorBgContainer, colorBgElevated } = token;

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
          itemSelectedBg: isDark
            ? `rgba(${hexToRgb(accentColor)}, 0.25)`
            : lightSelectedBg,
          itemHoverBg: isDark
            ? `rgba(${hexToRgb(accentColor)}, 0.15)`
            : lightHoverBg,
          // Bắt Menu có nền trong suốt để "ăn" màu Sider
          colorItemBg: "transparent",
          colorSubItemBg: "transparent",
        },
        // Config cho Layout (Header, Sider, Content)
        Layout: {
          headerBg: colorBgElevated, // Màu "nổi" (Header)
          siderBg: colorBgElevated, // Màu "nổi" (Sider)
          bodyBg: colorBgContainer, // Màu nền chính
        },
        // Config cho Dropdown (Thông báo)
        Dropdown: {
          colorBgElevated: colorBgElevated,
        },
        // Config cho Card (Trang Settings, Trang Challenge)
        Card: {
          colorBgContainer: colorBgElevated,
        },
        // Config cho Select (Trang Settings)
        Select: {
          colorBgElevated: colorBgElevated,
        },
        // Config cho Input (Thanh Search)
        Input: {
          colorBgContainer: isDark ? colorBgContainer : "#ffffff",
        },
      },
    };
  }, [themeMode, accentColorName, accentColor]);

  // 6. GIÁ TRỊ CUNG CẤP
  const value = {
    themeMode,
    setThemeMode,
    accentColorName,
    setAccentColorName,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdThemeConfig}>{children}</ConfigProvider>
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
