import React from "react";
import { Card, Tag, Avatar, Space, Tooltip } from "antd";
import { Icon } from "@iconify/react";
import blank4x3 from "../../assets/blank4x3.png";
import guest from "../../assets/guest.png";

const MealPlanListCard = ({ mealPlan, rank }) => {
  const getRankBadge = (rank) => {
    const badges = {
      1: { icon: "🥇", color: "#FFD700", label: "Hạng 1" },
      2: { icon: "🥈", color: "#C0C0C0", label: "Hạng 2" },
      3: { icon: "🥉", color: "#CD7F32", label: "Hạng 3" },
    };
    return (
      badges[rank] || {
        icon: `#${rank}`,
        color: "#8c8c8c",
        label: `Hạng ${rank}`,
      }
    );
  };

  const badge = getRankBadge(rank);

  // Format date safely
  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date;
    if (date.$date) {
      return new Date(date.$date).toLocaleDateString("vi-VN");
    }
    if (date instanceof Date) {
      return date.toLocaleDateString("vi-VN");
    }
    return String(date);
  };

  // Safe number formatting
  const safeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    return Number(value) || defaultValue;
  };

  return (
    <Card className="meal-plan-list-card" hoverable>
      <div className="list-card-content">
        {/* Rank Badge */}
        <div
          className="list-rank-badge"
          style={{
            backgroundColor: `${badge.color}20`,
            borderColor: badge.color,
          }}
        >
          <span
            style={{
              color: badge.color,
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {badge.icon}
          </span>
        </div>

        {/* Image */}
        <div className="list-card-image-wrapper">
          <img
            src={mealPlan.image || blank4x3}
            alt={mealPlan.name}
            className="list-card-image"
            onError={(e) => {
              e.target.src = blank4x3;
            }}
          />
          {mealPlan.isPremium && (
            <div className="list-premium-badge">
              <Icon icon="mdi:crown" style={{ fontSize: "14px" }} />
              <span>Premium</span>
            </div>
          )}
        </div>

        {/* Main Info */}
        <div className="list-card-main">
          <div className="list-card-header-section">
            <h3 className="list-card-title">{mealPlan.name}</h3>
            <p className="list-card-description">{mealPlan.description}</p>
          </div>

          {/* Stats and Nutrition */}
          <div className="list-card-details">
            <div className="list-card-stats-section">
              <Space size={20}>
                <Tooltip title="Lượt xem">
                  <div className="list-stat-item">
                    <Icon
                      icon="mdi:eye"
                      style={{ fontSize: "18px", color: "#1890ff" }}
                    />
                    <span>{safeNumber(mealPlan.views).toLocaleString()}</span>
                  </div>
                </Tooltip>
                <Tooltip title="Lượt thích">
                  <div className="list-stat-item">
                    <Icon
                      icon="mdi:heart"
                      style={{ fontSize: "18px", color: "#ff4d4f" }}
                    />
                    <span>{safeNumber(mealPlan.likes).toLocaleString()}</span>
                  </div>
                </Tooltip>
                <Tooltip title="Đánh giá">
                  <div className="list-stat-item">
                    <Icon
                      icon="mdi:star"
                      style={{ fontSize: "18px", color: "#faad14" }}
                    />
                    <span>{safeNumber(mealPlan.rating).toFixed(1)}</span>
                  </div>
                </Tooltip>
              </Space>
            </div>

            {mealPlan.nutrition && (
              <div className="list-card-nutrition-section">
                {mealPlan.nutrition.calories && (
                  <div className="list-nutrition-item">
                    <Icon
                      icon="mdi:fire"
                      style={{ fontSize: "16px", color: "#ff7a45" }}
                    />
                    <span>{safeNumber(mealPlan.nutrition.calories)} kcal</span>
                  </div>
                )}
                {mealPlan.nutrition.protein && (
                  <div className="list-nutrition-item">
                    <Icon
                      icon="mdi:food-drumstick"
                      style={{ fontSize: "16px", color: "#eb2f96" }}
                    />
                    <span>
                      {safeNumber(mealPlan.nutrition.protein)}g protein
                    </span>
                  </div>
                )}
                {mealPlan.nutrition.carbs && (
                  <div className="list-nutrition-item">
                    <Icon
                      icon="mdi:bread-slice"
                      style={{ fontSize: "16px", color: "#faad14" }}
                    />
                    <span>{safeNumber(mealPlan.nutrition.carbs)}g carbs</span>
                  </div>
                )}
                {mealPlan.nutrition.fat && (
                  <div className="list-nutrition-item">
                    <Icon
                      icon="mdi:butter"
                      style={{ fontSize: "16px", color: "#fadb14" }}
                    />
                    <span>{safeNumber(mealPlan.nutrition.fat)}g fat</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tags and Author */}
          <div className="list-card-footer">
            {mealPlan.tags && mealPlan.tags.length > 0 && (
              <div className="list-card-tags">
                {mealPlan.tags.map((tag, index) => (
                  <Tag key={index} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}

            <div className="list-card-author">
              <Avatar src={mealPlan.author?.avatar || guest} size={28} />
              <div className="list-author-info">
                <span className="list-author-name">
                  {mealPlan.author?.name || "Unknown"}
                </span>
                <span className="list-author-date">
                  {formatDate(mealPlan.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealPlanListCard;
