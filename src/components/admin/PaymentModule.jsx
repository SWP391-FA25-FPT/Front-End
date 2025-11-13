import React, { useState, useEffect, useCallback } from "react";
import {
  getAllSubscriptionsAdmin,
  checkExpiredSubscriptions,
  getSubscriptionPlans,
} from "../../apis/subscription";
import { CreditCard, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

export default function PaymentModule() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlanType, setFilterPlanType] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    canceled: 0,
  });

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};

      if (filterStatus !== "all") {
        params.status = filterStatus;
      }

      if (filterPlanType !== "all") {
        params.planType = filterPlanType;
      }

      const response = await getAllSubscriptionsAdmin(params);
      if (response.success) {
        setSubscriptions(response.data || []);
        // Calculate stats
        const total = response.data?.length || 0;
        const active = response.data?.filter((s) => s.status === "active").length || 0;
        const expired = response.data?.filter((s) => s.status === "expired").length || 0;
        const canceled = response.data?.filter((s) => s.status === "canceled").length || 0;
        setStats({ total, active, expired, canceled });
      } else {
        setError("Không thể tải danh sách subscriptions");
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError(err.message || "Lỗi khi tải danh sách subscriptions");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPlanType]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getSubscriptionPlans();
        if (response.success) {
          setPlans(response.data || []);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    fetchPlans();
  }, []);

  const handleCheckExpired = async () => {
    try {
      const response = await checkExpiredSubscriptions();
      if (response.success) {
        alert(`Đã cập nhật ${response.count || 0} subscription hết hạn`);
        await fetchSubscriptions();
      }
    } catch (err) {
      console.error("Error checking expired subscriptions:", err);
      alert(err.message || "Lỗi khi kiểm tra subscriptions hết hạn");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="badge bg-success">
            <CheckCircle size={12} className="me-1" />
            Active
          </span>
        );
      case "expired":
        return (
          <span className="badge bg-danger">
            <XCircle size={12} className="me-1" />
            Expired
          </span>
        );
      case "canceled":
        return (
          <span className="badge bg-secondary">
            <XCircle size={12} className="me-1" />
            Canceled
          </span>
        );
      case "pending":
        return (
          <span className="badge bg-warning">
            <Clock size={12} className="me-1" />
            Pending
          </span>
        );
      default:
        return <span className="badge bg-secondary">{status}</span>;
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

  const formatCurrency = (amount, currency = "VND") => {
    if (!amount) return "0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading && subscriptions.length === 0) {
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
      <h4 className="fw-bold mb-4">Subscription Management</h4>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded shadow-sm text-center"
            style={{
              borderLeft: "4px solid #0d6efd",
              background: "#e7f1ff",
            }}
          >
            <CreditCard size={24} className="mb-2 text-primary" />
            <h6 className="text-muted mb-1">Total Subscriptions</h6>
            <h3 className="fw-bold text-primary">{stats.total || 0}</h3>
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
            <CheckCircle size={24} className="mb-2 text-success" />
            <h6 className="text-muted mb-1">Active</h6>
            <h3 className="fw-bold text-success">{stats.active || 0}</h3>
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
            <XCircle size={24} className="mb-2 text-danger" />
            <h6 className="text-muted mb-1">Expired</h6>
            <h3 className="fw-bold text-danger">{stats.expired || 0}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded shadow-sm text-center"
            style={{
              borderLeft: "4px solid #6c757d",
              background: "#e9ecef",
            }}
          >
            <XCircle size={24} className="mb-2 text-secondary" />
            <h6 className="text-muted mb-1">Canceled</h6>
            <h3 className="fw-bold text-secondary">{stats.canceled || 0}</h3>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      {plans.length > 0 && (
        <div className="mb-4">
          <h5 className="fw-bold mb-3">Subscription Plans</h5>
          <div className="row">
            {plans.map((plan) => (
              <div key={plan._id || plan.id} className="col-md-4 mb-3">
                <div className="card p-3 shadow-sm">
                  <h5 className="fw-bold">{plan.name}</h5>
                  <p className="text-muted">{plan.description}</p>
                  <h3 className="fw-bold">
                    {formatCurrency(plan.price, plan.currency)}
                    <small className="text-muted">/{plan.duration}</small>
                  </h3>
                  <div className="mt-3">
                    <span
                      className={`badge ${
                        plan.active ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
            }}
          >
            <option value="all">Tất cả status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="canceled">Canceled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterPlanType}
            onChange={(e) => {
              setFilterPlanType(e.target.value);
            }}
          >
            <option value="all">Tất cả plan types</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary me-2"
            onClick={fetchSubscriptions}
          >
            Refresh
          </button>
          <button
            className="btn btn-warning"
            onClick={handleCheckExpired}
            title="Check and update expired subscriptions"
          >
            <RefreshCw size={16} className="me-1" />
            Check Expired
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm rounded overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Plan Type</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Payment Method</th>
              <th>Auto Renew</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Không có subscription nào
                </td>
              </tr>
            ) : (
              subscriptions.map((subscription) => (
                <tr key={subscription._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {subscription.userId?.profile?.profileImageUrl && (
                        <img
                          src={subscription.userId.profile.profileImageUrl}
                          alt={subscription.userId.name}
                          className="me-2 rounded-circle"
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div>
                        <strong>
                          {subscription.userId?.name || subscription.userId?.email || "N/A"}
                        </strong>
                        <br />
                        <small className="text-muted">
                          {subscription.userId?.email}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-info">{subscription.planType}</span>
                  </td>
                  <td>{subscription.planDuration}</td>
                  <td>{getStatusBadge(subscription.status)}</td>
                  <td>{formatDate(subscription.startDate)}</td>
                  <td>{formatDate(subscription.endDate)}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {subscription.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        subscription.autoRenew ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {subscription.autoRenew ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
