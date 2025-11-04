import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Input, Button, Upload, Spin, Alert } from "antd";
import { Icon } from "@iconify/react";
import SettingLayout from "../components/layout/SettingLayout";
import { getRecipeById, updateRecipe } from "../apis/recipe";
import { calculateNutrition as calcNutritionApi } from "../apis/nutrition";
import { useAuth } from "../context/useAuth";
import IngredientsForm from "../components/Recipe/IngredientsForm";
import NutritionInfo from "../components/Recipe/NutritionInfo";
import StepsForm from "../components/Recipe/StepsForm";
import { convertNutritionFormat, getIngredientTexts } from "../utils/nutritionHelper";
import "../pages/style/RecipeCreate.css";

const { TextArea } = Input;

const RecipeUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [servings, setServings] = useState(2);
  const [ingredients, setIngredients] = useState([
    { text: "" } // Lưu nguyên liệu dạng text như "250g bột"
  ]);
  const [steps, setSteps] = useState([{ description: "", image: null }]);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null); // Format: { calories, protein, carbs, fat, fiber, sugar }
  const nutritionDebounceRef = useRef(null);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  // Parse ingredient text thành name và amount
  const parseIngredientText = (text) => {
    if (!text || !text.trim()) {
      return { name: "", amount: "" };
    }
    
    // Thử parse theo format: "250g bột" hoặc "100ml nước"
    const match = text.trim().match(/^(\d+[/,.]?\d*\s*(?:kg|g|gram|gr|l|ml|tsp|tbsp|cup|viên|quả|cái|trái)?)\s+(.+)$/i);
    if (match) {
      return {
        name: match[2].trim(),
        amount: match[1].trim()
      };
    }
    
    // Nếu không parse được, coi toàn bộ là name, amount rỗng
    return {
      name: text.trim(),
      amount: ""
    };
  };

  // Convert ingredients từ text sang format backend (name + amount)
  const getIngredientsForBackend = () => {
    return ingredients
      .filter(ing => ing.text && ing.text.trim())
      .map(ing => parseIngredientText(ing.text));
  };

  useEffect(() => {
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecipeById(id);

      // Check ownership
      if (!user) {
        setError("Vui lòng đăng nhập");
        return;
      }

      const isOwner = response.data.authorId === user._id;
      const isAdmin = user.role === "admin";

      if (!isOwner && !isAdmin) {
        setError("Bạn không có quyền chỉnh sửa công thức này");
        return;
      }

      // Set form data
      const data = response.data;
      setRecipeName(data.name || "");
      setDescription(data.description || "");
      setTotalTime(data.totalTime || "");
      setServings(data.servings || 2);
      // Convert từ backend format (name + amount) sang text format
      const backendIngredients = data.ingredients && data.ingredients.length > 0 
        ? data.ingredients 
        : [];
      const textIngredients = backendIngredients.map(ing => {
        const text = [ing.amount, ing.name].filter(Boolean).join(" ").trim();
        return { text: text || "" };
      });
      setIngredients(textIngredients.length > 0 ? textIngredients : [{ text: "" }]);
      setSteps(
        data.steps && data.steps.length > 0
          ? data.steps.map((s) => ({
              description: s.description,
              image: s.image,
              imagePreview: s.image,
            }))
          : [{ description: "", image: null }]
      );
      setMainImagePreview(data.image || null);
      // Load nutrition if exists
      if (data.nutrition && Object.keys(data.nutrition).length > 0) {
        // Convert backend nutrition format to frontend format
        const convertedNutrition = convertNutritionFormat(data.nutrition);
        if (convertedNutrition) {
          setNutrition(convertedNutrition);
        }
      }
    } catch (err) {
      console.error("Fetch recipe error:", err);
      setError(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  // Ingredients handlers
  const handleIngredientsChange = (newIngredients) => {
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { text: "" }]);
  };

  const addIngredientSection = () => {
    // Thêm một phần mới (section) - có thể thêm separator hoặc title
    setIngredients([...ingredients, { text: "", isSection: true }]);
  };

  // Steps handlers
  const addStep = () => {
    setSteps([...steps, { description: "", image: null }]);
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const updateStepImage = (index, file) => {
    const newSteps = [...steps];
    newSteps[index].imageFile = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newSteps[index].imagePreview = e.target.result;
        setSteps([...newSteps]);
      };
      reader.readAsDataURL(file);
    } else {
      // Clear preview when file is removed
      newSteps[index].imagePreview = null;
      setSteps(newSteps);
    }
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // Main image upload
  const handleMainImageUpload = (file) => {
    setMainImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setMainImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSubmit = async () => {
    if (!recipeName.trim()) {
      message.error("Vui lòng nhập tên món");
      return;
    }

    // Validate nguyên liệu
    const validIngredients = getIngredientsForBackend().filter(ing => ing.name.trim());
    if (validIngredients.length === 0) {
      message.error("Vui lòng thêm ít nhất 1 nguyên liệu");
      return;
    }

    const validSteps = steps.filter((step) => step.description.trim());
    if (validSteps.length === 0) {
      message.error("Vui lòng thêm ít nhất 1 bước thực hiện");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", recipeName);
      formData.append("description", description);
      formData.append("totalTime", totalTime || "30 phút");
      formData.append("servings", servings);
      formData.append("ingredients", JSON.stringify(validIngredients));
      formData.append(
        "steps",
        JSON.stringify(validSteps.map((s) => ({ description: s.description })))
      );
      formData.append("tags", JSON.stringify([]));
      formData.append("nutrition", JSON.stringify(nutrition || {}));
      formData.append("tips", JSON.stringify([]));

      // Main image
      if (mainImage) {
        formData.append("image", mainImage);
      }

      validSteps.forEach((step) => {
        if (step.imageFile) {
          formData.append("stepImages", step.imageFile);
        }
      });

      await updateRecipe(id, formData);
      message.success("Cập nhật công thức thành công!");
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Update recipe error:", error);
      message.error(error.message || "Lỗi khi cập nhật công thức");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    navigate(`/recipe/${id}`);
  };

  // Auto-update nutrition when ingredients change
  useEffect(() => {
    // Clear previous timeout
    if (nutritionDebounceRef.current) {
      clearTimeout(nutritionDebounceRef.current);
    }

    // Extract ingredient texts
    const ingredientTexts = getIngredientTexts(ingredients);
    
    // Only calculate if there's at least one ingredient with text
    if (ingredientTexts.length === 0) {
      setNutrition(null);
      return;
    }

    // Debounce nutrition calculation
    nutritionDebounceRef.current = setTimeout(async () => {
      try {
        setNutritionLoading(true);
        const data = await calcNutritionApi(ingredientTexts);
        if (data && !data.error && data.totals) {
          // Convert backend format to frontend format
          const convertedNutrition = convertNutritionFormat(data.totals);
          setNutrition(convertedNutrition);
        } else {
          setNutrition(null);
        }
      } catch (err) {
        console.error("Error calculating nutrition:", err);
        setNutrition(null);
      } finally {
        setNutritionLoading(false);
      }
    }, 800); // 800ms debounce

    // Cleanup timeout on unmount or when ingredients change
    return () => {
      if (nutritionDebounceRef.current) {
        clearTimeout(nutritionDebounceRef.current);
      }
    };
  }, [ingredients]);

  if (loading) {
    return (
      <SettingLayout>
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <Spin size="large" tip="Đang tải công thức..." />
        </div>
      </SettingLayout>
    );
  }

  if (error) {
    return (
      <SettingLayout>
        <div
          style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}
        >
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
    <SettingLayout hideUserActions={true}>
      <div className="recipe-create-container">
        {/* Row 1: Image + Content */}
        <div className="recipe-create-top-section">
          {/* Left: Main Image Upload */}
          <div className="recipe-create-image-column">
            {mainImagePreview ? (
              <div className="main-image-preview">
                <img src={mainImagePreview} alt="Món ăn" />
                <Button
                  danger
                  icon={<Icon icon="mdi:close" />}
                  onClick={() => {
                    setMainImage(null);
                    setMainImagePreview(null);
                  }}
                  className="remove-main-image-btn"
                >
                  Xóa ảnh
                </Button>
              </div>
            ) : (
              <Upload
                beforeUpload={handleMainImageUpload}
                showUploadList={false}
              >
                <div className="main-image-upload-placeholder">
                  <Icon icon="mdi:camera" width="48" />
                  <p>Nhấn để tải ảnh món ăn lên</p>
                </div>
              </Upload>
            )}
          </div>

          {/* Right: Content */}
          <div className="recipe-create-info-column">
            {/* Recipe Name */}
            <Input
              placeholder="Tên món: Món canh bí ngon nhất nhà mình"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="recipe-name-input"
              size="large"
            />

            {/* Recipe Description */}
            <TextArea
              placeholder="Bạn đã nấu hình món này ở đây chưa? Hãy chia sẻ với mọi người về món nấu của bạn nhé - ai đã truyền cảm hứng cho bạn, tại sao nó đặc biệt, bạn thích thưởng thức nó như thế nào? Dùng ký tự @ để cập đến ai đó."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="recipe-description-input"
            />

            {/* Meta Info */}
            <div className="recipe-meta-row">
              <div className="meta-input-group">
                <label>Khẩu phần</label>
                <div className="servings-buttons">
                  <Button
                    size="small"
                    onClick={() => setServings(Math.max(1, servings - 1))}
                  >
                    -
                  </Button>
                  <span>{servings} người</span>
                  <Button
                    size="small"
                    onClick={() => setServings(servings + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="meta-input-group">
                <label>Thời gian</label>
                <Input
                  placeholder="30 phút"
                  value={totalTime}
                  onChange={(e) => setTotalTime(e.target.value)}
                  style={{ width: "120px" }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="header-actions">
              <Button
                danger
                onClick={handleDelete}
                icon={<Icon icon="mdi:close" />}
              >
                Hủy
              </Button>

              <Button
                type="primary"
                className="btn-publish"
                onClick={handleSubmit}
                loading={submitting}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </div>

        <div className="divider-section"></div>

        {/* Row 2: Ingredients + Steps */}
        <div className="recipe-create-main-content">
          {/* Left Column - Ingredients */}
          <div className="recipe-create-ingredients-column">
            <div className="section-card">
              <h3>Nguyên Liệu</h3>
              {nutritionLoading && (
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", color: "#666" }}>
                  <Spin size="small" />
                  <span>Đang tính dinh dưỡng...</span>
                </div>
              )}
              <IngredientsForm
                ingredients={ingredients}
                onIngredientsChange={handleIngredientsChange}
                onAddIngredient={addIngredient}
                onAddSection={addIngredientSection}
              />
              
              {/* Nutrition Info */}
              {nutrition && (
                <div style={{ marginTop: "24px" }}>
                  <NutritionInfo nutrition={nutrition} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Steps */}
          <div className="recipe-create-steps-column">
            <StepsForm
              steps={steps}
              onUpdateStep={updateStep}
              onUpdateStepImage={updateStepImage}
              onRemoveStep={removeStep}
              onAddStep={addStep}
            />
          </div>
        </div>
      </div>
    </SettingLayout>
  );
};

export default RecipeUpdate;
