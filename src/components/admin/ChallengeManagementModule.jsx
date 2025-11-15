import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllChallenges,
  deleteChallenge,
  getChallengeStats,
} from "../../apis/challenge";
import { Eye, Trash2, Edit, Search, Plus } from "lucide-react";
import ChallengeFormModal from "./ChallengeFormModal";
import "../../pages/style/ChallengeManagementModule.css";

export default function ChallengeManagementModule() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const challengesPerPage = 10;

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: challengesPerPage,
      };

      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (filterStatus !== "all") {
        params.status = filterStatus;
      }

      const response = await getAllChallenges(params);
      if (response.success) {
        setChallenges(response.data || []);
        setPagination(response.pagination || {});
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError("Không thể tải danh sách thử thách");
      }
    } catch (err) {
      console.error("Error fetching challenges:", err);
      setError(err.message || "Lỗi khi tải danh sách thử thách");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, searchTerm, challengesPerPage]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await getChallengeStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStatsData();
  }, []);

  const handleDelete = async (challengeId) => {
    try {
      setDeletingId(challengeId);
      await deleteChallenge(challengeId);
      fetchChallenges();
      const statsResponse = await getChallengeStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      setShowDeleteConfirm(false);
      setSelectedChallenge(null);
    } catch (err) {
      console.error("Error deleting challenge:", err);
      alert(err.message || "Lỗi khi xóa thử thách");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
    setShowFormModal(true);
  };

  const handleCreate = () => {
    setEditingChallenge(null);
    setShowFormModal(true);
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingChallenge(null);
    fetchChallenges();
    const fetchStatsData = async () => {
      try {
        const response = await getChallengeStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStatsData();
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      ongoing: { class: "bg-success", text: "Đang diễn ra" },
      upcoming: { class: "bg-info", text: "Sắp diễn ra" },
      ended: { class: "bg-secondary", text: "Đã kết thúc" },
    };
    const config = statusConfig[status] || statusConfig.upcoming;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading && challenges.length === 0) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Quản Lý Thử Thách</h4>
        <button
          className="btn btn-primary create-challenge-btn"
          onClick={handleCreate}
        >
          <Plus size={18} className="me-2" />
          Tạo Thử Thách Mới
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="p-3 rounded shadow-sm text-center stats-card-ongoing">
              <h6 className="text-muted mb-1">Đang diễn ra</h6>
              <h3 className="fw-bold text-success">
                {stats.ongoingChallenges || 0}
              </h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3 rounded shadow-sm text-center stats-card-upcoming">
              <h6 className="text-muted mb-1">Sắp diễn ra</h6>
              <h3 className="fw-bold text-info">
                {stats.upcomingChallenges || 0}
              </h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3 rounded shadow-sm text-center stats-card-ended">
              <h6 className="text-muted mb-1">Đã kết thúc</h6>
              <h3 className="fw-bold text-secondary">
                {stats.endedChallenges || 0}
              </h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3 rounded shadow-sm text-center stats-card-participants">
              <h6 className="text-muted mb-1">Tổng người tham gia</h6>
              <h3 className="fw-bold text-warning">
                {stats.totalParticipants || 0}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm thử thách..."
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
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả</option>
            <option value="ongoing">Đang diễn ra</option>
            <option value="upcoming">Sắp diễn ra</option>
            <option value="ended">Đã kết thúc</option>
          </select>
        </div>
        <div className="col-md-3 text-end">
          <button className="btn btn-outline-primary" onClick={fetchChallenges}>
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

      {/* Challenges Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm rounded overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>Thử Thách</th>
              <th>Danh Mục</th>
              <th>Trạng Thái</th>
              <th>Thời Gian</th>
              <th>Người Tham Gia</th>
              <th>Bài Nộp</th>
              <th>Ngày Tạo</th>
              <th className="text-end">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {challenges.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Không có thử thách nào
                </td>
              </tr>
            ) : (
              challenges.map((challenge) => (
                <tr key={challenge._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {challenge.image && (
                        <img
                          src={challenge.image}
                          alt={challenge.title}
                          className="me-2 challenge-image"
                        />
                      )}
                      <div>
                        <strong>{challenge.title}</strong>
                        {challenge.description && (
                          <p className="mb-0 text-muted small challenge-description">
                            {challenge.description.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-info">{challenge.category}</span>
                  </td>
                  <td>{getStatusBadge(challenge.status)}</td>
                  <td>
                    <small>
                      {formatDate(challenge.startDate)} -{" "}
                      {formatDate(challenge.endDate)}
                    </small>
                  </td>
                  <td>
                    {challenge.participants?.length ||
                      challenge.participantsCount ||
                      0}
                  </td>
                  <td>
                    {challenge.entries?.length || challenge.entriesCount || 0}
                  </td>
                  <td>{formatDate(challenge.createdAt)}</td>
                  <td className="text-end">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          navigate(`/admin/challenges/${challenge._id}`)
                        }
                        title="Xem"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleEdit(challenge)}
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setSelectedChallenge(challenge);
                          setShowDeleteConfirm(true);
                        }}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
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
        <nav aria-label="Challenge pagination">
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedChallenge && (
        <div
          className="modal show modal-backdrop"
          onClick={() => {
            setShowDeleteConfirm(false);
            setSelectedChallenge(null);
          }}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedChallenge(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Bạn có chắc chắn muốn xóa thử thách "{selectedChallenge.title}
                  "?
                </p>
                <p className="text-danger small">
                  Hành động này không thể hoàn tác!
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedChallenge(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedChallenge._id)}
                  disabled={deletingId === selectedChallenge._id}
                >
                  {deletingId === selectedChallenge._id ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <ChallengeFormModal
          challenge={editingChallenge}
          onClose={() => {
            setShowFormModal(false);
            setEditingChallenge(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
