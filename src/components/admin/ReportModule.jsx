import React from "react";

export default function ReportModule() {
  const reports = [
    { id: 1, title: "Payment not loading", user: "Bob", date: "2023-02-10", severity: "High" },
    { id: 2, title: "Slow response", user: "David", date: "2023-03-04", severity: "Medium" },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">System Reports</h4>
      <ul className="list-group">
        {reports.map((r) => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{r.title}</strong> <br />
              <small className="text-muted">
                Reported by {r.user} — {r.date}
              </small>
            </div>
            <span
              className={`badge bg-${r.severity === "High" ? "danger" : "warning"} rounded-pill`}
            >
              {r.severity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
