import React from "react";
import { Card, Row, Col, Button, Empty, Spin, Tag, Progress } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const MealPlanSection = ({ 
  mealPlan, 
  loading, 
  onGenerate, 
  onRegenerate,
  activeGoal 
}) => {
  const navigate = useNavigate();

  const handleRecipeClick = (recipeId) => {
    if (recipeId) {
      const id = typeof recipeId === 'object' ? recipeId._id || recipeId.toString() : recipeId;
      navigate(`/recipe/${id}`);
    }
  };

  const getMealTypeIcon = (type) => {
    const icons = {
      Breakfast: '🍳',
      Lunch: '🍜',
      Dinner: '🍽️',
      Snack: '🥤'
    };
    return icons[type] || '🍴';
  };

  const getMealTypeColor = (type) => {
    const colors = {
      Breakfast: '#ff9800',
      Lunch: '#4caf50',
      Dinner: '#2196f3',
      Snack: '#9c27b0'
    };
    return colors[type] || '#757575';
  };

  const calculateCalorieProgress = () => {
    if (!mealPlan || !activeGoal) return 0;
    return Math.min(100, Math.round((mealPlan.totalCalories / activeGoal.targetCaloriesPerDay) * 100));
  };

  if (loading) {
    return (
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon icon="mdi:food" style={{ fontSize: "24px", color: "#F8B602" }} />
            <span>Kế hoạch bữa ăn hôm nay</span>
          </div>
        }
        style={{ marginBottom: "24px" }}
      >
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "16px", color: "#666" }}>Đang tạo kế hoạch bữa ăn...</p>
        </div>
      </Card>
    );
  }

  if (!mealPlan) {
    return (
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon icon="mdi:food" style={{ fontSize: "24px", color: "#F8B602" }} />
            <span>Kế hoạch bữa ăn hôm nay</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<Icon icon="mdi:plus" />}
            onClick={onGenerate}
            style={{
              background: "linear-gradient(135deg, #F8B602 0%, #e19a28 100%)",
              border: "none",
            }}
          >
            Tạo kế hoạch
          </Button>
        }
        style={{ marginBottom: "24px" }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: "#666" }}>
              {activeGoal 
                ? "Chưa có kế hoạch bữa ăn cho hôm nay. Tạo kế hoạch dựa trên mục tiêu của bạn!"
                : "Chưa có kế hoạch bữa ăn. Hãy tạo mục tiêu trước để nhận gợi ý bữa ăn phù hợp!"
              }
            </span>
          }
        />
      </Card>
    );
  }

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const groupedMeals = {};
  
  mealTypes.forEach(type => {
    groupedMeals[type] = mealPlan.meals.filter(m => m.type === type);
  });

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon icon="mdi:food" style={{ fontSize: "24px", color: "#F8B602" }} />
          <span>Kế hoạch bữa ăn hôm nay</span>
        </div>
      }
      extra={
        <Button
          icon={<Icon icon="mdi:refresh" />}
          onClick={onRegenerate}
          disabled={loading}
        >
          Tạo lại
        </Button>
      }
      style={{ marginBottom: "24px" }}
    >
      {activeGoal && (
        <div style={{ 
          padding: "16px", 
          background: "#f5f5f5", 
          borderRadius: "8px",
          marginBottom: "20px" 
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={16}>
              <div>
                <span style={{ fontSize: "16px", fontWeight: 500 }}>
                  Calories: {Math.round(mealPlan.totalCalories)} / {activeGoal.targetCaloriesPerDay}
                </span>
              </div>
              <Progress
                percent={calculateCalorieProgress()}
                strokeColor={{
                  '0%': '#F8B602',
                  '100%': '#e19a28',
                }}
                style={{ marginTop: "8px" }}
              />
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#666" }}>Mục tiêu</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#F8B602" }}>
                {activeGoal.goalType === 'weight_loss' && '🔻 Giảm cân'}
                {activeGoal.goalType === 'weight_gain' && '🔺 Tăng cân'}
                {activeGoal.goalType === 'maintain' && '⚖️ Duy trì'}
              </div>
            </Col>
          </Row>
        </div>
      )}

      <Row gutter={[16, 16]}>
        {mealTypes.map(mealType => {
          const meals = groupedMeals[mealType];
          if (!meals || meals.length === 0) return null;

          const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

          return (
            <Col xs={24} sm={12} key={mealType}>
              <div
                style={{
                  border: `2px solid ${getMealTypeColor(mealType)}`,
                  borderRadius: "12px",
                  padding: "16px",
                  height: "100%",
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "12px" 
                }}>
                  <span style={{ 
                    fontSize: "18px", 
                    fontWeight: "bold",
                    color: getMealTypeColor(mealType)
                  }}>
                    {getMealTypeIcon(mealType)} {mealType}
                  </span>
                  <Tag color={getMealTypeColor(mealType)}>
                    {totalCalories} cal
                  </Tag>
                </div>

                {meals.map((meal, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleRecipeClick(meal.recipeId)}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "8px",
                      borderRadius: "8px",
                      cursor: meal.recipeId ? "pointer" : "default",
                      transition: "all 0.3s",
                      backgroundColor: "#fff",
                      marginBottom: idx < meals.length - 1 ? "8px" : "0"
                    }}
                    onMouseEnter={(e) => {
                      if (meal.recipeId) {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <img
                      src={meal.imageUrl || '/blank4x3.png'}
                      alt={meal.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        flexShrink: 0
                      }}
                      onError={(e) => e.target.src = '/blank4x3.png'}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 500,
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {meal.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {meal.calories} cal
                        {meal.macros && (
                          <> • P: {Math.round(meal.macros.protein)}g • C: {Math.round(meal.macros.carbs)}g • F: {Math.round(meal.macros.fat)}g</>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          );
        })}
      </Row>

      {mealPlan.totalMacros && (
        <div style={{ 
          marginTop: "20px", 
          padding: "16px",
          background: "#fafafa",
          borderRadius: "8px"
        }}>
          <div style={{ fontWeight: 500, marginBottom: "12px" }}>
            <Icon icon="mdi:chart-pie" style={{ marginRight: "8px" }} />
            Tổng dinh dưỡng
          </div>
          <Row gutter={[16, 8]}>
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#B794F6" }}>
                  {Math.round(mealPlan.totalMacros.protein)}g
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>Protein</div>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#FFD93D" }}>
                  {Math.round(mealPlan.totalMacros.carbs)}g
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>Carbs</div>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#6ECFBD" }}>
                  {Math.round(mealPlan.totalMacros.fat)}g
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>Fat</div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
};

export default MealPlanSection;


