import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { Icon } from "@iconify/react";

const DetailHeader = ({ participants, dishes, timeLeft, duration, status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "ongoing":
        return {
          text: "Đang diễn ra",
          color: "#52c41a",
          icon: "mdi:play-circle",
        };
      case "upcoming":
        return {
          text: "Sắp diễn ra",
          color: "#1890ff",
          icon: "mdi:clock-outline",
        };
      case "ended":
        return {
          text: "Đã kết thúc",
          color: "#8c8c8c",
          icon: "mdi:check-circle",
        };
      default:
        return {
          text: "Đang diễn ra",
          color: "#52c41a",
          icon: "mdi:play-circle",
        };
    }
  };

  const statusConfig = getStatusConfig();

  const stats = [
    {
      title: "Người tham gia",
      value: participants,
      icon: "mdi:account-group",
      color: "#1890ff",
    },
    // Only show "Món đã đăng" if dishes is provided (admin only)
    ...(dishes !== undefined ? [{
      title: "Món đã đăng",
      value: dishes,
      icon: "mdi:food",
      color: "#52c41a",
    }] : []),
    {
      title: "Thời gian còn lại",
      value: timeLeft,
      icon: "mdi:timer-sand",
      color: "#fa8c16",
      suffix: "",
    },
    {
      title: "Trạng thái",
      value: statusConfig.text,
      icon: statusConfig.icon,
      color: statusConfig.color,
      suffix: "",
    },
  ];

  return (
    <div className="detail-header">
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={12} sm={12} md={6} key={index}>
            <Card className="detail-stat-card" bordered={false}>
              <div
                className="detail-stat-icon"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon
                  icon={stat.icon}
                  style={{ color: stat.color, fontSize: "32px" }}
                />
              </div>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{
                  color: stat.color,
                  fontWeight: "600",
                  fontSize: "20px",
                }}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <div className="detail-duration">
        <Icon icon="mdi:calendar-range" style={{ fontSize: "20px" }} />
        <span>Thời gian diễn ra: {duration}</span>
      </div>
    </div>
  );
};

export default DetailHeader;
