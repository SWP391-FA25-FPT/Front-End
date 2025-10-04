import React from "react";

export default function StatisticsModule() {
  const stats = [
    { name: "Active Users", value: 1200 },
    { name: "Reports", value: 45 },
    { name: "Feedbacks", value: 32 },
    { name: "Revenue ($)", value: 920 },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">System Statistics</h4>
      <div className="row">
        {stats.map((s) => (
          <div key={s.name} className="col-md-3 mb-3">
            <div className="card text-center p-3 shadow-sm">
              <h6>{s.name}</h6>
              <h3 className="fw-bold">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
