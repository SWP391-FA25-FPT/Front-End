import React from "react";
import { Card, Progress, Row, Col } from "antd";
import { Icon } from "@iconify/react";

const DailyProgress = ({ dailyData }) => {
  const progressItems = [
    {
      title: "Calories",
      current: dailyData.calories.current,
      target: dailyData.calories.target,
      icon: "mdi:fire",
      color: "#ff7a45",
      unit: "kcal",
    },
    {
      title: "Protein",
      current: dailyData.protein.current,
      target: dailyData.protein.target,
      icon: "mdi:food-drumstick",
      color: "#eb2f96",
      unit: "g",
    },
    {
      title: "Carbs",
      current: dailyData.carbs.current,
      target: dailyData.carbs.target,
      icon: "mdi:bread-slice",
      color: "#faad14",
      unit: "g",
    },
    {
      title: "Chất béo",
      current: dailyData.fat.current,
      target: dailyData.fat.target,
      icon: "mdi:butter",
      color: "#fadb14",
      unit: "g",
    },
  ];

  return (
    <Card className="daily-progress-card" title="Tiến độ hôm nay">
      <Row gutter={[16, 24]}>
        {progressItems.map((item, index) => {
          const percent = Math.round((item.current / item.target) * 100);
          return (
            <Col xs={24} sm={12} key={index}>
              <div className="progress-item">
                <div className="progress-header">
                  <div className="progress-icon-wrapper">
                    <Icon
                      icon={item.icon}
                      style={{ fontSize: "24px", color: item.color }}
                    />
                    <span className="progress-title">{item.title}</span>
                  </div>
                  <span className="progress-value">
                    {item.current}/{item.target} {item.unit}
                  </span>
                </div>
                <Progress
                  percent={percent}
                  strokeColor={{
                    "0%": item.color,
                    "100%": item.color,
                  }}
                  trailColor="#f0f0f0"
                  size={[undefined, 12]}
                  showInfo={false}
                />
                <div className="progress-percent">{percent}%</div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default DailyProgress;
