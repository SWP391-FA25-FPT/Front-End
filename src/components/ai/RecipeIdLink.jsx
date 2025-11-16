import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "./RecipeIdLink.css";

/**
 * Component to render clickable recipe ID links
 * Detects recipe IDs in format: (ID: 507f1f77bcf86cd799439011)
 */
const RecipeIdLink = ({ recipeId, recipeName = "công thức" }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <Tooltip title={`Xem chi tiết ${recipeName}`}>
      <Button
        type="link"
        size="small"
        icon={<EyeOutlined />}
        onClick={handleClick}
        className="recipe-id-link"
      >
        Xem công thức
      </Button>
    </Tooltip>
  );
};

/**
 * Process AI message content to convert recipe IDs into clickable components
 * Pattern: **Recipe Name** (ID: 507f1f77bcf86cd799439011)
 */
export const processRecipeIds = (content) => {
  if (!content || typeof content !== "string") return content;

  // Pattern to match: **Recipe Name** (ID: recipeId)
  const recipePattern = /\*\*([^*]+)\*\*\s*\(ID:\s*([a-f0-9]{24})\)/gi;
  
  // Find all matches
  const matches = [...content.matchAll(recipePattern)];
  
  if (matches.length === 0) return content;

  // Split content and insert markers
  let processedContent = content;
  const recipeData = [];
  
  matches.forEach((match, index) => {
    const [fullMatch, recipeName, recipeId] = match;
    const marker = `__RECIPE_${index}__`;
    
    // Store recipe data
    recipeData.push({ recipeName, recipeId, marker });
    
    // Replace the match with markdown link
    const markdownLink = `**[${recipeName}](/recipe/${recipeId})** 🔗`;
    processedContent = processedContent.replace(fullMatch, markdownLink);
  });
  
  return processedContent;
};

/**
 * Extract all recipe IDs from content for quick access
 */
export const extractRecipeIds = (content) => {
  if (!content || typeof content !== "string") return [];

  const recipePattern = /\*\*([^*]+)\*\*\s*\(ID:\s*([a-f0-9]{24})\)/gi;
  const matches = [...content.matchAll(recipePattern)];
  
  return matches.map((match) => ({
    name: match[1],
    id: match[2],
  }));
};

export default RecipeIdLink;

