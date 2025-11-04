import React from "react";
import { Typography, List, Card } from "antd";
import { Icon } from "@iconify/react";
import "./Recipe.css";

const { Title, Text } = Typography;

const TipsSection = ({ tips }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <Card 
      className="tips-card"
      style={{ marginBottom: "24px" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon icon="mdi:lightbulb-on" width="24" height="24" color="#faad14" />
          <Title level={4} style={{ margin: 0 }}>Mẹo nấu ăn</Title>
        </div>
      }
    >
      <List
        dataSource={tips}
        renderItem={(tip, index) => (
          <List.Item 
            key={index}
            style={{ 
              padding: "12px 0",
              borderBottom: index < tips.length - 1 ? "1px solid #f0f0f0" : "none",
              alignItems: "flex-start"
            }}
          >
            <div style={{ display: "flex", gap: "12px", width: "100%" }}>
              <Icon 
                icon="mdi:check-circle" 
                width="20" 
                height="20" 
                color="#52c41a"
                style={{ marginTop: "2px", flexShrink: 0 }}
              />
              <Text style={{ fontSize: "15px", flex: 1 }}>{tip}</Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TipsSection;

