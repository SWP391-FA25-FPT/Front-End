import React, { useState } from "react";

export default function AIControlModule() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div>
      <h4 className="fw-bold mb-3">AI Control Center</h4>
      <div className="card p-3">
        <h5>Recommendation Engine</h5>
        <p>Status: {enabled ? <b>Running</b> : <b>Stopped</b>}</p>
        <button
          className={`btn ${enabled ? "btn-danger" : "btn-success"}`}
          onClick={() => setEnabled(!enabled)}
        >
          {enabled ? "Stop AI" : "Start AI"}
        </button>
      </div>
    </div>
  );
}
