import "./styles/tailwind.css"; // chỉ có @import "tailwindcss"
import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // <-- quan trọng: import từ App.jsx

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
