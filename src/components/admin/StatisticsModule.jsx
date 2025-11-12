import React from "react";
import { Card, Statistic, Progress, Tag } from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/StatisticsAdmin.css";

export default function StatisticsModule() {
  const stats = [
    {
      name: "Người dùng đang hoạt động",
      value: 247,
      change: "+12%",
      compare: "so với hôm qua",
      icon: "mdi:account-multiple",
      color: "#4f46e5",
      trendUp: true,
    },
    {
      name: "Công thức chờ duyệt",
      value: 18,
      change: "-3%",
      compare: "so với tuần trước",
      icon: "mdi:clipboard-text-search",
      color: "#f59e0b",
      trendUp: false,
    },
    {
      name: "Gói Premium đang dùng",
      value: 92,
      change: "+5%",
      compare: "so với hôm qua",
      icon: "mdi:crown-outline",
      color: "#eab308",
      trendUp: true,
    },
    {
      name: "Doanh thu hôm nay",
      value: "2.860.000đ",
      change: "+14%",
      compare: "so với hôm qua",
      icon: "mdi:cash",
      color: "#10b981",
      trendUp: true,
    },
  ];

  const lastUpdated = new Date().toLocaleString("vi-VN");

  return (
    <div className="admin-module-wrapper">
      {/* Header */}
      <div className="stats-header">
        <h2 className="page-title">Thống kê nhanh</h2>
        <span className="stats-update">Cập nhật lần cuối: {lastUpdated}</span>
      </div>
      {/* KPI Grid */}
      <div className="statistics-grid">
        {stats.map((item, index) => (
          <Card key={index} bordered={false} className="statistics-card kpi-card">

            <div className="kpi-header">
              <div className="statistics-icon" style={{ backgroundColor: item.color + "15" }}>
                <Icon icon={item.icon} width="28" height="28" color={item.color} />
              </div>

              <Tag color={item.trendUp ? "green" : "red"} className="trend-tag">
                {item.trendUp ? "▲" : "▼"} {item.change}
              </Tag>
            </div>


            <Statistic
              title={item.name}
              value={item.value}
              valueStyle={{ color: item.color, fontWeight: 700, fontSize: 22 }}
            />

            <p className="kpi-compare">{item.compare}</p>

          </Card>
        ))}
      </div>

      {/* Daily Goal Section */}
      <Card className="daily-goal-card">
        <div className="daily-goal-header">
          <h3>Mục tiêu doanh thu hôm nay</h3>
          <span>Hoàn thành 82%</span>
        </div>

        <Statistic
          value="2.860.000đ / 3.500.000đ"
          valueStyle={{ fontSize: 20, fontWeight: 600 }}
        />

        <Progress
          percent={82}
          strokeColor="#10b981"
          trailColor="#e6f7f1"
          showInfo={false}
        />
      </Card>

    </div>
  );
}
