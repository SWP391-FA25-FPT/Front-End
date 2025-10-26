import React from "react";
import { Card, Button, Row, Col } from "antd";
import { Icon } from "@iconify/react";

const WaterIntake = ({ waterData, onAddWater, onRemoveWater }) => {
  const totalGlasses = 8;
  const currentGlasses = waterData.current;
  const percentage = Math.round((currentGlasses / totalGlasses) * 100);

  return (
    <Card className="water-intake-card" title="Lượng nước uống">
      <div className="water-progress">
        <div className="water-icon-container">
          <Icon
            icon="mdi:cup-water"
            style={{ fontSize: "48px", color: "#1890ff" }}
          />
          <div className="water-percentage">{percentage}%</div>
        </div>

        <div className="water-info">
          <h3>
            {currentGlasses * 250}ml / {totalGlasses * 250}ml
          </h3>
          <p>
            {currentGlasses} / {totalGlasses} cốc
          </p>
        </div>
      </div>

      <div className="water-glasses">
        {[...Array(totalGlasses)].map((_, index) => (
          <div
            key={index}
            className={`water-glass ${index < currentGlasses ? "filled" : ""}`}
          >
            <Icon
              icon={index < currentGlasses ? "mdi:cup" : "mdi:cup-outline"}
              style={{
                fontSize: "32px",
                color: index < currentGlasses ? "#1890ff" : "#d9d9d9",
              }}
            />
          </div>
        ))}
      </div>

      <Row gutter={16} style={{ marginTop: "16px" }}>
        <Col span={12}>
          <Button
            type="primary"
            block
            size="large"
            icon={<Icon icon="mdi:plus" />}
            onClick={onAddWater}
            disabled={currentGlasses >= totalGlasses}
            style={{
              background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
              border: "none",
            }}
          >
            Thêm cốc
          </Button>
        </Col>
        <Col span={12}>
          <Button
            block
            size="large"
            icon={<Icon icon="mdi:minus" />}
            onClick={onRemoveWater}
            disabled={currentGlasses <= 0}
          >
            Bớt cốc
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default WaterIntake;
