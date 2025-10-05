import React, { useState } from "react";

export default function AIControlModule() {
  const [enabled, setEnabled] = useState(true);

  const subsystems = [
    { name: "Recommendation Engine", status: enabled },
    { name: "Auto-Moderation", status: false },
    { name: "Anomaly Detection", status: true },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">AI Control Center</h4>

      <div className="row">
        {subsystems.map((sys, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div
              className="p-3 rounded shadow-sm"
              style={{
                background: sys.status ? "#f0fff4" : "#fff5f5",
                border: sys.status ? "1px solid #28a745" : "1px solid #dc3545",
              }}
            >
              <h5 className="mb-1">{sys.name}</h5>
              <p className="mb-2">
                Status:{" "}
                <b className={sys.status ? "text-success" : "text-danger"}>
                  {sys.status ? "Running" : "Stopped"}
                </b>
              </p>
              <button
                className={`btn ${sys.status ? "btn-danger" : "btn-success"} btn-sm`}
                onClick={() => alert("Toggle API call here")}
              >
                {sys.status ? "Stop" : "Start"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-3 mt-4">
        <h5>Global AI Power</h5>
        <p>
          Master Switch:{" "}
          <b className={enabled ? "text-success" : "text-danger"}>
            {enabled ? "Enabled" : "Disabled"}
          </b>
        </p>
        <button
          className={`btn ${enabled ? "btn-danger" : "btn-success"}`}
          onClick={() => setEnabled(!enabled)}
        >
          {enabled ? "Disable All AI" : "Enable All AI"}
        </button>
      </div>
    </div>
  );
}
