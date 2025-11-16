import React, { useEffect, useState } from "react";
import { Button, Space, message } from "antd";
import { Icon } from "@iconify/react";
import { addRecipeReaction } from "../../apis/recipe";
import { useAuth } from "../../context/useAuth";
import "./Recipe.css";

const REACTION_TYPES = ["delicious", "love", "fire"];

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

const normalizeReactions = (reactionList = []) =>
  REACTION_TYPES.map((type) => {
    const match = reactionList.find((reaction) => reaction.type === type);
    return {
      type,
      count: match?.count || 0,
    };
  });

const RecipeReactions = ({
  recipeId,
  initialReactions = [],
  initialUserReaction = null,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState(normalizeReactions(initialReactions));
  const [userReaction, setUserReaction] = useState(initialUserReaction);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    setReactions(normalizeReactions(initialReactions));
  }, [initialReactions]);

  useEffect(() => {
    setUserReaction(initialUserReaction || null);
  }, [initialUserReaction]);

  const handleReaction = async (type) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để phản hồi");
      return;
    }

    if (loading[type]) {
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [type]: true }));

      const response = await addRecipeReaction(recipeId, type);

      if (response.success) {
        const normalized = normalizeReactions(response.data?.reactions || []);
        const updatedUserReaction = response.data?.userReaction || null;

        setReactions(normalized);
        setUserReaction(updatedUserReaction);

        if (onUpdate) {
          onUpdate(normalized, updatedUserReaction);
        }

        message.success(response.message || "Đã cập nhật phản hồi");
      }
    } catch (error) {
      message.error(error.message || "Lỗi khi cập nhật phản hồi");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
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
              border: `1.5px solid ${
                userReaction === type ? config.color : "#f0f0f0"
              }`,
              backgroundColor:
                userReaction === type ? `${config.color}10` : "#fff",
              cursor: "pointer",
              transition: "all 0.3s ease",
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

