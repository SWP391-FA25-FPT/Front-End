import React from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import PaymentModule from "../../components/admin/PaymentModule";
import FeedbackModule from "../../components/admin/FeedbackModule";
import ReportModule from "../../components/admin/ReportModule";
import ContentModerationModule from "../../components/admin/ContentModerationModule";
import UserManagementModule from "../../components/admin/UserManagementModule";
import AIControlModule from "../../components/admin/AIControlModule";
import StatisticsModule from "../../components/admin/StatisticsModule";
import "../style/AdminPage.css";

export default function AdminPage() {
  return (
    <Router>
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
            <NavLink to="payment" className={({ isActive }) => (isActive ? "active" : "")}>Plans & Billing</NavLink>
            <NavLink to="feedback" className={({ isActive }) => (isActive ? "active" : "")}>Feedback</NavLink>
            <NavLink to="report" className={({ isActive }) => (isActive ? "active" : "")}>Report</NavLink>
            <NavLink to="content" className={({ isActive }) => (isActive ? "active" : "")}>Content</NavLink>
            <NavLink to="users" className={({ isActive }) => (isActive ? "active" : "")}>Users</NavLink>
            <NavLink to="ai" className={({ isActive }) => (isActive ? "active" : "")}>AI Control</NavLink>
            <NavLink to="stats" className={({ isActive }) => (isActive ? "active" : "")}>Statistics</NavLink>
          </nav>

          <div className="module-view">
            <Routes>
              <Route path="payment" element={<PaymentModule />} />
              <Route path="feedback" element={<FeedbackModule />} />
              <Route path="report" element={<ReportModule />} />
              <Route path="content" element={<ContentModerationModule />} />
              <Route path="users" element={<UserManagementModule />} />
              <Route path="ai" element={<AIControlModule />} />
              <Route path="stats" element={<StatisticsModule />} />
              <Route path="*" element={<PaymentModule />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
