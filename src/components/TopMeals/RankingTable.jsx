import React from "react";
import { Card, Avatar, Space } from "antd";
import { Icon } from "@iconify/react";

const RankingTable = ({ mealPlans }) => {
  const getRankBadge = (rank) => {
    const badges = {
      1: { icon: "🥇", color: "#FFD700" },
      2: { icon: "🥈", color: "#C0C0C0" },
      3: { icon: "🥉", color: "#CD7F32" },
    };
    return badges[rank] || { icon: `#${rank}`, color: "#8c8c8c" };
  };

  const topMealPlans = mealPlans.slice(0, 8);

  return (
    <Card className="ranking-table-card" title="🏆 Bảng xếp hạng">
      <div className="ranking-list">
        {topMealPlans.map((mealPlan, index) => {
          const rank = index + 1;
          const badge = getRankBadge(rank);

          return (
            <div key={mealPlan.id} className="ranking-item">
              <div className="ranking-rank">
                <span
                  style={{
                    color: badge.color,
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {badge.icon}
                </span>
              </div>

              <Avatar
                src={mealPlan.image}
                size={48}
                shape="square"
                className="ranking-avatar"
              />

              <div className="ranking-info">
                <div className="ranking-name">{mealPlan.name}</div>
                <Space size={12} className="ranking-stats">
                  <span className="ranking-stat">
                    <Icon
                      icon="mdi:eye"
                      style={{ fontSize: "14px", color: "#1890ff" }}
                    />
                    {mealPlan.views.toLocaleString()}
                  </span>
                  <span className="ranking-stat">
                    <Icon
                      icon="mdi:heart"
                      style={{ fontSize: "14px", color: "#ff4d4f" }}
                    />
                    {mealPlan.likes.toLocaleString()}
                  </span>
                  <span className="ranking-stat">
                    <Icon
                      icon="mdi:star"
                      style={{ fontSize: "14px", color: "#faad14" }}
                    />
                    {mealPlan.rating.toFixed(1)}
                  </span>
                </Space>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RankingTable;
