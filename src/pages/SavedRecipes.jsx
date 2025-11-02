import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, Button, Spin, message } from "antd";
import SettingLayout from "../components/layout/SettingLayout";
import SearchResultCard from "../components/SearchResultCard/SearchResultCard";
import { getMyRecipes } from "../apis/recipe";
import { addViewHistory } from "../apis/analytics";
import { useAuth } from "../context/useAuth";
import "./style/MyRecipes.css";

const SavedRecipes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      const response = await getMyRecipes("saved");
      if (response.success) {
        setRecipes(response.data || []);
      }
    } catch (error) {
      console.error("Fetch saved recipes error:", error);
      message.error(error.message || "Lỗi khi tải danh sách công thức đã lưu");
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

  // Handle save change - refresh list or remove recipe if unsaved
  const handleSaveChange = (recipeId, isSaved) => {
    if (!isSaved) {
      // If recipe was unsaved, remove it from the list immediately
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
    } else {
      // If recipe was saved, refresh the list
      fetchSavedRecipes();
    }
  };

  if (loading) {
    return (
      <SettingLayout>
        <div className="my-recipes-container">
          <div className="my-recipes-header">
            <h1>Đã Lưu</h1>
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
            <h1>Đã Lưu</h1>
          </div>
          <Empty
            description="Bạn chưa lưu công thức nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate("/")}>
              Khám phá món ngon
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
          <h1>Đã Lưu</h1>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "24px",
          padding: "24px 0"
        }}>
          {recipes.map((recipe) => (
            <SearchResultCard
              key={recipe._id}
              recipe={recipe}
              layout="vertical"
              onClick={() => handleRecipeClick(recipe._id)}
              onSaveChange={(recipeId, isSaved) => handleSaveChange(recipeId, isSaved)}
            />
          ))}
        </div>
      </div>
    </SettingLayout>
  );
};

export default SavedRecipes;

