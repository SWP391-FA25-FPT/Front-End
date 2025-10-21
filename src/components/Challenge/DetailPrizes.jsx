import React from "react";
import { Card } from "antd";
import { Icon } from "@iconify/react";

const DetailPrizes = ({ prizes, prizeDetails }) => {
  return (
    <Card className="detail-prizes-card" bordered={false}>
      <h2 className="detail-section-title">
        <Icon icon="mdi:trophy" style={{ marginRight: "8px" }} />
        Giải thưởng
      </h2>

      <div className="prizes-content">
        <h3 className="prizes-intro">
          Thử thách lần này sẽ có {prizes.length} giải thưởng hấp dẫn:
        </h3>

        <div className="prizes-list">
          {prizes.map((prize, index) => (
            <div key={index} className="prize-item">
              <div className="prize-rank">
                <Icon icon="mdi:trophy" style={{ fontSize: "32px" }} />
                <span>Giải {index + 1}</span>
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
