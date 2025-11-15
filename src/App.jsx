import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { App as AntdApp } from "antd";
import { AuthProvider } from "./context/AuthContext";
import appRoutes from "./routes/routes";

// Helper function để render routes từ mảng appRoutes
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    if (route.children && route.children.length > 0) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    // Xử lý route index (path rỗng)
    if (route.path === "") {
      return (
        <Route key={index} index element={route.element} />
      );
    }
    return (
      <Route key={index} path={route.path} element={route.element} />
    );
  });
};

function App() {
  return (
    <AntdApp>
      <AuthProvider>
        <Router>
          <Routes>
            {renderRoutes(appRoutes)}
          </Routes>
        </Router>
      </AuthProvider>
    </AntdApp>
  );
}

export default App;