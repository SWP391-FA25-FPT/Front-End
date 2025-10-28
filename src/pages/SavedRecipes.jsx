import React from "react";
import { useNavigate } from "react-router-dom";
import SettingLayout from "../components/layout/SettingLayout";
import RecipeList from "../components/Recipe/RecipeList";
import "./style/MyRecipes.css";

const SavedRecipes = () => {
  const navigate = useNavigate();

  return (
    <SettingLayout>
      <div className="my-recipes-container">
        <div className="my-recipes-header">
          <h1>Đã Lưu</h1>
        </div>
        <RecipeList
          statusFilter="saved"
          emptyDescription="Bạn chưa lưu công thức nào"
          emptyButtonText="Khám phá món ngon"
          emptyButtonAction={() => navigate("/")}
        />
      </div>
    </SettingLayout>
  );
};

export default SavedRecipes;

