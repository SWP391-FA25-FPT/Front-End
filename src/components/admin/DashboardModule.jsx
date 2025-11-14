import React, { useState, useEffect } from "react";
import "../../pages/style/DashboardAdmin.css";
import { Card, Row, Col, Spin, Alert } from "antd";
import { Icon } from "@iconify/react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { getSystemStats } from "../../apis/admin";

export default function DashboardModule() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025); // Default to 2025

  // Generate years from 2025 to 2029
  const availableYears = [2025, 2026, 2027, 2028, 2029];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSystemStats(selectedYear);
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
  }, [selectedYear]);

  // Format số với dấu phẩy
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString("vi-VN");
  };

  // Format tiền VNĐ
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0đ";
    return `${amount.toLocaleString("vi-VN")}đ`;
  };

  // Format % thay đổi từ API
  const formatChange = (change) => {
    if (change === undefined || change === null) return "+0%";
    const changeValue = parseFloat(change);
    return changeValue >= 0 ? `+${changeValue.toFixed(0)}%` : `${changeValue.toFixed(0)}%`;
  };

  // ===================== KPI THỐNG KÊ =====================
  const kpiData = stats
    ? [
        {
          title: "Người dùng Premium đang hoạt động",
          value: formatNumber(stats.subscriptions?.active || 0),
          change: formatChange(stats.subscriptions?.activeChange),
          icon: "mdi:diamond-stone",
          color: "#EAB308",
        },
        {
          title: "Người dùng mới (tháng này)",
          value: formatNumber(stats.users?.new || 0),
          change: formatChange(stats.users?.newChange),
          icon: "mdi:account-plus-outline",
          color: "#22C55E",
        },
        {
          title: "Tổng lượt tìm kiếm",
          value: formatNumber(stats.analytics?.totalSearches || 0),
          change: formatChange(stats.analytics?.searchesChange),
          icon: "mdi:robot-outline",
          color: "#F97316",
        },
        {
          title: "Tổng doanh thu",
          value: formatCurrency(stats.subscriptions?.revenue || 0),
          change: formatChange(stats.subscriptions?.revenueChange),
          icon: "mdi:credit-card-outline",
          color: "#6366F1",
        },
      ]
    : [];

  // ===================== BIỂU ĐỒ BAR =====================
  // Lấy data từ API
  const subscriptionData = stats?.subscriptions?.monthlyGrowth || [];

  // ===================== BIỂU ĐỒ DONUT =====================
  // Lấy data từ API
  const trafficSource = stats?.users?.byKnowledgeSource || [];
  const trafficColors = ["#6366F1", "#22C55E", "#F97316", "#EAB308", "#EF4444"];

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spin size="large" />
        <div className="mt-3">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon />;
  }

  return (
    <div className="admin-dashboard-wrapper">

      {/* ====== KPIs ====== */}
      <Row gutter={[24, 24]}>
        {kpiData.length > 0 ? (
          kpiData.map((item, index) => (
            <Col xs={24} md={6} key={index}>
              <Card className="kpi-card">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="admin-kpi-title">{item.title}</p>
                  <Icon icon={item.icon} width="26" color={item.color} />
                </div>

                <h2 className="admin-kpi-value">{item.value}</h2>

                <span
                  className="admin-kpi-change"
                  style={{ color: item.change.includes("+") ? "green" : "red" }}
                >
                  {item.change} so với tháng trước
                </span>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Alert message="Không có dữ liệu" type="info" />
          </Col>
        )}
      </Row>

      {/* ====== CHARTS ====== */}
      <Row gutter={[24, 24]} className="mt-4">

        {/* BAR CHART */}
        <Col xs={24} md={16}>
          <Card 
            className="chart-container" 
            title="Tăng trưởng người dùng Premium"
            extra={
              <select
                className="form-select form-select-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{ width: "120px" }}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            }
          >
            {subscriptionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subscriptionData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-5 text-muted">
                Chưa có dữ liệu về tăng trưởng người dùng Premium
              </div>
            )}
          </Card>
        </Col>

        {/* DONUT CHART */}
        <Col xs={24} md={8}>
          <Card className="chart-container" title="Nguồn người dùng đến nền tảng">
            {trafficSource.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficSource}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {trafficSource.map((_, index) => (
                      <Cell key={index} fill={trafficColors[index % trafficColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-5 text-muted">
                Chưa có dữ liệu về nguồn người dùng
              </div>
            )}
          </Card>
        </Col>

      </Row>
    </div>
  );
}
