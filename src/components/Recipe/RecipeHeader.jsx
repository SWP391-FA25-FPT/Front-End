import React from "react";
import { Typography, Tag, Space } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import "./Recipe.css";

const { Title, Text } = Typography;

const RecipeHeader = ({ recipe, ratingData }) => {
  const { averageRating = 0, totalRatings = 0 } = ratingData || {};
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="recipe-header">
      <Title level={2} style={{ marginBottom: "16px" }}>
        {recipe.name}
      </Title>
      
      {/* Author và Stats */}
      <div className="recipe-meta" style={{ marginBottom: "16px" }}>
        <Space size="middle" wrap>
          <div className="recipe-author">
            <Icon icon="mdi:account-circle" width="20" height="20" />
            <Text style={{ marginLeft: "8px" }}>{recipe.author}</Text>
          </div>
          
          <div className="recipe-rating">
            <Icon icon="mdi:star" width="20" height="20" color="#ffa500" />
            <Text style={{ marginLeft: "4px" }}>
              {averageRating > 0 ? averageRating.toFixed(1) : "Chưa có đánh giá"} 
              {totalRatings > 0 && ` (${totalRatings})`}
            </Text>
          </div>
          
          <div className="recipe-views">
            <Icon icon="mdi:eye" width="20" height="20" />
            <Text style={{ marginLeft: "4px" }}>{recipe.views} lượt xem</Text>
          </div>

          <div className="recipe-saves">
            <Icon icon="mdi:bookmark" width="20" height="20" />
            <Text style={{ marginLeft: "4px" }}>{recipe.saves} lượt lưu</Text>
          </div>
        </Space>
      </div>

      {/* Description */}
      <Text type="secondary" style={{ display: "block", marginBottom: "16px", fontSize: "15px" }}>
        {recipe.description}
      </Text>

      {/* Info Tags */}
      <div className="recipe-info-tags" style={{ marginBottom: "16px" }}>
        <Space wrap>
          {recipe.totalTime && (
            <Tag icon={<Icon icon="mdi:clock-outline" />} color="blue">
              {recipe.totalTime}
            </Tag>
          )}
          {recipe.servings && (
            <Tag icon={<Icon icon="mdi:account-group" />} color="green">
              {recipe.servings} khẩu phần
            </Tag>
          )}
        </Space>
      </div>

      {/* Category Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="recipe-tags">
          <Space wrap>
            {recipe.tags.map((tag, index) => (
              <Tag 
                key={index} 
                color="default"
                onClick={() => handleTagClick(tag)}
                style={{ 
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                className="recipe-tag-clickable"
              >
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

export default RecipeHeader;

