import React from "react";
import { Card, List, Progress, Tag, Button, Empty } from "antd";
import { Icon } from "@iconify/react";

const GoalsSection = ({ goals, onCreateGoal, loading = false }) => {
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

  const getGoalTypeIcon = (goalType) => {
    switch (goalType) {
      case "weight_loss":
        return "mdi:arrow-down-bold";
      case "weight_gain":
        return "mdi:arrow-up-bold";
      case "maintain":
        return "mdi:target";
      default:
        return "mdi:target";
    }
  };

  const getGoalTypeColor = (goalType) => {
    switch (goalType) {
      case "weight_loss":
        return "#52c41a";
      case "weight_gain":
        return "#f5222d";
      case "maintain":
        return "#1890ff";
      default:
        return "#F8B602";
    }
  };

  const getGoalTypeText = (goalType) => {
    switch (goalType) {
      case "weight_loss":
        return "Giảm cân";
      case "weight_gain":
        return "Tăng cân";
      case "maintain":
        return "Duy trì";
      default:
        return goalType;
    }
  };

  if (!goals || goals.length === 0) {
    return (
      <Card 
        className="goals-section-card" 
        title="Mục tiêu của bạn"
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có mục tiêu nào"
        >
          <Button 
            type="primary"
            icon={<Icon icon="mdi:plus" />}
            onClick={onCreateGoal}
            loading={loading}
            style={{
              background: "linear-gradient(135deg, #F8B602 0%, #e19a28 100%)",
              border: "none",
            }}
          >
            Tạo mục tiêu mới
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card 
      className="goals-section-card" 
      title="Mục tiêu của bạn"
      extra={
        <Button
          type="link"
          icon={<Icon icon="mdi:plus" />}
          onClick={onCreateGoal}
          loading={loading}
        >
          Tạo mới
        </Button>
      }
    >
      <List
        itemLayout="vertical"
        dataSource={goals}
        renderItem={(goal) => (
          <List.Item className="goal-item">
            <div className="goal-header">
              <div className="goal-title-wrapper">
                <Icon
                  icon={goal.icon || getGoalTypeIcon(goal.goalType)}
                  style={{
                    fontSize: "24px",
                    color: goal.color || getGoalTypeColor(goal.goalType),
                    marginRight: "12px",
                  }}
                />
                <div>
                  <h4>{goal.title || getGoalTypeText(goal.goalType)}</h4>
                  <p className="goal-description">
                    {goal.description || `${goal.startWeight}kg → ${goal.targetWeight}kg`}
                  </p>
                </div>
              </div>
              <Tag color={getStatusColor(goal.status)}>
                {getStatusText(goal.status)}
              </Tag>
            </div>
            <Progress
              percent={goal.progress !== undefined 
                ? goal.progress 
                : Math.min(100, Math.round((Math.abs(goal.currentWeight - goal.startWeight) / Math.abs(goal.targetWeight - goal.startWeight)) * 100))
              }
              strokeColor={goal.color || getGoalTypeColor(goal.goalType)}
              trailColor="#f0f0f0"
              size={[undefined, 10]}
              style={{ marginTop: "12px" }}
            />
            <div className="goal-stats">
              <span>
                {goal.current !== undefined ? goal.current : Math.abs(goal.currentWeight - goal.startWeight).toFixed(1)} / {goal.target !== undefined ? goal.target : Math.abs(goal.targetWeight - goal.startWeight).toFixed(1)} {goal.unit || 'kg'}
              </span>
              <span>
                {goal.daysLeft !== undefined 
                  ? `${goal.daysLeft} ngày còn lại`
                  : `${Math.max(0, Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} ngày còn lại`
                }
              </span>
            </div>
            {goal.targetCaloriesPerDay && (
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                <Icon icon="mdi:fire" style={{ marginRight: "4px" }} />
                Mục tiêu: {goal.targetCaloriesPerDay} calories/ngày
              </div>
            )}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default GoalsSection;
