import React, { useState, useEffect, useCallback } from "react";
import {
  getAllFeedbacksAdmin,
  replyToFeedback,
  updateFeedbackStatus,
  getFeedbackStats,
} from "../../apis/feedback";
import { Search, MessageSquare, CheckCircle, Clock, XCircle } from "lucide-react";

export default function FeedbackModule() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const feedbacksPerPage = 10;

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: feedbacksPerPage,
      };

      if (filterStatus !== "all") {
        params.status = filterStatus;
      }

      if (filterType !== "all") {
        params.type = filterType;
      }

      const response = await getAllFeedbacksAdmin(params);
      if (response.success) {
        setFeedbacks(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError("Không thể tải danh sách feedback");
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError(err.message || "Lỗi khi tải danh sách feedback");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, filterType, feedbacksPerPage]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await getFeedbackStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStatsData();
  }, []);

  const handleReply = async (feedbackId, message) => {
    try {
      await replyToFeedback(feedbackId, message);
      await fetchFeedbacks();
      const statsResponse = await getFeedbackStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      setShowReplyModal(false);
      setSelectedFeedback(null);
      setReplyMessage("");
    } catch (err) {
      console.error("Error replying to feedback:", err);
      alert(err.message || "Lỗi khi phản hồi feedback");
    }
  };

  const handleStatusChange = async (feedbackId, status) => {
    try {
      await updateFeedbackStatus(feedbackId, status);
      await fetchFeedbacks();
      const statsResponse = await getFeedbackStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error("Error updating feedback status:", err);
      alert(err.message || "Lỗi khi cập nhật status feedback");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="badge bg-warning">
            <Clock size={12} className="me-1" />
            Pending
          </span>
        );
      case "replied":
        return (
          <span className="badge bg-success">
            <CheckCircle size={12} className="me-1" />
            Replied
          </span>
        );
      case "resolved":
        return (
          <span className="badge bg-info">
            <CheckCircle size={12} className="me-1" />
            Resolved
          </span>
        );
      case "closed":
        return (
          <span className="badge bg-secondary">
            <XCircle size={12} className="me-1" />
            Closed
          </span>
        );
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      bug: "danger",
      feature: "primary",
      improvement: "info",
      other: "secondary",
    };
    return (
      <span className={`badge bg-${typeColors[type] || "secondary"}`}>
        {type}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && feedbacks.length === 0) {
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
      <h4 className="fw-bold mb-4">User Feedback</h4>

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
              <h6 className="text-muted mb-1">Total Feedbacks</h6>
              <h3 className="fw-bold text-primary">
                {stats.totalFeedbacks || 0}
              </h3>
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
              <h6 className="text-muted mb-1">Pending</h6>
              <h3 className="fw-bold text-warning">
                {stats.pendingFeedbacks || 0}
              </h3>
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
              <h6 className="text-muted mb-1">Replied</h6>
              <h3 className="fw-bold text-success">
                {stats.feedbacksByStatus?.find((s) => s._id === "replied")
                  ?.count || 0}
              </h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="p-3 rounded shadow-sm text-center"
              style={{
                borderLeft: "4px solid #0dcaf0",
                background: "#cff4fc",
              }}
            >
              <h6 className="text-muted mb-1">Resolved</h6>
              <h3 className="fw-bold text-info">
                {stats.feedbacksByStatus?.find((s) => s._id === "resolved")
                  ?.count || 0}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả status</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả types</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="improvement">Improvement</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary"
            onClick={async () => {
              fetchFeedbacks();
              try {
                const statsResponse = await getFeedbackStats();
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

      {/* Feedbacks Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm rounded overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  Không có feedback nào
                </td>
              </tr>
            ) : (
              feedbacks.map((feedback) => (
                <tr key={feedback._id}>
                  <td>
                    <strong>{feedback.userName || feedback.userEmail}</strong>
                    <br />
                    <small className="text-muted">{feedback.userEmail}</small>
                  </td>
                  <td>{getTypeBadge(feedback.type)}</td>
                  <td>
                    <strong>{feedback.subject}</strong>
                  </td>
                  <td>
                    <p className="mb-0" style={{ maxWidth: "300px" }}>
                      {feedback.message.substring(0, 100)}
                      {feedback.message.length > 100 ? "..." : ""}
                    </p>
                  </td>
                  <td>{getStatusBadge(feedback.status)}</td>
                  <td>{formatDate(feedback.createdAt)}</td>
                  <td className="text-end">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setReplyMessage("");
                          setShowReplyModal(true);
                        }}
                        title="Reply"
                        disabled={feedback.status === "closed"}
                      >
                        <MessageSquare size={16} />
                      </button>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: "auto" }}
                        value={feedback.status}
                        onChange={(e) =>
                          handleStatusChange(feedback._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="replied">Replied</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
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
        <nav aria-label="Feedback pagination">
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              )
            )}
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

      {/* Reply Modal */}
      {showReplyModal && selectedFeedback && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => {
            setShowReplyModal(false);
            setSelectedFeedback(null);
            setReplyMessage("");
          }}
        >
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reply to Feedback</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedFeedback(null);
                    setReplyMessage("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>From:</strong> {selectedFeedback.userName} (
                  {selectedFeedback.userEmail})
                </div>
                <div className="mb-3">
                  <strong>Subject:</strong> {selectedFeedback.subject}
                </div>
                <div className="mb-3">
                  <strong>Message:</strong>
                  <p className="border p-2 rounded">{selectedFeedback.message}</p>
                </div>
                {selectedFeedback.reply && (
                  <div className="mb-3">
                    <strong>Previous Reply:</strong>
                    <p className="border p-2 rounded bg-light">
                      {selectedFeedback.reply.message}
                    </p>
                    <small className="text-muted">
                      Replied at: {formatDate(selectedFeedback.reply.repliedAt)}
                    </small>
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="replyMessage" className="form-label">
                    Your Reply:
                  </label>
                  <textarea
                    id="replyMessage"
                    className="form-control"
                    rows="5"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Nhập phản hồi của bạn..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedFeedback(null);
                    setReplyMessage("");
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleReply(selectedFeedback._id, replyMessage)}
                  disabled={!replyMessage.trim()}
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
