import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentModule from "../../components/admin/PaymentModule";
import FeedbackModule from "../../components/admin/FeedbackModule";
import ReportModule from "../../components/admin/ReportModule";
import RecipeModerationModule from "../../components/admin/RecipeModerationModule";
import UserManagementModule from "../../components/admin/UserManagementModule";
import AIControlModule from "../../components/admin/AIControlModule";
import StatisticsModule from "../../components/admin/StatisticsModule";
import BlogManagementModule from "../../components/admin/BlogManagementModule";
import Logo from "../../assets/icon.svg";
import "../style/AdminPage.css";

export default function AdminPage() {
  const [activeModule, setActiveModule] = useState("blogs");
  const navigate = useNavigate();

  const modules = {
    blogs: { component: BlogManagementModule, label: "Blogs" },
    payment: { component: PaymentModule, label: "Plans & Billing" },
    feedback: { component: FeedbackModule, label: "Feedback" },
    report: { component: ReportModule, label: "Report" },
    content: { component: RecipeModerationModule, label: "Content" },
    users: { component: UserManagementModule, label: "Users" },
    ai: { component: AIControlModule, label: "AI Control" },
    stats: { component: StatisticsModule, label: "Statistics" }
  };

  const ActiveComponent = modules[activeModule].component;

  return (
    <div className="admin-container">
      {/* Logo */}
      <div className="admin-logo">
        <img 
          src={Logo} 
          alt="M&M Logo" 
          className="logo-image"
          onClick={() => navigate('/')}
        />
        <span className="logo-text" onClick={() => navigate('/')}>M&M</span>
      </div>

      <aside className="sidebar">
        <div className="sidebar-icons">
          <i className="bi bi-house"></i>
          <i className="bi bi-bar-chart"></i>
          <i className="bi bi-layers"></i>
          <i className="bi bi-people"></i>
          <i className="bi bi-gear"></i>
        </div>
      </aside>

      <main className="main-content">
        <h2 className="page-title">Admin Settings</h2>

        <nav className="top-menu">
          {Object.entries(modules).map(([key, module]) => (
            <button
              key={key}
              className={`nav-button ${activeModule === key ? "active" : ""}`}
              onClick={() => setActiveModule(key)}
            >
              {module.label}
            </button>
          ))}
        </nav>

        <div className="module-view">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
