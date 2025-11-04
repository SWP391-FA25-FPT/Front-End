import React from "react";
import SettingLayout from "../components/layout/SettingLayout";
import RecipeList from "../components/Recipe/RecipeList";
import "./style/MyRecipes.css";

const PrivateRecipes = () => {
  return (
    <SettingLayout>
      <div className="my-recipes-container">
        <div className="my-recipes-header">
          <h1>Món Của Tôi</h1>
        </div>
        <RecipeList
          statusFilter="private"
          emptyDescription="Bạn chưa có món riêng tư nào"
        />
      </div>
    </SettingLayout>
  );
};

export default PrivateRecipes;

