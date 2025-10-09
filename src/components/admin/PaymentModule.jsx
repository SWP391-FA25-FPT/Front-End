import React from "react";

export default function PaymentModule() {
  const plan = {
    name: "Pro Subscription",
    price: 20,
    desc: "Access to all premium features",
    active: true,
  };

  const payments = [
    { user: "Alice", date: "2023-03-01", price: 20, card: "1234" },
    { user: "Bob", date: "2023-03-02", price: 20, card: "4321" },
    { user: "Charlie", date: "2023-03-03", price: 20, card: "5678" },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">Subscription Plan Settings</h4>

      {/* Plan Settings */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="fw-bold">{plan.name}</h5>
        <p>{plan.desc}</p>
        <h3 className="fw-bold">
          ${plan.price}
          <small className="text-muted">/month</small>
        </h3>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-outline-primary btn-sm">Edit Plan</button>
          <button
            className={`btn btn-sm ${
              plan.active ? "btn-outline-danger" : "btn-outline-success"
            }`}
          >
            {plan.active ? "Disable Subscription" : "Enable Subscription"}
          </button>
        </div>
      </div>

      {/* Billing History */}
      <h5 className="fw-bold mb-3">User Billing History</h5>
      <div className="list-group">
        {payments.map((p, i) => (
          <div
            key={i}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{p.user}</strong> — USD ${p.price}
              <div className="text-muted">{p.date}</div>
            </div>
            <div>
              <span className="me-3 text-muted">Card ending {p.card}</span>
              <button className="btn btn-outline-secondary btn-sm">Refund</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
