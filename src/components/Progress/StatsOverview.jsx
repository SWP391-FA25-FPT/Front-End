import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { Icon } from "@iconify/react";

const StatsOverview = ({ stats }) => {
  const statItems = [
    {
      title: "Cân nặng hiện tại",
      value: stats.currentWeight,
      suffix: "kg",
      icon: "mdi:weight",
      color: "#F8B602",
      prefix: null,
    },
    {
      title: "Mục tiêu",
      value: stats.targetWeight,
      suffix: "kg",
      icon: "mdi:flag-checkered",
      color: "#5f4ba2",
      prefix: null,
    },
    {
      title: "Đã giảm/tăng",
      value: Math.abs(stats.weightChange),
      suffix: "kg",
      icon: stats.weightChange < 0 ? "mdi:arrow-down" : "mdi:arrow-up",
      color: stats.weightChange < 0 ? "#52c41a" : "#ff4d4f",
      prefix: stats.weightChange < 0 ? "-" : "+",
    },
    {
      title: "Streak hiện tại",
      value: stats.currentStreak,
      suffix: "ngày",
      icon: "mdi:fire",
      color: "#ff7a45",
      prefix: null,
    },
  ];

  return (
    <Row gutter={[16, 16]} className="stats-overview">
      {statItems.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card className="stat-card" hoverable>
            <div
              className="stat-icon"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <Icon
                icon={item.icon}
                style={{ color: item.color, fontSize: "32px" }}
              />
            </div>
            <Statistic
              title={item.title}
              value={item.value}
              suffix={item.suffix}
              prefix={item.prefix}
              valueStyle={{ color: item.color, fontWeight: "bold" }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsOverview;
