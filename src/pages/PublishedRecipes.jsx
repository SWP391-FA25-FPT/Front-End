import React from "react";
import SettingLayout from "../components/layout/SettingLayout";
import RecipeList from "../components/Recipe/RecipeList";
import "./style/MyRecipes.css";

const PublishedRecipes = () => {
  return (
    <SettingLayout>
      <div className="my-recipes-container">
        <div className="my-recipes-header">
          <h1>Đã Chia Sẻ</h1>
        </div>
        <RecipeList
          statusFilter="published"
          emptyDescription="Bạn chưa chia sẻ công thức nào"
        />
      </div>
    </SettingLayout>
  );
};

export default PublishedRecipes;

