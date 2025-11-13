import React, { useState, useEffect, useCallback } from "react";
import {
  getAllReportsAdmin,
  updateReportStatus,
  getReportStats,
} from "../../apis/report";
import { AlertTriangle, CheckCircle, Clock, XCircle, Eye } from "lucide-react";

export default function ReportModule() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState("");

  const reportsPerPage = 10;

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: reportsPerPage,
      };

      if (filterStatus !== "all") {
        params.status = filterStatus;
      }

      if (filterType !== "all") {
        params.type = filterType;
      }

      if (filterSeverity !== "all") {
        params.severity = filterSeverity;
      }

      const response = await getAllReportsAdmin(params);
      if (response.success) {
        setReports(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError("Không thể tải danh sách reports");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.message || "Lỗi khi tải danh sách reports");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus, filterType, filterSeverity, reportsPerPage]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await getReportStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStatsData();
  }, []);

  const handleStatusChange = async (reportId, status, resolutionText) => {
    try {
      await updateReportStatus(reportId, status, resolutionText);
      await fetchReports();
      const statsResponse = await getReportStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      setShowResolveModal(false);
      setSelectedReport(null);
      setResolution("");
    } catch (err) {
      console.error("Error updating report status:", err);
      alert(err.message || "Lỗi khi cập nhật status report");
    }
  };

  const handleResolve = (report) => {
    setSelectedReport(report);
    setResolution(report.resolution || "");
    setShowResolveModal(true);
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
      case "reviewing":
        return (
          <span className="badge bg-info">
            <Eye size={12} className="me-1" />
            Reviewing
          </span>
        );
      case "resolved":
        return (
          <span className="badge bg-success">
            <CheckCircle size={12} className="me-1" />
            Resolved
          </span>
        );
      case "dismissed":
        return (
          <span className="badge bg-secondary">
            <XCircle size={12} className="me-1" />
            Dismissed
          </span>
        );
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getSeverityBadge = (severity) => {
    const severityColors = {
      low: "secondary",
      medium: "warning",
      high: "danger",
      critical: "danger",
    };
    return (
      <span className={`badge bg-${severityColors[severity] || "secondary"}`}>
        <AlertTriangle size={12} className="me-1" />
        {severity}
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

  if (loading && reports.length === 0) {
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
      <h4 className="fw-bold mb-4">System Reports</h4>

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
              <h6 className="text-muted mb-1">Total Reports</h6>
              <h3 className="fw-bold text-primary">
                {stats.totalReports || 0}
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
                {stats.pendingReports || 0}
              </h3>
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
              <h6 className="text-muted mb-1">High Severity</h6>
              <h3 className="fw-bold text-danger">
                {stats.highSeverityReports || 0}
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
              <h6 className="text-muted mb-1">Resolved</h6>
              <h3 className="fw-bold text-success">
                {stats.reportsByStatus?.find((s) => s._id === "resolved")
                  ?.count || 0}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
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
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả types</option>
            <option value="recipe">Recipe</option>
            <option value="blog">Blog</option>
            <option value="comment">Comment</option>
            <option value="user">User</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterSeverity}
            onChange={(e) => {
              setFilterSeverity(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="col-md-3 text-end">
          <button
            className="btn btn-primary"
            onClick={async () => {
              fetchReports();
              try {
                const statsResponse = await getReportStats();
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

      {/* Reports List */}
      <div className="list-group shadow-sm rounded">
        {reports.length === 0 ? (
          <div className="list-group-item text-center py-4 text-muted">
            Không có report nào
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report._id}
              className="list-group-item d-flex justify-content-between align-items-start"
              style={{
                borderLeft:
                  report.severity === "high" || report.severity === "critical"
                    ? "4px solid #dc3545"
                    : "4px solid #ffc107",
                background:
                  report.severity === "high" || report.severity === "critical"
                    ? "#fff5f5"
                    : "#fffbea",
              }}
            >
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <strong>{report.reason}</strong>
                    <br />
                    <small className="text-muted">
                      Reported by {report.userName} ({report.userEmail}) —{" "}
                      {formatDate(report.createdAt)}
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    {getSeverityBadge(report.severity)}
                    {getStatusBadge(report.status)}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="badge bg-info me-2">{report.type}</span>
                  <span className="badge bg-secondary">
                    Target: {report.targetType}
                  </span>
                </div>
                {report.description && (
                  <p className="mb-2">{report.description}</p>
                )}
                {report.resolution && (
                  <div className="mt-2 p-2 rounded bg-light">
                    <strong>Resolution:</strong> {report.resolution}
                  </div>
                )}
              </div>
              <div className="ms-3">
                <div className="btn-group-vertical" role="group">
                  <button
                    className="btn btn-sm btn-outline-primary mb-2"
                    onClick={() => {
                      setSelectedReport(report);
                      setShowDetailModal(true);
                    }}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  {report.status !== "resolved" &&
                    report.status !== "dismissed" && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleResolve(report)}
                        title="Resolve"
                      >
                        Resolve
                      </button>
                    )}
                  <select
                    className="form-select form-select-sm"
                    value={report.status}
                    onChange={(e) =>
                      handleStatusChange(report._id, e.target.value, "")
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Report pagination" className="mt-3">
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

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => {
            setShowDetailModal(false);
            setSelectedReport(null);
          }}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Report Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedReport(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Reporter:</strong> {selectedReport.userName} (
                  {selectedReport.userEmail})
                </div>
                <div className="mb-3">
                  <strong>Type:</strong> {selectedReport.type}
                </div>
                <div className="mb-3">
                  <strong>Target Type:</strong> {selectedReport.targetType}
                </div>
                <div className="mb-3">
                  <strong>Target ID:</strong> {selectedReport.targetId}
                </div>
                <div className="mb-3">
                  <strong>Severity:</strong>{" "}
                  {getSeverityBadge(selectedReport.severity)}
                </div>
                <div className="mb-3">
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(selectedReport.status)}
                </div>
                <div className="mb-3">
                  <strong>Reason:</strong>
                  <p className="border p-2 rounded">{selectedReport.reason}</p>
                </div>
                {selectedReport.description && (
                  <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="border p-2 rounded">
                      {selectedReport.description}
                    </p>
                  </div>
                )}
                {selectedReport.resolution && (
                  <div className="mb-3">
                    <strong>Resolution:</strong>
                    <p className="border p-2 rounded bg-light">
                      {selectedReport.resolution}
                    </p>
                  </div>
                )}
                <div className="mb-3">
                  <strong>Created:</strong>{" "}
                  {formatDate(selectedReport.createdAt)}
                </div>
                {selectedReport.reviewedAt && (
                  <div className="mb-3">
                    <strong>Reviewed At:</strong>{" "}
                    {formatDate(selectedReport.reviewedAt)}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedReport(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && selectedReport && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => {
            setShowResolveModal(false);
            setSelectedReport(null);
            setResolution("");
          }}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resolve Report</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowResolveModal(false);
                    setSelectedReport(null);
                    setResolution("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Report:</strong> {selectedReport.reason}
                </div>
                <div className="mb-3">
                  <label htmlFor="resolution" className="form-label">
                    Resolution:
                  </label>
                  <textarea
                    id="resolution"
                    className="form-control"
                    rows="5"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Nhập giải pháp xử lý..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowResolveModal(false);
                    setSelectedReport(null);
                    setResolution("");
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() =>
                    handleStatusChange(
                      selectedReport._id,
                      "resolved",
                      resolution
                    )
                  }
                >
                  Mark as Resolved
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    handleStatusChange(
                      selectedReport._id,
                      "dismissed",
                      resolution
                    )
                  }
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
