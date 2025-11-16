import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag } from "antd";
import { EyeOutlined, FireOutlined } from "@ant-design/icons";
import { extractRecipeIds } from "./RecipeIdLink";
import "./RecipeIdLink.css";

/**
 * Display quick access links for all recipes mentioned in AI message
 */
const RecipeQuickLinks = ({ content }) => {
  const navigate = useNavigate();
  const recipes = extractRecipeIds(content);

  if (recipes.length === 0) return null;

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="recipe-quick-links">
      <div className="recipe-quick-links-title">
        <FireOutlined style={{ color: "var(--color-primary)" }} />
        <span>Công thức được đề xuất ({recipes.length})</span>
      </div>
      <div className="recipe-quick-links-list">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="recipe-quick-link-item"
            onClick={() => handleViewRecipe(recipe.id)}
          >
            <div className="recipe-quick-link-name">
              <Tag color="blue" style={{ marginRight: 8 }}>
                {index + 1}
              </Tag>
              {recipe.name}
            </div>
            <div className="recipe-quick-link-action">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                className="recipe-quick-link-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewRecipe(recipe.id);
                }}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeQuickLinks;

