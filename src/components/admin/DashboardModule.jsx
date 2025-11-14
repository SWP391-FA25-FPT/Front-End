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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
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

  // Tính % thay đổi (mock - cần dữ liệu thực từ backend)
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return "+0%";
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
  };

  // ===================== KPI THỐNG KÊ =====================
  const kpiData = stats
    ? [
        {
          title: "Người dùng Premium đang hoạt động",
          value: formatNumber(stats.subscriptions?.active || 0),
          change: "+12%", // Mock - cần tính từ dữ liệu thực
          icon: "mdi:diamond-stone",
          color: "#EAB308",
        },
        {
          title: "Người dùng mới (tháng này)",
          value: formatNumber(stats.users?.new || 0),
          change: "-8%", // Mock - cần tính từ dữ liệu thực
          icon: "mdi:account-plus-outline",
          color: "#22C55E",
        },
        {
          title: "Tổng lượt tìm kiếm",
          value: formatNumber(stats.analytics?.totalSearches || 0),
          change: "+22%", // Mock
          icon: "mdi:robot-outline",
          color: "#F97316",
        },
        {
          title: "Tổng doanh thu",
          value: formatCurrency(stats.subscriptions?.revenue || 0),
          change: "+14%", // Mock
          icon: "mdi:credit-card-outline",
          color: "#6366F1",
        },
      ]
    : [];

  // ===================== BIỂU ĐỒ BAR =====================
  // Mock data - cần API để lấy dữ liệu theo tháng
  const subscriptionData = [
    { month: "Th01", value: 120 },
    { month: "Th02", value: 160 },
    { month: "Th03", value: 200 },
    { month: "Th04", value: 180 },
    { month: "Th05", value: 240 },
    { month: "Th06", value: 260 },
    { month: "Th07", value: 310 },
    { month: "Th08", value: 380 },
    { month: "Th09", value: 420 },
    { month: "Th10", value: 460 },
    { month: "Th11", value: 510 },
    { month: "Th12", value: 580 },
  ];

  // ===================== BIỂU ĐỒ DONUT =====================
  // Lấy data từ API
  const trafficSource = stats?.users?.byKnowledgeSource || [];
  const trafficColors = ["#6366F1", "#22C55E", "#F97316", "#EAB308", "#EF4444"];

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spin size="large" tip="Đang tải dữ liệu..." />
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
          <Card className="chart-container" title="Tăng trưởng người dùng Premium">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscriptionData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
