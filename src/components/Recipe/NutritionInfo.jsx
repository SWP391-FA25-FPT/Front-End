import React from "react";
import { Typography, Card, Row, Col, Statistic } from "antd";
import { Icon } from "@iconify/react";
import "./Recipe.css";

const { Title } = Typography;

const NutritionInfo = ({ nutrition }) => {
  if (!nutrition || Object.keys(nutrition).length === 0) {
    return null;
  }

  const nutritionItems = [
    { key: "calories", label: "Calories", unit: "kcal", icon: "mdi:fire", color: "#ff4d4f" },
    { key: "protein", label: "Protein", unit: "g", icon: "mdi:food-drumstick", color: "#ff7a45" },
    { key: "carbs", label: "Carbs", unit: "g", icon: "mdi:bread-slice", color: "#ffa940" },
    { key: "fat", label: "Fat", unit: "g", icon: "mdi:oil", color: "#ffc53d" },
    { key: "fiber", label: "Fiber", unit: "g", icon: "mdi:barley", color: "#52c41a" },
    { key: "sugar", label: "Sugar", unit: "g", icon: "mdi:candy", color: "#eb2f96" },
  ];

  const availableItems = nutritionItems.filter(item => 
    nutrition[item.key] !== undefined && nutrition[item.key] !== null
  );

  if (availableItems.length === 0) {
    return null;
  }

  return (
    <Card 
      className="nutrition-card"
      style={{ marginBottom: "24px" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon icon="mdi:nutrition" width="24" height="24" color="#722ed1" />
          <Title level={4} style={{ margin: 0 }}>Thông tin dinh dưỡng</Title>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        {availableItems.map((item) => (
          <Col xs={12} sm={8} md={4} key={item.key}>
            <Statistic
              title={item.label}
              value={nutrition[item.key]}
              suffix={item.unit}
              prefix={<Icon icon={item.icon} color={item.color} width="20" />}
              valueStyle={{ fontSize: "18px" }}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default NutritionInfo;

