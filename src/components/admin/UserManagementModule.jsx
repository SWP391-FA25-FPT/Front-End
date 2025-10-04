import React from "react";

export default function UserManagementModule() {
  const users = [
    { id: 1, name: "Alice", role: "Admin", active: true },
    { id: 2, name: "Bob", role: "User", active: false },
    { id: 3, name: "Charlie", role: "Moderator", active: true },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">User Management</h4>
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>
                <span className={`badge bg-${u.active ? "success" : "secondary"}`}>
                  {u.active ? "Active" : "Suspended"}
                </span>
              </td>
              <td>
                <button className="btn btn-outline-secondary btn-sm me-2">Edit</button>
                <button className="btn btn-outline-danger btn-sm">
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
