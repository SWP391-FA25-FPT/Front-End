import React, { useState, useEffect, useCallback } from "react";
import {
  getAllUsersAdmin,
  banUserAdmin,
  unbanUserAdmin,
  updateUserAdmin,
  getUserStatsAdmin,
} from "../../apis/user";
import { Search, Ban, CheckCircle, Edit, UserX, UserCheck } from "lucide-react";

export default function UserManagementModule() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterBanned, setFilterBanned] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });

  const usersPerPage = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: usersPerPage,
      };

      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (filterRole !== "all") {
        params.role = filterRole;
      }

      if (filterBanned !== "all") {
        params.banned = filterBanned === "banned";
      }

      const response = await getAllUsersAdmin(params);
      if (response.success) {
        setUsers(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError("Không thể tải danh sách users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Lỗi khi tải danh sách users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterRole, filterBanned, searchTerm, usersPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await getUserStatsAdmin();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStatsData();
  }, []);

  const handleBan = async (userId, reason) => {
    try {
      await banUserAdmin(userId, reason);
      await fetchUsers();
      const statsResponse = await getUserStatsAdmin();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      setShowBanModal(false);
      setSelectedUser(null);
      setBanReason("");
    } catch (err) {
      console.error("Error banning user:", err);
      alert(err.message || "Lỗi khi ban user");
    }
  };

  const handleUnban = async (userId) => {
    try {
      await unbanUserAdmin(userId);
      await fetchUsers();
      const statsResponse = await getUserStatsAdmin();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error("Error unbanning user:", err);
      alert(err.message || "Lỗi khi unban user");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUserAdmin(selectedUser._id, editForm);
      await fetchUsers();
      setShowEditModal(false);
      setSelectedUser(null);
      setEditForm({ name: "", email: "", role: "" });
    } catch (err) {
      console.error("Error updating user:", err);
      alert(err.message || "Lỗi khi cập nhật user");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
    setShowEditModal(true);
  };

  const handleBanClick = (user) => {
    setSelectedUser(user);
    setBanReason("");
    setShowBanModal(true);
  };

  const roleColor = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "professional":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4">User Management</h4>

      {/* Stats Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div
              className="p-3 rounded shadow-sm text-center"
              style={{
                borderLeft: "4px solid #0d6efd",
                background: "#e7f1ff",
              }}
            >
              <h6 className="text-muted mb-1">Total Users</h6>
              <h3 className="fw-bold text-primary">{stats.totalUsers || 0}</h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="p-3 rounded shadow-sm text-center"
              style={{
                borderLeft: "4px solid #198754",
                background: "#d1e7dd",
              }}
            >
              <h6 className="text-muted mb-1">Active Users</h6>
              <h3 className="fw-bold text-success">{stats.activeUsers || 0}</h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="p-3 rounded shadow-sm text-center"
              style={{
                borderLeft: "4px solid #ffc107",
                background: "#fff3cd",
              }}
            >
              <h6 className="text-muted mb-1">New Users (30d)</h6>
              <h3 className="fw-bold text-warning">{stats.newUsers || 0}</h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="p-3 rounded shadow-sm text-center"
              style={{
                borderLeft: "4px solid #dc3545",
                background: "#f8d7da",
              }}
            >
              <h6 className="text-muted mb-1">Banned Users</h6>
              <h3 className="fw-bold text-danger">{stats.bannedUsers || 0}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="row mb-3">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm user..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (currentPage !== 1) {
                  setCurrentPage(1);
                }
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="professional">Professional</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterBanned}
            onChange={(e) => {
              setFilterBanned(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
        <div className="col-md-2 text-end">
          <button
            className="btn btn-primary"
            onClick={async () => {
              fetchUsers();
              try {
                const statsResponse = await getUserStatsAdmin();
                if (statsResponse.success) {
                  setStats(statsResponse.data);
                }
              } catch (err) {
                console.error("Error fetching stats:", err);
              }
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm rounded overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Không có user nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="fw-medium">
                    <div className="d-flex align-items-center">
                      {user.profile?.profileImageUrl && (
                        <img
                          src={user.profile.profileImageUrl}
                          alt={user.name}
                          className="me-2 rounded-circle"
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <span>{user.name || user.email}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge bg-${roleColor(user.role)}`}>
                      {user.role || "user"}
                    </span>
                  </td>
                  <td>
                    {user.banned ? (
                      <span className="badge bg-danger">
                        <Ban size={12} className="me-1" />
                        Banned
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        <CheckCircle size={12} className="me-1" />
                        Active
                      </span>
                    )}
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td className="text-end">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(user)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      {user.banned ? (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleUnban(user._id)}
                          title="Unban"
                        >
                          <UserCheck size={16} />
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleBanClick(user)}
                          title="Ban"
                          disabled={user.role === "admin"}
                        >
                          <UserX size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="User pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Ban Modal */}
      {showBanModal && selectedUser && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => {
            setShowBanModal(false);
            setSelectedUser(null);
            setBanReason("");
          }}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ban User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowBanModal(false);
                    setSelectedUser(null);
                    setBanReason("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Bạn có chắc chắn muốn ban user "{selectedUser.name || selectedUser.email}"?
                </p>
                <div className="mb-3">
                  <label htmlFor="banReason" className="form-label">
                    Lý do ban:
                  </label>
                  <textarea
                    id="banReason"
                    className="form-control"
                    rows="3"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Nhập lý do ban user..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowBanModal(false);
                    setSelectedUser(null);
                    setBanReason("");
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleBan(selectedUser._id, banReason)}
                >
                  Ban User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            setEditForm({ name: "", email: "", role: "" });
          }}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setEditForm({ name: "", email: "", role: "" });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editName" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="editName"
                    className="form-control"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editEmail" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="editEmail"
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editRole" className="form-label">
                    Role:
                  </label>
                  <select
                    id="editRole"
                    className="form-select"
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    disabled={selectedUser.role === "admin"}
                  >
                    <option value="user">User</option>
                    <option value="professional">Professional</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setEditForm({ name: "", email: "", role: "" });
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
