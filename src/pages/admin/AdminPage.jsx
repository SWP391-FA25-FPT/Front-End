import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../../assets/icon.svg";
import AppLayout from "../../components/layout/AppLayout"; 

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>  {/* bọc bởi AppLayout */}

      {/* ✅ Wrapper layout admin */}
      <div className="admin-container">

        {/* Sidebar Admin */}
        <aside className="sidebar">
          <div className="sidebar-icons">
            <i className="bi bi-camera" onClick={() => navigate("/admin/content-moderation")}></i>
            <i className="bi bi-credit-card" onClick={() => navigate("/admin/payment")}></i>
            <i className="bi bi-bar-chart" onClick={() => navigate("/admin/statistics")}></i>
            <i className="bi bi-flag" onClick={() => navigate("/admin/report")}></i>
            <i className="bi bi-chat-left" onClick={() => navigate("/admin/feedback")}></i>
            <i className="bi bi-people" onClick={() => navigate("/admin/users")}></i>
          </div>
        </aside>

        {/* Nội dung trang admin */}
        <main className="main-content">
          <Outlet /> {/* module admin render tại đây */}
        </main>

      </div>   {/* ✅ bắt buộc phải có wrapper */}
    </AppLayout>
  );
}
