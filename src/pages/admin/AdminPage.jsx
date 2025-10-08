import React, { useState } from "react";
import PaymentModule from "../../components/admin/PaymentModule";
import FeedbackModule from "../../components/admin/FeedbackModule";
import ReportModule from "../../components/admin/ReportModule";
import ContentModerationModule from "../../components/admin/ContentModerationModule";
import UserManagementModule from "../../components/admin/UserManagementModule";
import AIControlModule from "../../components/admin/AIControlModule";
import StatisticsModule from "../../components/admin/StatisticsModule";
import "../style/AdminPage.css";

export default function AdminPage() {
  const [activeModule, setActiveModule] = useState("payment");

  const modules = {
    payment: { component: PaymentModule, label: "Plans & Billing" },
    feedback: { component: FeedbackModule, label: "Feedback" },
    report: { component: ReportModule, label: "Report" },
    content: { component: ContentModerationModule, label: "Content" },
    users: { component: UserManagementModule, label: "Users" },
    ai: { component: AIControlModule, label: "AI Control" },
    stats: { component: StatisticsModule, label: "Statistics" }
  };

  const ActiveComponent = modules[activeModule].component;

  return (
    <div className="admin-container">
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
