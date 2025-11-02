import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message, Input, Button, Upload, Spin } from "antd";
import { Icon } from "@iconify/react";
import SettingLayout from "../components/layout/SettingLayout";
import { createRecipe, getRecipeById, updateRecipe } from "../apis/recipe";
import { calculateNutrition as calcNutritionApi } from "../apis/nutrition";
import IngredientsForm from "../components/Recipe/IngredientsForm";
import NutritionInfo from "../components/Recipe/NutritionInfo";
import StepsForm from "../components/Recipe/StepsForm";
import { convertNutritionFormat, getIngredientTexts } from "../utils/nutritionHelper";
import "./style/RecipeCreate.css";

const { TextArea } = Input;

const RecipeCreate = () => {
  const navigate = useNavigate();
  const { draftId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [currentDraftId, setCurrentDraftId] = useState(draftId || null);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [servings, setServings] = useState(2);
  const [ingredients, setIngredients] = useState([
    { text: "" } // Lưu nguyên liệu dạng text như "250g bột"
  ]);
  const [steps, setSteps] = useState([
    { description: "", image: null }
  ]);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null); // Format: { calories, protein, carbs, fat, fiber, sugar }
  const nutritionDebounceRef = useRef(null);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const autosaveIntervalRef = useRef(null);
  const isInitializingRef = useRef(false); // Prevent duplicate draft creation

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

  // Initialize draft on mount
  useEffect(() => {
    // Prevent duplicate initialization only when creating new draft (no draftId)
    if (!draftId && isInitializingRef.current) return;
    
    const initializeDraft = async () => {
      // Mark as initializing only when creating new draft
      if (!draftId) {
        isInitializingRef.current = true;
      }
      
      try {
        if (draftId) {
          // Load existing draft
          const response = await getRecipeById(draftId);
          const draft = response.data;
          
          // Populate form with draft data
          setRecipeName(draft.name || "");
          setDescription(draft.description || "");
          setTotalTime(draft.totalTime || "");
          setServings(draft.servings || 2);
          // Convert từ backend format (name + amount) sang text format
          const backendIngredients = draft.ingredients && draft.ingredients.length > 0 
            ? draft.ingredients 
            : [];
          const textIngredients = backendIngredients.map(ing => {
            const text = [ing.amount, ing.name].filter(Boolean).join(" ").trim();
            return { text: text || "" };
          });
          setIngredients(textIngredients.length > 0 ? textIngredients : [{ text: "" }]);
          setSteps(draft.steps && draft.steps.length > 0 ? draft.steps : [{ description: "", image: null }]);
          setMainImagePreview(draft.image || null);
          setCurrentDraftId(draftId);
          // Load nutrition if exists
          if (draft.nutrition && Object.keys(draft.nutrition).length > 0) {
            setNutrition(draft.nutrition);
          }
        } else {
          // Create new draft
          const formData = new FormData();
          formData.append("name", "Món mới");
          formData.append("description", "");
          formData.append("totalTime", "");
          formData.append("servings", "2");
          formData.append("tags", JSON.stringify([]));
          formData.append("ingredients", JSON.stringify([]));
          formData.append("steps", JSON.stringify([]));
          formData.append("nutrition", JSON.stringify({}));
          formData.append("tips", JSON.stringify([]));
          formData.append("status", "draft");

          const response = await createRecipe(formData);
          const newDraftId = response.data._id;
          setCurrentDraftId(newDraftId);
          
          // Navigate to the draft URL
          navigate(`/recipe/create/${newDraftId}`, { replace: true });
        }
      } catch (error) {
        console.error("Initialize draft error:", error);
        message.error("Lỗi khi khởi tạo draft");
        isInitializingRef.current = false; // Reset on error
      } finally {
        setInitializing(false);
      }
    };

    initializeDraft();

    // Cleanup autosave interval on unmount
    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, [draftId, navigate]);

  const handleAutosave = useCallback(async () => {
    if (!currentDraftId) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", recipeName || "Món mới");
      formData.append("description", description || "");
      formData.append("totalTime", totalTime || "");
      formData.append("servings", servings);
      
      // Convert ingredients to backend format - allow empty array for draft
      const backendIngredients = ingredients
        .filter(ing => ing.text && ing.text.trim())
        .map(ing => parseIngredientText(ing.text));
      // Always send ingredients, even if empty (for draft)
      formData.append("ingredients", JSON.stringify(backendIngredients));
      
      // Convert steps - allow empty steps for draft (preserve all steps even if empty)
      // For draft, we allow empty steps to be saved
      const stepsToSave = steps.map(s => ({ 
        description: s.description || "" 
      }));
      formData.append("steps", JSON.stringify(stepsToSave));
      
      formData.append("tags", JSON.stringify([]));
      formData.append("nutrition", JSON.stringify(nutrition || {}));
      formData.append("tips", JSON.stringify([]));
      formData.append("status", "draft");

      // Main image
      if (mainImage) {
        formData.append("image", mainImage);
      }

      // Step images - only add if step has imageFile
      steps.forEach((step) => {
        if (step.imageFile) {
          formData.append("stepImages", step.imageFile);
        }
      });

      await updateRecipe(currentDraftId, formData);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Autosave error:", error);
      throw error; // Re-throw để handleSaveDraft có thể catch
    } finally {
      setSaving(false);
    }
  }, [currentDraftId, recipeName, description, totalTime, servings, ingredients, steps, mainImage, nutrition]);

  // Autosave logic
  useEffect(() => {
    if (!currentDraftId || initializing) return;

    // Start autosave interval (30 seconds)
    autosaveIntervalRef.current = setInterval(() => {
      handleAutosave();
    }, 30000); // 30 seconds

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, [currentDraftId, initializing, handleAutosave]);

  // Publish recipe (validate fully)
  const handlePublish = async () => {
    // Validate tên món
    if (!recipeName.trim()) {
      message.error("Vui lòng nhập tên món");
      return;
    }

    // Validate mô tả
    if (!description.trim()) {
      message.error("Vui lòng nhập mô tả món ăn");
      return;
    }

    // Validate ảnh chính
    if (!mainImage && !mainImagePreview) {
      message.error("Vui lòng upload ảnh chính cho công thức");
      return;
    }

    // Validate nguyên liệu
    const validIngredients = getIngredientsForBackend().filter(ing => ing.name.trim());
    if (validIngredients.length === 0) {
      message.error("Vui lòng thêm ít nhất 1 nguyên liệu");
      return;
    }

    // Validate các bước
    const validSteps = steps.filter(step => step.description.trim());
    if (validSteps.length === 0) {
      message.error("Vui lòng thêm ít nhất 1 bước thực hiện");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", recipeName);
      formData.append("description", description);
      formData.append("totalTime", totalTime || "30 phút");
      formData.append("servings", servings);
      formData.append("ingredients", JSON.stringify(validIngredients));
      formData.append("steps", JSON.stringify(validSteps.map(s => ({ description: s.description }))));
      formData.append("tags", JSON.stringify([]));
      formData.append("nutrition", JSON.stringify(nutrition || {}));
      formData.append("tips", JSON.stringify([]));
      formData.append("status", "published");

      // Main image
      if (mainImage) {
        formData.append("image", mainImage);
      }

      validSteps.forEach((step) => {
        if (step.imageFile) {
          formData.append("stepImages", step.imageFile);
        }
      });

      await updateRecipe(currentDraftId, formData);
      message.success("Đã lên sóng công thức!");
      navigate(`/recipe/${currentDraftId}`);
    } catch (error) {
      console.error("Publish recipe error:", error);
      const errorMessage = error.message || error.error || "Lỗi khi lên sóng công thức. Vui lòng thử lại!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Save draft and close (no validation)
  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      
      // Stop autosave interval to prevent race condition
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
      
      // Ensure we have a draft before saving
      if (!currentDraftId) {
        message.error("Chưa có draft để lưu");
        setLoading(false);
        return;
      }
      
      // Wait for any ongoing autosave to complete
      // Then save with current data
      await handleAutosave();
      
      message.success("Đã lưu nháp");
      
      // Small delay to ensure save completes before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate("/my-recipes/drafts");
    } catch (error) {
      console.error("Save draft error:", error);
      message.error("Lỗi khi lưu nháp");
      
      // Restart autosave interval on error
      if (currentDraftId && !initializing) {
        autosaveIntervalRef.current = setInterval(() => {
          handleAutosave();
        }, 30000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    navigate("/my-recipes/drafts");
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

  if (initializing) {
    return (
      <SettingLayout hideUserActions={true}>
        <div className="recipe-create-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Đang khởi tạo..." />
        </div>
      </SettingLayout>
    );
  }

  return (
    <SettingLayout hideUserActions={true}>
      <div className="recipe-create-container">
        {/* Autosave Indicator */}
        <div className="autosave-indicator">
          {saving ? (
            <>
              <Icon icon="mdi:loading" className="spin-icon" />
              <span>Đang lưu...</span>
            </>
          ) : lastSaved ? (
            <>
              <Icon icon="mdi:check-circle" style={{ color: '#52c41a' }} />
              <span>Đã lưu lúc {lastSaved.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
            </>
          ) : null}
        </div>

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
                  <Button size="small" onClick={() => setServings(Math.max(1, servings - 1))}>-</Button>
                  <span>{servings} người</span>
                  <Button size="small" onClick={() => setServings(servings + 1)}>+</Button>
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
                icon={<Icon icon="mdi:delete" />}
              >
                Xóa
              </Button>
              <Button 
                onClick={handleSaveDraft}
                icon={<Icon icon="mdi:content-save" />}
              >
                Lưu và Đóng
              </Button>
              <Button 
                type="primary" 
                className="btn-publish"
                onClick={handlePublish}
                loading={loading}
              >
                Lên sóng
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

export default RecipeCreate;

