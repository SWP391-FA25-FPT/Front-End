import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Alert, Divider, Row, Col, Button, message } from "antd";
import { Icon } from "@iconify/react";
import SettingLayout from "../components/layout/SettingLayout";
import RecipeHeader from "../components/Recipe/RecipeHeader";
import RecipeImage from "../components/Recipe/RecipeImage";
import RecipeActions from "../components/Recipe/RecipeActions";
import IngredientsList from "../components/Recipe/IngredientsList";
import StepsList from "../components/Recipe/StepsList";
import NutritionInfo from "../components/Recipe/NutritionInfo";
import TipsSection from "../components/Recipe/TipsSection";
import RecipeRating from "../components/Recipe/RecipeRating";
import RecipeComments from "../components/Recipe/RecipeComments";
import RecipeReactions from "../components/Recipe/RecipeReactions";
import { getRecipeById, getAllRecipes, publishRecipeDraft } from "../apis/recipe";
import { useAuth } from "../context/useAuth";
import guest from "../assets/guest.png";
import "./style/RecipeDetail.css";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch recipe details
      const response = await getRecipeById(id);
      setRecipe(response.data);

      // Fetch similar recipes (same tags)
      if (response.data.tags && response.data.tags.length > 0) {
        const similarResponse = await getAllRecipes({
          tags: response.data.tags.slice(0, 2).join(','),
          limit: 6,
        });
        // Filter out current recipe
        const filtered = similarResponse.data.filter(r => r._id !== id);
        setSimilarRecipes(filtered.slice(0, 5));
      }
    } catch (err) {
      console.error("Fetch recipe error:", err);
      setError(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishDraft = async () => {
    try {
      setPublishing(true);
      const response = await publishRecipeDraft(id);
      message.success(response.message || "Đã lên sóng công thức!");
      await fetchRecipe();
    } catch (publishError) {
      console.error("Publish draft error:", publishError);
      message.error(publishError.message || "Không thể lên sóng công thức");
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isRecipeAuthor =
    recipe?.authorId && user?._id && String(recipe.authorId) === String(user._id);
  const canPublish = isRecipeAuthor && recipe?.status === "draft";

  if (loading) {
    return (
      <SettingLayout>
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <Spin size="large" tip="Đang tải công thức..." />
        </div>
      </SettingLayout>
    );
  }

  if (error || !recipe) {
    return (
      <SettingLayout>
        <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
          <Alert
            message="Lỗi"
            description={error || "Không tìm thấy công thức"}
            type="error"
            showIcon
            action={
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "8px 16px",
                  background: "#1890ff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Về trang chủ
              </button>
            }
          />
        </div>
      </SettingLayout>
    );
  }

  return (
    <SettingLayout>
      <div className="recipe-detail-container">
        {/* Main Content */}
        <div className="recipe-detail-wrapper">
          {/* Row 1: Image + Header Info */}
          <div className="recipe-top-section">
            {/* Left: Main Image */}
            <div className="recipe-image-column">
              <RecipeImage image={recipe.image} name={recipe.name} />
            </div>

            {/* Right: Header Info */}
            <div className="recipe-info-column">
              <h1 className="recipe-title">{recipe.name}</h1>
              
              {/* Author Info */}
              <div className="recipe-author-info">
                <div className="author-meta">
                  <img 
                    src={recipe.authorInfo?.avatar || guest} 
                    alt={recipe.author}
                    className="author-avatar"
                    onError={(e) => {
                      e.target.src = guest;
                    }}
                  />
                  <div>
                    <div className="author-name">{recipe.author}</div>
                    <div className="recipe-stats">
                      {recipe.totalTime && <span>{recipe.totalTime}</span>}
                      {recipe.servings && <span>• {recipe.servings} người</span>}
                    </div>
                  </div>
                </div>
                <div className="recipe-meta-info">
                  {recipe.description && <p className="recipe-description">{recipe.description}</p>}
                </div>
              </div>

              {/* Reactions */}
              <div className="recipe-reactions-bar">
                <RecipeReactions
                  recipeId={id}
                  initialReactions={recipe.reactions || []}
                  initialUserReaction={recipe.userReaction}
                  onUpdate={(updatedReactions, updatedUserReaction) => {
                    setRecipe((prev) => ({
                      ...prev,
                      reactions: updatedReactions,
                      userReaction: updatedUserReaction,
                    }));
                  }}
                />
              </div>

              {/* Actions */}
              <div
                className="recipe-actions-bar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {canPublish && (
                  <Button
                    type="primary"
                    onClick={handlePublishDraft}
                    loading={publishing}
                  >
                    Lên sóng
                  </Button>
                )}
                <RecipeActions recipe={recipe} onUpdate={fetchRecipe} />
              </div>
            </div>
          </div>

          <Divider style={{ margin: "40px 0" }} />

          {/* Row 2: Ingredients (sticky) + Steps */}
          <div className="recipe-main-content">
            {/* Left: Ingredients (Sticky) */}
            <div className="recipe-ingredients-column">
              <div className="ingredients-sticky-wrapper">
                <IngredientsList ingredients={recipe.ingredients} servings={recipe.servings} />
                
                {/* Nutrition Info */}
                {recipe.nutrition && (
                  <div className="recipe-nutrition-section" style={{ marginTop: "24px" }}>
                    <NutritionInfo nutrition={recipe.nutrition} />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Steps */}
            <div className="recipe-steps-column">
              <div className="recipe-steps-section">
                <h2 className="section-title">Hướng dẫn cách làm</h2>
                {recipe.totalTime && (
                  <div className="steps-time-info">
                    <Icon icon="mdi:clock-outline" width="18" height="18" />
                    <span>{recipe.totalTime}</span>
                  </div>
                )}
                <StepsList steps={recipe.steps} />
              </div>

              {/* Tips */}
              {recipe.tips && recipe.tips.length > 0 && (
                <div style={{ marginTop: "32px" }}>
                  <TipsSection tips={recipe.tips} />
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <Divider style={{ margin: "40px 0" }} />
          <div className="recipe-rating-section">
            <RecipeRating recipeId={id} />
          </div>

          {/* Comments */}
          <Divider style={{ margin: "40px 0" }} />
          <div className="recipe-comments-section">
            <h2 className="section-title">Bình luận</h2>
            <RecipeComments recipeId={id} />
          </div>

          {/* Similar Recipes */}
          {similarRecipes.length > 0 && (
            <>
              <Divider style={{ margin: "40px 0" }} />
              <div className="similar-recipes-section">
                <h2 className="section-title">Các Món Tương Tự</h2>
                <Row gutter={[16, 16]}>
                  {similarRecipes.map((similarRecipe) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={similarRecipe._id}>
                      <div 
                        onClick={() => navigate(`/recipe/${similarRecipe._id}`)}
                        className="similar-recipe-card"
                      >
                        <div className="similar-recipe-image">
                          <img src={similarRecipe.image} alt={similarRecipe.name} />
                        </div>
                        <div className="similar-recipe-info">
                          <h4>{similarRecipe.name}</h4>
                          <p>{similarRecipe.author}</p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          )}
        </div>
      </div>
    </SettingLayout>
  );
};

export default RecipeDetail;

