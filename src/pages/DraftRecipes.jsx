import React from "react";
import SettingLayout from "../components/layout/SettingLayout";
import RecipeList from "../components/Recipe/RecipeList";
import "./style/MyRecipes.css";

const DraftRecipes = () => {
  return (
    <SettingLayout>
      <div className="my-recipes-container">
        <div className="my-recipes-header">
          <h1>Món Nháp</h1>
        </div>
        <RecipeList
          statusFilter="drafts"
          emptyDescription="Bạn chưa có món nháp nào"
        />
      </div>
    </SettingLayout>
  );
};

export default DraftRecipes;

