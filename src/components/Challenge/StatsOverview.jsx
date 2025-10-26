import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { Icon } from "@iconify/react";

const StatsOverview = ({ stats }) => {
  const statItems = [
    {
      title: "Thử thách đang diễn ra",
      value: stats.ongoingChallenges,
      icon: "mdi:trophy",
      color: "#F8B602",
    },
    {
      title: "Tổng người tham gia",
      value: stats.totalParticipants,
      icon: "mdi:account-group",
      color: "#1890ff",
    },
    {
      title: "Tổng bài dự thi",
      value: stats.totalEntries,
      icon: "mdi:file-document-multiple",
      color: "#52c41a",
    },
    {
      title: "Giải thưởng đã trao",
      value: stats.prizesAwarded,
      icon: "mdi:gift",
      color: "#eb2f96",
    },
  ];

  return (
    <Row gutter={[16, 16]} className="challenge-stats-overview">
      {statItems.map((item, index) => (
        <Col xs={12} sm={12} md={6} key={index}>
          <Card className="stat-card" bordered={false}>
            <div
              className="stat-icon"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <Icon
                icon={item.icon}
                style={{ color: item.color, fontSize: "28px" }}
              />
            </div>
            <Statistic
              title={item.title}
              value={item.value}
              valueStyle={{
                color: item.color,
                fontWeight: "600",
                fontSize: "24px",
              }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsOverview;
