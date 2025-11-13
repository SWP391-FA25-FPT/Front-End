import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/SettingLayout";
import { useTheme } from "../context/ThemeContext"; // BỔ SUNG: Import useTheme
import "./style/MealPlan.css";
import {
  getMealPlans,
  generateMealPlan,
  regenerateMealPlan,
  deleteMealPlan as deleteMealPlanAPI,
  generateWeeklyMealPlan,
} from "../apis/mealplan";

// Thay thế window.confirm bằng alert/message (Do yêu cầu không dùng window.confirm)
const customConfirm = (message) => {
  // Trong môi trường thực tế, cần dùng Antd Modal. Ở đây dùng tạm console log để tránh lỗi window.confirm
  console.log(`CONFIRMATION: ${message}`);
  return true; // Giả sử người dùng đồng ý
};

export default function MealPlan() {
  const [mealPlanData, setMealPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { themeMode } = useTheme(); // BỔ SUNG: Lấy themeMode

  // Check for meal plan on mount and when date changes
  useEffect(() => {
    checkMealPlanForDate();
  }, [selectedDate]);

  // Check if we need to refresh when day changes
  useEffect(() => {
    const checkDayChange = setInterval(() => {
      const now = new Date();
      const currentDateStr = now.toISOString().split("T")[0];
      const selectedDateStr = selectedDate.toISOString().split("T")[0];

      // If selected date is not today, don't auto-refresh
      if (selectedDateStr !== currentDateStr) return;

      // Check if meal plan date is different from today
      if (mealPlanData) {
        const mealPlanDateStr = new Date(mealPlanData.date)
          .toISOString()
          .split("T")[0];
        if (mealPlanDateStr !== currentDateStr) {
          // New day, clear meal plan
          setMealPlanData(null);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkDayChange);
  }, [mealPlanData, selectedDate]);

  const checkMealPlanForDate = async () => {
    try {
      setLoading(true);
      setError(null);
      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await getMealPlans({ date: dateStr });

      if (response.success && response.data && response.data.length > 0) {
        setMealPlanData(response.data[0]);
      } else {
        setMealPlanData(null);
      }
    } catch (err) {
      console.error("Error loading meal plan:", err);
      setMealPlanData(null);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique ingredients from meal plan
  const getAllIngredients = useMemo(() => {
    if (!mealPlanData || !mealPlanData.meals) return [];

    const ingredientMap = new Map();

    mealPlanData.meals.forEach((meal) => {
      if (meal.ingredients) {
        meal.ingredients.forEach((ingredient) => {
          if (ingredientMap.has(ingredient.name)) {
            const existing = ingredientMap.get(ingredient.name);
            ingredientMap.set(ingredient.name, {
              ...existing,
              amount: `${existing.amount}, ${ingredient.amount}`,
            });
          } else {
            ingredientMap.set(ingredient.name, { ...ingredient });
          }
        });
      }
    });

    return Array.from(ingredientMap.values());
  }, [mealPlanData]);

  const formatDateShort = (date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDayName = (date) => {
    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = mealPlanData
        ? await regenerateMealPlan(dateStr)
        : await generateMealPlan(dateStr);

      if (response.success && response.data) {
        setMealPlanData(response.data);
      }
    } catch (err) {
      console.error("Error generating meal plan:", err);
      setError(
        err.message ||
          "Không thể tạo kế hoạch bữa ăn. Vui lòng hoàn thiện hồ sơ của bạn."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWeeklyPlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await generateWeeklyMealPlan(dateStr);

      if (response.success && response.data) {
        setMealPlanData(response.data[0]);
        console.log("Đã tạo kế hoạch bữa ăn cho 7 ngày thành công!");
      }
    } catch (err) {
      console.error("Error generating weekly meal plan:", err);
      setError(err.message || "Không thể tạo kế hoạch bữa ăn tuần.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!mealPlanData || !mealPlanData._id) {
      return;
    }

    if (!customConfirm("Bạn có chắc muốn xóa kế hoạch bữa ăn này?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await deleteMealPlanAPI(mealPlanData._id);
      setMealPlanData(null);
    } catch (err) {
      console.error("Error deleting meal plan:", err);
      setError(err.message || "Không thể xóa kế hoạch bữa ăn");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipeId) => {
    const id =
      typeof recipeId === "object"
        ? recipeId._id || recipeId.toString()
        : recipeId;
    navigate(`/recipe/${id}`);
  };

  const macroData = useMemo(() => {
    const total =
      (mealPlanData?.totalMacros?.protein || 0) +
      (mealPlanData?.totalMacros?.carbs || 0) +
      (mealPlanData?.totalMacros?.fat || 0);

    if (total === 0) return { total: 0, macros: [] };

    return {
      total: total,
      macros: [
        {
          name: "Fat",
          value: mealPlanData.totalMacros?.fat || 0,
          color: "var(--mealplan-color-fat)",
        },
        {
          name: "Carbs",
          value: mealPlanData.totalMacros?.carbs || 0,
          color: "var(--mealplan-color-carbs)",
        },
        {
          name: "Protein",
          value: mealPlanData.totalMacros?.protein || 0,
          color: "var(--mealplan-color-protein)",
        },
      ]
        .filter((m) => m.value > 0)
        .sort((a, b) => b.value - a.value),
    };
  }, [mealPlanData]);

  const createSlice = (percentage, color, currentAngleRef) => {
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngleRef.current;
    currentAngleRef.current += angle;

    const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos(((currentAngleRef.current - 90) * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin(((currentAngleRef.current - 90) * Math.PI) / 180);

    const largeArc = angle > 180 ? 1 : 0;

    return (
      <path
        key={color}
        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={color}
      />
    );
  };

  return (
    <Layout>
      <div
        className="mealplan-container"
        style={{
          backgroundColor:
            themeMode === "dark" ? "var(--color-bg-body)" : undefined,
          color: "var(--color-text-primary)",
        }}
      >
        {/* Header Section */}
        <div className="mealplan-header">
          <div className="header-left">
            <h1 className="mealplan-title">
              <span className="icon">📋</span> Kế hoạch bữa ăn của bạn
            </h1>
            <p className="mealplan-date">
              Cho ngày {formatDateShort(selectedDate)}.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" disabled={!mealPlanData}>
              <span className="icon">📝</span> Danh sách mua sắm
            </button>
            <button
              className="btn-primary"
              onClick={handleGeneratePlan}
              disabled={loading}
            >
              <span className="icon">🔄</span>
              {loading
                ? "Đang tạo..."
                : mealPlanData
                ? "Tạo lại kế hoạch"
                : "Tạo kế hoạch mới"}
            </button>
            <button className="btn-ai" disabled>
              <span className="icon">✨</span> AI
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Date Navigation */}
        <div className="date-navigation">
          <button className="date-nav-btn" onClick={() => changeDate(-1)}>
            &lt;
          </button>
          <span className="current-date">{getDayName(selectedDate)}</span>
          <button className="date-nav-btn" onClick={() => changeDate(1)}>
            &gt;
          </button>
          <button
            className="btn-week-plan"
            onClick={handleGenerateWeeklyPlan}
            disabled={loading}
          >
            <span className="icon">📅</span> Tạo kế hoạch tuần
          </button>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tạo kế hoạch bữa ăn...</p>
          </div>
        ) : !mealPlanData ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>Chưa có kế hoạch bữa ăn</h3>
            <p>Nhấn "Tạo kế hoạch mới" để tạo kế hoạch bữa ăn cho ngày hôm nay</p>
          </div>
        ) : (
          <div className="mealplan-content">
            {/* Left Side - Meals */}
            <div className="meals-section">
              {["Breakfast", "Lunch", "Dinner", "Snack"].map((mealType) => {
                const mealsOfType = mealPlanData.meals.filter(
                  (m) => m.type === mealType
                );
                if (mealsOfType.length === 0) return null;

                const totalCals = mealsOfType.reduce(
                  (sum, m) => sum + (m.calories || 0),
                  0
                );

                return (
                  <div key={mealType} className="meal-type-section">
                    <div className="meal-type-header">
                      <h2>{mealType}</h2>
                      <span className="meal-calories">{totalCals} Calories</span>
                    </div>
                    <div className="meal-items">
                      {mealsOfType.map((meal, idx) => (
                        <div
                          key={idx}
                          className="meal-item"
                          onClick={() =>
                            meal.recipeId && handleRecipeClick(meal.recipeId)
                          }
                          style={{
                            cursor: meal.recipeId ? "pointer" : "default",
                          }}
                        >
                          <img
                            src={
                              meal.imageUrl ||
                              "https://placehold.co/80x80/E5E7EB/6B7280?text=Food"
                            }
                            alt={meal.name}
                            className="meal-image"
                            onError={(e) =>
                              (e.target.src =
                                "https://placehold.co/80x80/E5E7EB/6B7280?text=Food")
                            }
                          />
                          <div className="meal-info">
                            <h3>{meal.name}</h3>
                            <p className="meal-serving">1 serving</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side - Nutrition */}
            <div className="nutrition-section">
              <h2>Nutrition</h2>
              <div className="nutrition-chart">
                <svg viewBox="0 0 100 100" className="pie-chart">
                  {(() => {
                    const currentAngleRef = { current: 0 };
                    const total = macroData.total;

                    if (total === 0)
                      return (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="var(--color-bg-container)"
                        />
                      );

                    return macroData.macros.map((macro) => {
                      const percentage = (macro.value / total) * 100;
                      return createSlice(percentage, macro.color, currentAngleRef);
                    });
                  })()}
                </svg>
                <div className="nutrition-legend">
                  {macroData.macros.map((macro) => (
                    <div className="legend-item" key={macro.name}>
                      <span
                        className="legend-color"
                        style={{ backgroundColor: macro.color }}
                      ></span>
                      <span>{macro.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="nutrition-details">
                <div className="nutrition-row">
                  <span>Calories</span>
                  <strong>
                    {Math.round(mealPlanData.totalCalories || 0)} /{" "}
                    {mealPlanData.targetCalories || 0}
                  </strong>
                </div>
                <div className="nutrition-row">
                  <span>Carbs</span>
                  <strong>
                    {Math.round(mealPlanData.totalMacros?.carbs || 0)}g
                  </strong>
                </div>
                <div className="nutrition-row">
                  <span>Fat</span>
                  <strong>
                    {Math.round(mealPlanData.totalMacros?.fat || 0)}g
                  </strong>
                </div>
                <div className="nutrition-row">
                  <span>Protein</span>
                  <strong>
                    {Math.round(mealPlanData.totalMacros?.protein || 0)}g
                  </strong>
                </div>
              </div>

              <button className="btn-details">Detailed Nutrition Information</button>
            </div>
          </div>
        )}

        {/* Ingredients List */}
        {mealPlanData && getAllIngredients.length > 0 && (
          <div className="ingredients-section">
            <div className="ingredients-header">
              <h2>📋 Danh sách nguyên liệu</h2>
              <p>Nguyên liệu cần chuẩn bị cho cả tuần</p>
              <button className="btn-add-to-list">In danh sách</button>
            </div>
            <div className="ingredients-grid">
              {getAllIngredients.map((ingredient, idx) => (
                <div key={idx} className="ingredient-item">
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-amount">{ingredient.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
