import React from "react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-img" />
      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
    </div>
  );
};

export default RecipeCard;
