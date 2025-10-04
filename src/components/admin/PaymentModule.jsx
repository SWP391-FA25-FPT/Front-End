import React from "react";

export default function PaymentModule() {
  const plans = [
    { name: "Basic", price: 10, desc: "Basic features for small teams", current: true },
    { name: "Growth", price: 20, desc: "Better reports and automation", current: false },
    { name: "Scale", price: 30, desc: "Advanced planning tools", current: false },
    { name: "Enterprise", price: 40, desc: "Full access and API", current: false },
  ];

  const history = [
    { plan: "Basic", date: "Jan 2, 2023", price: 10, card: "1234" },
    { plan: "Basic", date: "Feb 2, 2023", price: 10, card: "1234" },
    { plan: "Growth", date: "Mar 2, 2023", price: 20, card: "4321" },
  ];

  return (
    <div>
      <h4 className="mb-3 fw-bold">Plans & Billing</h4>
      <div className="row mb-4">
        {plans.map((p) => (
          <div key={p.name} className="col-md-3">
            <div
              className="p-3 rounded shadow-sm text-center"
              style={{
                background: p.current ? "#f0f4ff" : "#fff",
                border: p.current ? "2px solid #007bff" : "1px solid #eee",
              }}
            >
              <h5>{p.name}</h5>
              <h2>${p.price}</h2>
              <p>{p.desc}</p>
              <button className={`btn ${p.current ? "btn-dark" : "btn-outline-primary"} btn-sm`}>
                {p.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h5 className="fw-bold mb-3">Billing History</h5>
      <div className="list-group">
        {history.map((h, i) => (
          <div key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{h.plan} Plan - USD ${h.price}</strong>
              <div className="text-muted">{h.date}</div>
            </div>
            <div>
              <span className="me-3 text-muted">Card ending {h.card}</span>
              <button className="btn btn-outline-secondary btn-sm">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
