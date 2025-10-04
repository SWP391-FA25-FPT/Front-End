import React from "react";

export default function FeedbackModule() {
  const feedbacks = [
    { id: 1, user: "Alice", comment: "App UI is great!", status: "Replied" },
    { id: 2, user: "Bob", comment: "Payment failed twice", status: "Pending" },
    { id: 3, user: "Charlie", comment: "Love the analytics!", status: "Replied" },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">User Feedback</h4>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>User</th>
            <th>Comment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f) => (
            <tr key={f.id}>
              <td>{f.user}</td>
              <td>{f.comment}</td>
              <td>
                <span className={`badge bg-${f.status === "Replied" ? "success" : "warning"}`}>
                  {f.status}
                </span>
              </td>
              <td>
                <button className="btn btn-outline-primary btn-sm">Reply</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
