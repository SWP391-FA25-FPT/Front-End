import React from "react";
import { Card, Alert } from "antd";
import { Icon } from "@iconify/react";

const WinnerPrize = ({ challenge, user }) => {
  if (!challenge || !user) return null;

  const userId = user._id?.toString();
  const winnerEntryId = challenge.winnerEntryId?.toString();
  
  // Check if current user is the winner
  let isWinner = false;
  if (winnerEntryId && challenge.entries) {
    const winnerEntry = challenge.entries.find(
      (entry) => entry._id?.toString() === winnerEntryId
    );
    if (winnerEntry) {
      const winnerUserId = typeof winnerEntry.userId === 'object' 
        ? winnerEntry.userId?._id?.toString() || winnerEntry.userId?._id
        : winnerEntry.userId?.toString();
      isWinner = winnerUserId === userId;
    }
  }

  if (!isWinner || !challenge.prizes || challenge.prizes.length === 0) {
    return null;
  }

  return (
    <Card className="detail-prizes-card" bordered={false} style={{ marginBottom: 24 }}>
      <Alert
        message={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon icon="mdi:trophy" style={{ fontSize: "24px", color: "#faad14" }} />
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
              Chúc mừng! Bạn đã thắng giải thử thách
            </span>
          </div>
        }
        description={
          <div style={{ marginTop: 12 }}>
            <p style={{ marginBottom: 16, fontSize: "16px" }}>
              Bạn đã được trao giải trong thử thách <strong>{challenge.title}</strong>
            </p>
            <div style={{ marginTop: 16 }}>
              <h4 style={{ marginBottom: 12 }}>Giải thưởng của bạn:</h4>
              {challenge.prizes.map((prize, index) => (
                <div
                  key={index}
                  style={{
                    padding: "12px",
                    marginBottom: "8px",
                    backgroundColor: "#fff7e6",
                    borderRadius: "4px",
                    border: "1px solid #ffd591",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Icon icon="mdi:trophy" style={{ fontSize: "20px", color: "#faad14" }} />
                    <strong>{prize.title || `Giải ${index + 1}`}</strong>
                  </div>
                  {prize.description && (
                    <p style={{ margin: "4px 0 0 28px", color: "#666" }}>
                      {prize.description}
                    </p>
                  )}
                </div>
              ))}
              {challenge.prizeDetails?.note && (
                <div style={{ marginTop: 12, padding: "8px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                  <strong>Ghi chú:</strong> {challenge.prizeDetails.note}
                </div>
              )}
            </div>
          </div>
        }
        type="success"
        showIcon={false}
        style={{ backgroundColor: "#f6ffed", border: "2px solid #b7eb8f" }}
      />
    </Card>
  );
};

export default WinnerPrize;

