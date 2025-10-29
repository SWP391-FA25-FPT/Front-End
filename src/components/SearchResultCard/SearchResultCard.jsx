import React, { useRef } from "react";
import { Card, Avatar, Tag, Badge } from "antd";
import { Icon } from "@iconify/react";
import "./style.css";

const { Meta } = Card;

const SearchResultCard = ({ recipe, onClick, layout = "vertical" }) => {
  const isVerified = recipe.trustScore >= 70;

  // Vertical Layout (Grid view)
  if (layout === "vertical") {
    return (
      <Badge.Ribbon 
        text="Đã kiểm chứng" 
        color="gold"
        style={{ display: isVerified ? "block" : "none" }}
      >
        <Card
          hoverable
          className="search-result-card"
          cover={
            <div style={{ position: "relative", paddingTop: "75%", overflow: "hidden" }}>
              <img
                alt={recipe.name}
                src={recipe.image}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
          }
          onClick={onClick}
          style={{ height: "100%" }}
        >
          <Meta
            title={
              <div style={{ 
                fontSize: "16px", 
                fontWeight: "600",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {recipe.name}
              </div>
            }
            description={
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Avatar size="small" src={recipe.image} />
                  <span style={{ fontSize: "13px", color: "#666" }}>
                    {recipe.author}
                  </span>
                </div>
                
                <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: "13px", color: "#888" }}>
                  {recipe.totalTime && (
                    <span className="d-flex align-items-center gap-1">
                      <Icon icon="mdi:clock-outline" width="16" />
                      {recipe.totalTime}
                    </span>
                  )}
                  {recipe.servings && (
                    <span className="d-flex align-items-center gap-1">
                      <Icon icon="mdi:account-group" width="16" />
                      {recipe.servings} người
                    </span>
                  )}
                </div>

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <Tag key={index} color="orange" style={{ fontSize: "11px", margin: 0 }}>
                        {tag}
                      </Tag>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Tag style={{ fontSize: "11px", margin: 0 }}>
                        +{recipe.tags.length - 3}
                      </Tag>
                    )}
                  </div>
                )}
              </div>
            }
          />
        </Card>
      </Badge.Ribbon>
    );
  }

  // Horizontal Layout (List view)
  return (
    <Card
      hoverable
      className="search-result-card-horizontal mb-3"
      onClick={onClick}
      bodyStyle={{ padding: 0 }}
    >
      <div className="d-flex" style={{ position: "relative" }}>
        {/* Image Section */}
        <div style={{ 
          width: "180px", 
          minWidth: "180px",
          height: "140px",
          overflow: "hidden",
          position: "relative"
        }}>
          <img
            alt={recipe.name}
            src={recipe.image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          {isVerified && (
            <div style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              backgroundColor: "#faad14",
              color: "white",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <Icon icon="mdi:crown" width="14" />
              Premium
            </div>
          )}
        </div>

        {/* Content Section */}
        <div style={{ 
          flex: 1, 
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          {/* Title */}
          <div>
            <h4 style={{ 
              fontSize: "16px", 
              fontWeight: "600",
              marginBottom: "8px",
              color: "#262626",
              lineHeight: "1.4"
            }}>
              {recipe.name}
            </h4>

            {/* Ingredients/Tags */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <p style={{ 
                fontSize: "13px", 
                color: "#8c8c8c",
                marginBottom: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {recipe.ingredients.slice(0, 5).map(ing => ing.name || ing).join(" · ")}
              </p>
            )}

            {/* Meta Info */}
            <div className="d-flex align-items-center gap-3" style={{ fontSize: "13px", color: "#8c8c8c" }}>
              {recipe.totalTime && (
                <span className="d-flex align-items-center gap-1">
                  <Icon icon="mdi:clock-outline" width="16" />
                  {recipe.totalTime}
                </span>
              )}
              {recipe.servings && (
                <span className="d-flex align-items-center gap-1">
                  <Icon icon="mdi:account-group" width="16" />
                  {recipe.servings} người
                </span>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="d-flex align-items-center gap-2 mt-2">
            <Avatar size={24} src={recipe.authorInfo?.avatar || recipe.image} />
            <span style={{ fontSize: "13px", color: "#595959" }}>
              {recipe.authorInfo?.name || recipe.author || "Người dùng"}
            </span>
          </div>
        </div>

        {/* Bookmark Icon */}
        <div style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          cursor: "pointer"
        }}>
          <Icon 
            icon="mdi:bookmark-outline" 
            width="24" 
            style={{ color: "#8c8c8c" }}
          />
        </div>
      </div>
    </Card>
  );
};

export default SearchResultCard;


