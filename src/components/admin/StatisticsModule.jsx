import React from "react";
import { Card, Statistic } from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/StatisticsAdmin.css";

export default function StatisticsModule() {
  const stats = [
    {
      name: "Người dùng đang hoạt động",
      value: 247,
      icon: "mdi:account-multiple",
      color: "#4f46e5",
    },
    {
      name: "Công thức chờ duyệt",
      value: 18,
      icon: "mdi:clipboard-text-search",
      color: "#f59e0b",
    },
    {
      name: "Gói Premium đang dùng",
      value: 92,
      icon: "mdi:crown-outline",
      color: "#eab308",
    },
    {
      name: "Doanh thu hôm nay",
      value: "2.860.000đ",
      icon: "mdi:cash",
      color: "#10b981",
    },
  ];

  return (
    <div className="admin-module-wrapper">
      <h2 className="page-title">📊 Thống kê nhanh</h2>

      <div className="statistics-grid">
        {stats.map((item, index) => (
          <Card key={index} bordered={false} className="statistics-card kpi-card">
            <div className="statistics-icon" style={{ backgroundColor: item.color + "15" }}>
              <Icon icon={item.icon} width="28" height="28" color={item.color} />
            </div>

            <Statistic
              title={item.name}
              value={item.value}
              valueStyle={{ color: item.color, fontWeight: 700, fontSize: 22 }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
