import React from "react";
import { Typography } from "antd";
import "./Recipe.css";

const { Text } = Typography;

const IngredientsList = ({ ingredients, servings = 2 }) => {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <div className="ingredients-list-container">
      <div className="ingredients-header">
        <h3>Nguyên Liệu</h3>
        <div className="servings-info">
          <Text type="secondary">{servings} người</Text>
        </div>
      </div>
      <div className="ingredients-content">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-row">
            <div className="ingredient-bullet">•</div>
            <div className="ingredient-name">{ingredient.name}</div>
            <div className="ingredient-amount">{ingredient.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsList;

