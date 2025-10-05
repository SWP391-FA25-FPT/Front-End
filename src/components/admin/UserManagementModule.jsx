import React from "react";

export default function UserManagementModule() {
  const users = [
    { id: 1, name: "Alice", role: "Admin", active: true },
    { id: 2, name: "Bob", role: "User", active: false },
    { id: 3, name: "Charlie", role: "Moderator", active: true },
  ];

  const roleColor = (role) => {
    switch (role) {
      case "Admin":
        return "danger";
      case "Moderator":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-3">User Management</h4>
      <table className="table table-striped table-hover align-middle shadow-sm rounded overflow-hidden">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="fw-medium">{u.name}</td>
              <td>
                <span className={`badge bg-${roleColor(u.role)}`}>{u.role}</span>
              </td>
              <td>
                <span className={`badge bg-${u.active ? "success" : "secondary"}`}>
                  {u.active ? "Active" : "Suspended"}
                </span>
              </td>
              <td className="text-end">
                <button className="btn btn-outline-secondary btn-sm me-2">Edit</button>
                <button className={`btn btn-sm ${u.active ? "btn-outline-danger" : "btn-outline-success"}`}>
                  {u.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
