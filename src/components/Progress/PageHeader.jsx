import React from "react";
import { Button, Space } from "antd";
import { Icon } from "@iconify/react";

const PageHeader = ({ onAddRecord, onViewHistory }) => {
  return (
    <div className="progress-page-header">
      <div className="header-content">
        <div className="header-text">
          <h1 className="header-title">Theo Dõi Tiến Độ</h1>
          <p className="header-subtitle">
            Theo dõi và quản lý hành trình sức khỏe của bạn
          </p>
        </div>
        <Space size="middle">
          <Button
            size="large"
            icon={<Icon icon="mdi:history" style={{ fontSize: "20px" }} />}
            onClick={onViewHistory}
          >
            Lịch sử
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<Icon icon="mdi:plus" style={{ fontSize: "20px" }} />}
            onClick={onAddRecord}
            style={{
              background: "linear-gradient(135deg, #F8B602 0%, #e19a28 100%)",
              border: "none",
            }}
          >
            Thêm bản ghi
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default PageHeader;
