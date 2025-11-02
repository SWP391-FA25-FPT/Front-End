import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, Button, Spin, message } from "antd";
import SettingLayout from "../components/layout/SettingLayout";
import SearchResultCard from "../components/SearchResultCard/SearchResultCard";
import { getMyRecipes } from "../apis/recipe";
import { addViewHistory } from "../apis/analytics";
import { useAuth } from "../context/useAuth";
import "./style/MyRecipes.css";

const AllRecipes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await getMyRecipes("all");
      if (response.success) {
        setRecipes(response.data || []);
      }
    } catch (error) {
      console.error("Fetch all recipes error:", error);
      message.error(error.message || "Lỗi khi tải danh sách công thức");
    } finally {
      setLoading(false);
    }
  };

  // Handle recipe click - navigate to recipe detail
  const handleRecipeClick = async (recipeId) => {
    // Track view history if user is logged in
    if (user) {
      try {
        await addViewHistory(recipeId, 'desktop');
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    }
    
    // Navigate to recipe detail page
    navigate(`/recipe/${recipeId}`);
  };

  // Handle save change - refresh list
  const handleSaveChange = () => {
    fetchAllRecipes();
  };

  if (loading) {
    return (
      <SettingLayout>
        <div className="my-recipes-container">
          <div className="my-recipes-header">
            <h1>Tất Cả Công Thức</h1>
          </div>
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Spin size="large" tip="Đang tải..." />
          </div>
        </div>
      </SettingLayout>
    );
  }

  if (recipes.length === 0) {
    return (
      <SettingLayout>
        <div className="my-recipes-container">
          <div className="my-recipes-header">
            <h1>Tất Cả Công Thức</h1>
          </div>
          <Empty
            description="Bạn chưa có công thức nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate("/recipe/create")}>
              Tạo món đầu tiên
            </Button>
          </Empty>
        </div>
      </SettingLayout>
    );
  }

  return (
    <SettingLayout>
      <div className="my-recipes-container">
        <div className="my-recipes-header">
          <h1>Tất Cả Công Thức</h1>
        </div>
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "12px",
          padding: "24px 0"
        }}>
          {recipes.map((recipe) => (
            <SearchResultCard
              key={recipe._id}
              recipe={recipe}
              layout="horizontal"
              onClick={() => handleRecipeClick(recipe._id)}
              onSaveChange={handleSaveChange}
            />
          ))}
        </div>
      </div>
    </SettingLayout>
  );
};

export default AllRecipes;

