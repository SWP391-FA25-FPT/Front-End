import React from "react";

export default function ContentModerationModule() {
  const contents = [
    { id: 1, user: "Alice", text: "This app sucks!", flagged: true },
    { id: 2, user: "Bob", text: "Great feature update!", flagged: false },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">Content Moderation</h4>

      {contents.map((c) => (
        <div
          key={c.id}
          className="p-3 mb-3 rounded shadow-sm"
          style={{
            borderLeft: c.flagged ? "4px solid #dc3545" : "4px solid #28a745",
            background: c.flagged ? "#fff5f5" : "#f0fff4",
          }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>{c.user}</strong>
              <p className="mb-1">{c.text}</p>
            </div>
            <div className="text-end">
              <span className={`badge me-2 ${c.flagged ? "bg-danger" : "bg-success"}`}>
                {c.flagged ? "Flagged" : "Clean"}
              </span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => alert(`Reviewing content #${c.id}`)}
              >
                Review
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
