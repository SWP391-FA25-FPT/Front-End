import React from "react";
import { Card, Statistic } from "antd";
import { Icon } from "@iconify/react";

const SidebarStats = ({ stats }) => {
  const statItems = [
    {
      title: "Tổng thực đơn",
      value: stats.totalMealPlans,
      icon: "mdi:food-outline",
      color: "#52c41a",
    },
    {
      title: "Tổng lượt xem",
      value: stats.totalViews,
      icon: "mdi:eye-outline",
      color: "#1890ff",
    },
    {
      title: "Tổng lượt thích",
      value: stats.totalLikes,
      icon: "mdi:heart-outline",
      color: "#ff4d4f",
    },
    {
      title: "Đánh giá TB",
      value: stats.averageRating,
      suffix: "/5",
      precision: 1,
      icon: "mdi:star-outline",
      color: "#faad14",
    },
  ];

  return (
    <Card className="sidebar-stats-card" title="📊 Thống kê tổng quan">
      <div className="sidebar-stats-grid">
        {statItems.map((item, index) => (
          <div key={index} className="sidebar-stat-item">
            <div
              className="sidebar-stat-icon"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <Icon
                icon={item.icon}
                style={{ color: item.color, fontSize: "24px" }}
              />
            </div>
            <div className="sidebar-stat-content">
              <div className="sidebar-stat-title">{item.title}</div>
              <div className="sidebar-stat-value" style={{ color: item.color }}>
                {item.precision
                  ? item.value.toFixed(item.precision)
                  : item.value.toLocaleString()}
                {item.suffix && (
                  <span className="stat-suffix">{item.suffix}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SidebarStats;
