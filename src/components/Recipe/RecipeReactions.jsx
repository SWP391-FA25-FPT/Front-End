import React, { useState } from "react";
import { Button, Space, message } from "antd";
import { Icon } from "@iconify/react";
import { addRecipeReaction } from "../../apis/recipe";
import "./Recipe.css";

const RecipeReactions = ({ recipeId, initialReactions = [], onUpdate }) => {
  const [reactions, setReactions] = useState(initialReactions);
  const [loading, setLoading] = useState({});

  // Map reaction types to icons and colors
  const reactionConfig = {
    delicious: {
      icon: "noto:fork-and-knife-with-plate",
      label: "Ngon",
      color: "#ff9500",
    },
    love: {
      icon: "noto:red-heart",
      label: "Yêu thích",
      color: "#ff3b30",
    },
    fire: {
      icon: "noto:fire",
      label: "Tuyệt vời",
      color: "#ff6600",
    },
  };

  const handleReaction = async (type) => {
    try {
      setLoading({ ...loading, [type]: true });
      
      const response = await addRecipeReaction(recipeId, type);
      
      if (response.success) {
        // Update local state
        setReactions(response.data);
        
        // Call parent callback if provided
        if (onUpdate) {
          onUpdate(response.data);
        }
        
        message.success("Cảm ơn bạn đã phản hồi!");
      }
    } catch (error) {
      message.error(error.message || "Lỗi khi thêm phản hồi");
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  const getReactionCount = (type) => {
    const reaction = reactions.find((r) => r.type === type);
    return reaction ? reaction.count : 0;
  };

  return (
    <div className="recipe-reactions" style={{ marginBottom: "16px" }}>
      <div style={{ marginBottom: "10px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#262626" }}>
          Bạn nghĩ sao về món này?
        </span>
      </div>
      
      <Space size="small" wrap>
        {Object.entries(reactionConfig).map(([type, config]) => (
          <Button
            key={type}
            size="middle"
            loading={loading[type]}
            onClick={() => handleReaction(type)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 14px",
              borderRadius: "18px",
              border: "1.5px solid #f0f0f0",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = config.color;
              e.currentTarget.style.backgroundColor = `${config.color}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#f0f0f0";
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            <Icon icon={config.icon} width="20" height="20" />
            <span style={{ fontSize: "13px", fontWeight: "500" }}>
              {config.label}
            </span>
            {getReactionCount(type) > 0 && (
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: config.color,
                  marginLeft: "2px",
                }}
              >
                {getReactionCount(type)}
              </span>
            )}
          </Button>
        ))}
      </Space>
    </div>
  );
};

export default RecipeReactions;

