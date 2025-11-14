import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

import { ThemeProvider } from "./context/ThemeContext.jsx";

const GOOGLE_CLIENT_ID = "32785311427-aau37pa9fo3o20mm66devnqiu6q84t8b.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);