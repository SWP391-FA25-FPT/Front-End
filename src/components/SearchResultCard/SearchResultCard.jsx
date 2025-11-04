import React, { useState, useEffect } from "react";
import { Card, Avatar, Tag, Badge, message } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
import { toggleSaveRecipe, checkRecipeSaved } from "../../apis/recipe";
import blank4x3 from "../../assets/blank4x3.png";
import guest from "../../assets/guest.png";
import "./style.css";

const { Meta } = Card;

const SearchResultCard = ({ recipe, onClick, layout = "vertical", onSaveChange }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const isVerified = recipe.trustScore >= 70;

  // Check if recipe is saved on component mount
  useEffect(() => {
    const checkSaved = async () => {
      if (user && recipe._id) {
        try {
          const response = await checkRecipeSaved(recipe._id);
          setIsSaved(response.data?.isSaved || false);
        } catch (error) {
          console.error('Check saved error:', error);
        }
      }
    };
    checkSaved();
  }, [recipe._id, user]);

  // Handle bookmark toggle
  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); // Prevent card onClick from firing
    
    if (!user) {
      message.warning('Vui lòng đăng nhập để lưu công thức');
      return;
    }

    try {
      setSavingLoading(true);
      const response = await toggleSaveRecipe(recipe._id);
      const newIsSaved = response.data?.isSaved || false;
      setIsSaved(newIsSaved);
      message.success(response.message || (newIsSaved ? 'Đã lưu công thức' : 'Đã bỏ lưu công thức'));
      
      // Callback to refresh parent component (e.g., SavedRecipes page)
      if (onSaveChange) {
        // Pass recipeId and new saved state to callback
        onSaveChange(recipe._id, newIsSaved);
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi lưu công thức');
    } finally {
      setSavingLoading(false);
    }
  };

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
                src={recipe.image || blank4x3}
                onError={(e) => {
                  e.target.src = blank4x3;
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
              {/* Bookmark Icon for Vertical Layout */}
              <div 
                onClick={handleBookmarkClick}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  cursor: user ? "pointer" : "default",
                  opacity: savingLoading ? 0.6 : 1,
                  transition: "all 0.2s",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: isSaved ? "rgba(255, 149, 0, 0.1)" : "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(4px)"
                }}
                title={isSaved ? "Đã lưu - Nhấn để bỏ lưu" : "Lưu công thức"}
              >
                <Icon 
                  icon={isSaved ? "mdi:bookmark" : "mdi:bookmark-outline"} 
                  width="24" 
                  style={{ 
                    color: isSaved ? "#ff9500" : "#8c8c8c",
                    transition: "all 0.2s"
                  }}
                />
              </div>
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
                  <Avatar size="small" src={recipe.authorInfo?.avatar || guest} />
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
            src={recipe.image || blank4x3}
            onError={(e) => {
              e.target.src = blank4x3;
            }}
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
            <Avatar size={24} src={recipe.authorInfo?.avatar || guest} />
            <span style={{ fontSize: "13px", color: "#595959" }}>
              {recipe.authorInfo?.name || recipe.author || "Người dùng"}
            </span>
          </div>
        </div>

        {/* Bookmark Icon */}
        <div 
          onClick={handleBookmarkClick}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            cursor: user ? "pointer" : "default",
            opacity: savingLoading ? 0.6 : 1,
            transition: "all 0.2s",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: isSaved ? "rgba(255, 149, 0, 0.1)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(4px)"
          }}
          title={isSaved ? "Đã lưu - Nhấn để bỏ lưu" : "Lưu công thức"}
        >
          <Icon 
            icon={isSaved ? "mdi:bookmark" : "mdi:bookmark-outline"} 
            width="24" 
            style={{ 
              color: isSaved ? "#ff9500" : "#8c8c8c",
              transition: "all 0.2s"
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default SearchResultCard;


