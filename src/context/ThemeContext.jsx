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
      
      // ⚡️ SỬA LỖI MÀU NỀN DARK MODE: TÍNH TOÁN LẠI CÁC GIÁ TRỊ NỀN TRONG DARK MODE
      // Khi ở Dark Mode, Ant Design Token sẽ cho ra các giá trị Dark, 
      // nhưng chúng ta cần đảm bảo các giá trị được sử dụng là đúng.
      const colorBgContainer = token.colorBgContainer;
      const colorBgElevated = token.colorBgElevated;
      const colorText = token.colorText;
      const colorPrimary = token.colorPrimary;
    
    // Nếu bạn đang cố gắng ghi đè token, hãy chắc chắn giá trị là màu tối
    const darkBgContainer = '#141414'; // Màu nền Container tối
    const darkBgElevated = '#1f1f1f'; // Màu nền khối nổi tối

      return {
         algorithm,
         token: {
            colorPrimary: accentColor,
            colorText: colorText, 
         },
         components: {
            // Config cho Menu
            Menu: {
               itemSelectedColor: accentColor,
               itemHoverColor: accentColor,
               itemSelectedBg: isDark
                  ? `rgba(${hexToRgb(accentColor)}, 0.25)`
                  : lightSelectedBg,
               itemHoverBg: isDark
                  ? `rgba(${hexToRgb(accentColor)}, 0.15)`
                  : lightHoverBg,
               itemBg: "transparent", 
               subMenuBg: "transparent",
            },
            // Config cho Layout
            Layout: {
               headerBg: colorBgElevated, 
               // siderBg: colorBgElevated, // ❌ ĐÃ XÓA
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

      // ⚡️ FIX LỖI MÀU NỀN DARK MODE: CÁC BIẾN NÀY PHẢI LÀ MÀU TỐI KHI Ở DARK MODE
    // Nếu Ant Design không tự trả về màu Dark Mode chính xác, ta sẽ ép giá trị tối vào
    const isDark = themeMode === 'dark';
    
    // Ant Design Dark Mode Colors (Nếu Ant Design không trả về giá trị Dark)
    const darkBgBase = '#000000';
    const darkBgElevatedOverride = '#1f1f1f'; 
    const darkBgContainerOverride = '#141414'; 
    const darkTextOverride = '#ffffff';

      // Tính toán các giá trị màu cho CSS
      const primaryRgb = hexToRgb(colorPrimary);
      const warningRgb = hexToRgb(colorWarning);
      
      // Thiết lập CSS Variables trên thẻ <html>
      root.style.setProperty("--color-bg-elevated", isDark ? darkBgElevatedOverride : colorBgElevated);
      root.style.setProperty("--color-bg-container", isDark ? darkBgContainerOverride : colorBgContainer);
      root.style.setProperty("--color-bg-base", isDark ? darkBgBase : colorBgBase);
      root.style.setProperty("--color-bg-body", isDark ? darkBgBase : colorBgBase); 
      
      root.style.setProperty("--color-text-primary", isDark ? darkTextOverride : colorTextBase);
      root.style.setProperty("--color-text-secondary", colorTextSecondary);
      root.style.setProperty("--color-warning", colorWarning);

      // Accent Colors
      root.style.setProperty("--color-primary", colorPrimary);
      root.style.setProperty("--color-primary-dark", colorPrimaryDark || colorPrimary); 
      root.style.setProperty("--color-primary-faded", `rgba(${primaryRgb}, 0.2)`); 
      root.style.setProperty("--color-primary-shadow", `rgba(${primaryRgb}, 0.3)`); 
      
      // Dark Mode Shadow
      const shadowColor = themeMode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)';
      root.style.setProperty("--color-shadow", shadowColor);
    
    // LOGIC CHO PREMIUM CTA BOX
    const premiumBg = themeMode === 'dark' 
      ? `linear-gradient(135deg, ${colorPrimary}, ${colorPrimaryDark || colorPrimary})` 
      : "linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)"; 

    const premiumShadow = themeMode === 'dark'
      ? `0 10px 20px -5px rgba(${primaryRgb}, 0.4)`
      : "0 10px 20px -5px rgba(251, 191, 36, 0.4)"; 

    root.style.setProperty("--premium-cta-bg", premiumBg);
    root.style.setProperty("--premium-cta-shadow", premiumShadow);


      // ÁP DỤNG MÀU NỀN CỦA BODY LÊN THẺ BODY/HTML TRONG DARK MODE
      if (themeMode === 'dark') {
         window.document.body.style.backgroundColor = darkBgBase; // Dùng màu Base Dark để đồng nhất
      } else {
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