import React from "react";
import { Card, ConfigProvider, Avatar } from "antd";

const Index = ({ title, src, avatar, userName, subtitle }) => {
  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              bodyPadding: 12,
            },
          },
        }}
      >
        <Card
          hoverable
          cover={
            <img
              src={src}
              alt={title}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          }
          style={{ borderRadius: "8px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar src={avatar} size="small" style={{ marginRight: "8px" }} />
            <span style={{ fontSize: "14px", color: "#666" }}>{userName}</span>
          </div>
          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>{subtitle}</div>
          </div>
        </Card>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default Index;


