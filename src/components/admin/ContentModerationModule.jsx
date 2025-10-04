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
        <div key={c.id} className="card p-3 mb-3 shadow-sm">
          <div className="d-flex justify-content-between">
            <div>
              <strong>{c.user}</strong>
              <p>{c.text}</p>
            </div>
            <div>
              {c.flagged ? (
                <span className="badge bg-danger me-3">Flagged</span>
              ) : (
                <span className="badge bg-success me-3">Clean</span>
              )}
              <button className="btn btn-outline-primary btn-sm">Review</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
