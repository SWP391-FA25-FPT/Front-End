import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { App as AntdApp } from 'antd'; 

import "./index.css";
import App from "./App"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { GOOGLE_CLIENT_ID } from "./utils/constants";

import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AntdApp>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <App /> 
        </ThemeProvider>
      </GoogleOAuthProvider>
    </AntdApp>
  </StrictMode>
);
