import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

// 1. SỬA: Import App từ 'antd' và đổi tên thành 'AntdApp'
import { App as AntdApp } from 'antd'; 

import "./index.css";
import App from "./App"; // Đây là component App chính của bạn
import "bootstrap/dist/css/bootstrap.min.css";

import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 2. SỬA: Bọc toàn bộ ứng dụng bằng <AntdApp> */}
    <AntdApp>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <App /> {/* Component App chính của bạn nằm ở trong cùng */}
        </ThemeProvider>
      </GoogleOAuthProvider>
    </AntdApp>
  </StrictMode>
);