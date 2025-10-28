import React from "react";
import { useNavigate } from "react-router-dom";
import SettingLayout from "../components/layout/SettingLayout";
import RecipeList from "../components/Recipe/RecipeList";
import "./style/MyRecipes.css";

const MyRecipes = () => {
  const navigate = useNavigate();

  return (
    <SettingLayout>
      <div className="my-recipes-container">
        <div className="my-recipes-header">
          <h1>Kho Món Ngon Của Tôi</h1>
        </div>
        <RecipeList
          statusFilter="all"
          emptyDescription="Bạn chưa có công thức nào"
          emptyButtonText="Tạo món đầu tiên"
          emptyButtonAction={() => navigate("/recipe/create")}
        />
      </div>
    </SettingLayout>
  );
};

export default MyRecipes;

