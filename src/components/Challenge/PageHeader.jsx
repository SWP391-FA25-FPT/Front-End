import React from "react";
import { Icon } from "@iconify/react";

const PageHeader = () => {
  return (
    <div className="challenge-page-header">
      <div className="header-content">
        <div className="header-icon-wrapper">
          <Icon
            icon="mdi:trophy"
            style={{ fontSize: "48px", color: "#FFD700" }}
          />
        </div>
        <div className="header-text">
          <h1 className="header-title">Thử Thách Nấu Ăn</h1>
          <p className="header-subtitle">
            Tham gia thử thách và thể hiện tài năng nấu nướng của bạn
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
