import React from "react";

export default function ReportModule() {
  const reports = [
    { id: 1, title: "Payment not loading", user: "Bob", date: "2023-02-10", severity: "High" },
    { id: 2, title: "Slow response", user: "David", date: "2023-03-04", severity: "Medium" },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">System Reports</h4>
      <div className="list-group shadow-sm rounded">
        {reports.map((r) => (
          <div
            key={r.id}
            className="list-group-item d-flex justify-content-between align-items-start"
            style={{
              borderLeft: r.severity === "High" ? "4px solid #dc3545" : "4px solid #ffc107",
              background: r.severity === "High" ? "#fff5f5" : "#fffbea",
            }}
          >
            <div>
              <strong>{r.title}</strong>
              <br />
              <small className="text-muted">
                Reported by {r.user} — {r.date}
              </small>
            </div>
            <span
              className={`badge bg-${r.severity === "High" ? "danger" : "warning"} rounded-pill px-3 py-2`}
            >
              {r.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
