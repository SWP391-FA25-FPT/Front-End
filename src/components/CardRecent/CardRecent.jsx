import React from "react";
import { Card, ConfigProvider, Avatar } from "antd";
import blank4x3 from "../../assets/blank4x3.png";
import guest from "../../assets/guest.png";

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
              src={src || blank4x3}
              alt={title}
              onError={(e) => {
                e.target.src = blank4x3;
              }}
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
            <Avatar src={avatar || guest} size="small" style={{ marginRight: "8px" }} />
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


