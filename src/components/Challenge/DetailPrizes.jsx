import React from "react";
import { Card } from "antd";
import { Icon } from "@iconify/react";

const DetailPrizes = ({ prizes, prizeDetails }) => {
  // Define rank labels and colors
  const rankInfo = [
    { label: "Giải Nhất", color: "#FFD700", icon: "mdi:trophy" }, // Gold
    { label: "Giải Nhì", color: "#C0C0C0", icon: "mdi:trophy-variant" }, // Silver
    { label: "Giải Ba", color: "#CD7F32", icon: "mdi:trophy-outline" }, // Bronze
  ];

  // Filter out prizes with empty descriptions
  const activePrizes = prizes.filter(prize => 
    prize.description && prize.description.trim() !== ""
  );

  const prizeCountText = activePrizes.length === 1 
    ? "1 giải thưởng hấp dẫn" 
    : `${activePrizes.length} giải thưởng hấp dẫn`;

  return (
    <Card className="detail-prizes-card" bordered={false}>
      <h2 className="detail-section-title">
        <Icon icon="mdi:trophy" style={{ marginRight: "8px" }} />
        Giải thưởng
      </h2>

      <div className="prizes-content">
        <h3 className="prizes-intro">
          Thử thách lần này sẽ có {prizeCountText}:
        </h3>

        <div className="prizes-list">
          {activePrizes.slice(0, 3).map((prize, index) => (
            <div key={index} className="prize-item">
              <div className="prize-rank">
                <Icon 
                  icon={rankInfo[index]?.icon || "mdi:trophy"} 
                  style={{ 
                    fontSize: "32px",
                    color: rankInfo[index]?.color || "#F8B602"
                  }} 
                />
                <span style={{ color: rankInfo[index]?.color }}>
                  {rankInfo[index]?.label || prize.title}
                </span>
              </div>
              <div className="prize-description">
                <h4>{prize.title}</h4>
                <p>{prize.description}</p>
              </div>
            </div>
          ))}
        </div>

        {prizeDetails && (
          <div className="prize-details">
            {prizeDetails.note && (
              <p className="prize-note">
                <Icon
                  icon="mdi:information"
                  style={{ marginRight: "8px", fontSize: "16px" }}
                />
                {prizeDetails.note}
              </p>
            )}
            {prizeDetails.items && (
              <div className="prize-items">
                <Icon
                  icon="mdi:gift"
                  style={{ marginRight: "8px", fontSize: "20px" }}
                />
                <span>{prizeDetails.items}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DetailPrizes;
