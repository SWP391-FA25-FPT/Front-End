import React, { useState, useEffect } from "react";
import { getSystemStats } from "../../apis/admin";
import {
  Users,
  FileText,
  BookOpen,
  CreditCard,
  TrendingUp,
  Eye,
} from "lucide-react";

export default function StatisticsModule() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getSystemStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError("Không thể tải thống kê");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message || "Lỗi khi tải thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-5 text-muted">
        Không có dữ liệu thống kê
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4">System Statistics</h4>

      {/* Main Stats */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded shadow-sm text-center"
            style={{
              borderLeft: "4px solid #0d6efd",
              background: "#e7f1ff",
            }}
          >
            <Users size={24} className="mb-2 text-primary" />
            <h6 className="text-muted mb-1">Total Users</h6>
            <h3 className="fw-bold text-primary">
              {stats.users?.total || 0}
            </h3>
            <small className="text-muted">
              Active: {stats.users?.active || 0} | New: {stats.users?.new || 0}
            </small>
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
            <FileText size={24} className="mb-2 text-success" />
            <h6 className="text-muted mb-1">Total Recipes</h6>
            <h3 className="fw-bold text-success">
              {stats.recipes?.total || 0}
            </h3>
            <small className="text-muted">
              Published: {stats.recipes?.published || 0} | Views:{" "}
              {stats.recipes?.totalViews || 0}
            </small>
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
            <BookOpen size={24} className="mb-2 text-warning" />
            <h6 className="text-muted mb-1">Total Blogs</h6>
            <h3 className="fw-bold text-warning">
              {stats.blogs?.total || 0}
            </h3>
            <small className="text-muted">
              Published: {stats.blogs?.published || 0} | Views:{" "}
              {stats.blogs?.totalViews || 0}
            </small>
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
            <CreditCard size={24} className="mb-2 text-danger" />
            <h6 className="text-muted mb-1">Subscriptions</h6>
            <h3 className="fw-bold text-danger">
              {stats.subscriptions?.active || 0}
            </h3>
            <small className="text-muted">
              Total: {stats.subscriptions?.total || 0} | Revenue:{" "}
              {stats.subscriptions?.revenue
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(stats.subscriptions.revenue)
                : "0"}
            </small>
          </div>
        </div>
      </div>

      {/* Users by Role */}
      {stats.users?.byRole && stats.users.byRole.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <h5 className="fw-bold mb-3">Users by Role</h5>
            <div className="row">
              {stats.users.byRole.map((role) => (
                <div key={role._id} className="col-md-4 mb-3">
                  <div
                    className="p-3 rounded shadow-sm"
                    style={{
                      borderLeft: "4px solid #6c757d",
                      background: "#f8f9fa",
                    }}
                  >
                    <h6 className="text-muted mb-1">
                      {role._id || "Unknown"}
                    </h6>
                    <h4 className="fw-bold">{role.count || 0}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Growth Stats */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div
            className="p-3 rounded shadow-sm"
            style={{
              borderLeft: "4px solid #0dcaf0",
              background: "#cff4fc",
            }}
          >
            <TrendingUp size={20} className="mb-2 text-info" />
            <h6 className="text-muted mb-1">Growth (Last 30 Days)</h6>
            <div className="d-flex justify-content-between">
              <div>
                <strong>New Users:</strong> {stats.users?.new || 0}
              </div>
              <div>
                <strong>New Recipes:</strong> {stats.recipes?.new || 0}
              </div>
              <div>
                <strong>New Blogs:</strong> {stats.blogs?.new || 0}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div
            className="p-3 rounded shadow-sm"
            style={{
              borderLeft: "4px solid #6610f2",
              background: "#e7d5ff",
            }}
          >
            <Eye size={20} className="mb-2 text-purple" />
            <h6 className="text-muted mb-1">Total Views</h6>
            <div className="d-flex justify-content-between">
              <div>
                <strong>Recipe Views:</strong>{" "}
                {stats.recipes?.totalViews || 0}
              </div>
              <div>
                <strong>Blog Views:</strong> {stats.blogs?.totalViews || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {stats.analytics && (
        <div className="row mb-4">
          <div className="col-12">
            <h5 className="fw-bold mb-3">Analytics</h5>
            <div
              className="p-3 rounded shadow-sm"
              style={{
                borderLeft: "4px solid #20c997",
                background: "#d1f2eb",
              }}
            >
              <h6 className="text-muted mb-1">Total Searches</h6>
              <h3 className="fw-bold text-teal">
                {stats.analytics.totalSearches || 0}
              </h3>
              {stats.analytics.topSearches &&
                stats.analytics.topSearches.length > 0 && (
                  <div className="mt-3">
                    <strong>Top Searches:</strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {stats.analytics.topSearches
                        .slice(0, 10)
                        .map((search, index) => (
                          <span
                            key={index}
                            className="badge bg-secondary"
                          >
                            {search.keyword} ({search.searchCount})
                          </span>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-end">
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              setLoading(true);
              const response = await getSystemStats();
              if (response.success) {
                setStats(response.data);
              }
            } catch (err) {
              console.error("Error fetching stats:", err);
              setError(err.message || "Lỗi khi tải thống kê");
            } finally {
              setLoading(false);
            }
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
