import React from "react";
import "../../pages/style/DashboardAdmin.css";
import { Card, Row, Col } from "antd";
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

export default function DashboardModule() {
  // ===================== KPI THỐNG KÊ =====================
  const kpiData = [
    {
      title: "Người dùng Premium đang hoạt động",
      value: "247",
      change: "+12%",
      icon: "mdi:diamond-stone",
      color: "#EAB308",
    },
    {
      title: "Người dùng mới (tháng này)",
      value: "1,630",
      change: "-8%",
      icon: "mdi:account-plus-outline",
      color: "#22C55E",
    },
    {
      title: "Lượt sử dụng AI tư vấn",
      value: "12,580",
      change: "+22%",
      icon: "mdi:robot-outline",
      color: "#F97316",
    },
    {
      title: "Doanh thu trong tháng",
      value: "15,245,000đ",
      change: "+14%",
      icon: "mdi:credit-card-outline",
      color: "#6366F1",
    },
  ];

  // ===================== BIỂU ĐỒ BAR =====================
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
  const trafficSource = [
    { name: "Mạng xã hội (TikTok, Facebook)", value: 63 },
    { name: "Tìm kiếm Google", value: 22 },
    { name: "Link chia sẻ / Referral", value: 15 },
  ];
  const trafficColors = ["#6366F1", "#22C55E", "#F97316"];

  return (
    <div className="admin-dashboard-wrapper">

      {/* ====== KPIs ====== */}
      <Row gutter={[24, 24]}>
        {kpiData.map((item, index) => (
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
        ))}
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
                    <Cell key={index} fill={trafficColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

      </Row>
    </div>
  );
}
