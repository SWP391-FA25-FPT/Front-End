import React from "react";
import { Card, List, Progress, Tag } from "antd";
import { Icon } from "@iconify/react";

const GoalsSection = ({ goals }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "processing";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "in-progress":
        return "Đang thực hiện";
      case "pending":
        return "Chưa bắt đầu";
      default:
        return status;
    }
  };

  return (
    <Card className="goals-section-card" title="Mục tiêu của bạn">
      <List
        itemLayout="vertical"
        dataSource={goals}
        renderItem={(goal) => (
          <List.Item className="goal-item">
            <div className="goal-header">
              <div className="goal-title-wrapper">
                <Icon
                  icon={goal.icon}
                  style={{
                    fontSize: "24px",
                    color: goal.color,
                    marginRight: "12px",
                  }}
                />
                <div>
                  <h4>{goal.title}</h4>
                  <p className="goal-description">{goal.description}</p>
                </div>
              </div>
              <Tag color={getStatusColor(goal.status)}>
                {getStatusText(goal.status)}
              </Tag>
            </div>
            <Progress
              percent={goal.progress}
              strokeColor={goal.color}
              trailColor="#f0f0f0"
              strokeWidth={10}
              style={{ marginTop: "12px" }}
            />
            <div className="goal-stats">
              <span>
                {goal.current} / {goal.target} {goal.unit}
              </span>
              <span>{goal.daysLeft} ngày còn lại</span>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default GoalsSection;
