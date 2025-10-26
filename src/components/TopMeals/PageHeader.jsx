import React from "react";
import { Icon } from "@iconify/react";

const PageHeader = () => {
  return (
    <div className="top-meals-page-header">
      <div className="header-content">
        <div className="header-icon-wrapper">
          <Icon
            icon="mdi:crown"
            style={{ fontSize: "48px", color: "#FFD700" }}
          />
        </div>
        <div className="header-text">
          <h1 className="header-title">Top Thực Đơn Xem Nhiều Nhất</h1>
          <p className="header-subtitle">
            Khám phá những thực đơn được cộng đồng yêu thích nhất
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
