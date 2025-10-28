import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Layout from "../../components/layout/AppLayout"; 

import PaymentModule from "../../components/admin/PaymentModule"; 
import FeedbackModule from "../../components/admin/FeedbackModule"; 
import ReportModule from "../../components/admin/ReportModule"; 
import ContentModerationModule from "../../components/admin/ContentModerationModule"; 
import UserManagementModule from "../../components/admin/UserManagementModule"; 
import AIControlModule from "../../components/admin/AIControlModule"; 
import StatisticsModule from "../../components/admin/StatisticsModule"; 

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
    <React.Fragment>
      <Layout>
        <Container className="py-4">
          
          <main>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Admin Settings
            </h2>

            <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mb-6">
              {Object.entries(modules).map(([key, module]) => (
                <button
                  key={key}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors 
                              ${
                                activeModule === key
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                              }`}
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

        </Container>
      </Layout>
    </React.Fragment>
  );
}