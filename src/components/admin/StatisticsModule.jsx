import React from "react";

export default function StatisticsModule() {
  const stats = [
    { name: "Active Users", value: 1200, tone: "primary" },
    { name: "Reports", value: 45, tone: "danger" },
    { name: "Feedbacks", value: 32, tone: "warning" },
    { name: "Revenue ($)", value: 920, tone: "success" },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">System Statistics</h4>
      <div className="row">
        {stats.map((s) => (
          <div key={s.name} className="col-md-3 mb-3">
            <div
              className="p-3 rounded shadow-sm text-center"
              style={{
                borderLeft: `4px solid var(--bs-${s.tone})`,
                background: `var(--bs-${s.tone}-bg-subtle, #f8f9fa)`,
              }}
            >
              <h6 className="text-muted mb-1">{s.name}</h6>
              <h3 className={`fw-bold text-${s.tone}`}>{s.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
