import React from "react";
import { Button, Space, Dropdown } from "antd";
import { Icon } from "@iconify/react";

const PageHeader = ({ 
  onAddRecord, 
  onViewHistory, 
  onCreateGoal, 
  onPauseGoal,
  onCancelGoal,
  hasActiveGoal,
  goalStatus 
}) => {
  const goalMenuItems = [
    {
      key: 'pause',
      label: (
        <span>
          <Icon icon="mdi:pause-circle" style={{ marginRight: "8px", fontSize: "16px" }} />
          {goalStatus === 'paused' ? 'Tiếp tục mục tiêu' : 'Tạm dừng mục tiêu'}
        </span>
      ),
      onClick: onPauseGoal
    },
    {
      type: 'divider'
    },
    {
      key: 'cancel',
      label: (
        <span style={{ color: '#ff4d4f' }}>
          <Icon icon="mdi:close-circle" style={{ marginRight: "8px", fontSize: "16px" }} />
          Hủy mục tiêu
        </span>
      ),
      onClick: onCancelGoal,
      danger: true
    }
  ];

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
          {!hasActiveGoal ? (
            <Button
              size="large"
              icon={<Icon icon="mdi:target" style={{ fontSize: "20px" }} />}
              onClick={onCreateGoal}
              style={{
                background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                border: "none",
                color: "#fff",
                fontWeight: "500"
              }}
            >
              Tạo mục tiêu
            </Button>
          ) : (
            <Dropdown
              menu={{ items: goalMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                size="large"
                icon={<Icon icon="mdi:cog" style={{ fontSize: "20px" }} />}
                style={{
                  borderColor: goalStatus === 'paused' ? '#faad14' : '#d9d9d9'
                }}
              >
                Quản lý mục tiêu
              </Button>
            </Dropdown>
          )}
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
