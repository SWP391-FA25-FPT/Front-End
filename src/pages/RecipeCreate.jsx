import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message, Input, Button, Upload, Spin } from "antd";
import { Icon } from "@iconify/react";
import SettingLayout from "../components/layout/SettingLayout";
import { createRecipe, getRecipeById, updateRecipe } from "../apis/recipe";
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
    { name: "", amount: "" }
  ]);
  const [steps, setSteps] = useState([
    { description: "", image: null }
  ]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const autosaveIntervalRef = useRef(null);

  // Ingredients handlers
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
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
    const initializeDraft = async () => {
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
          setIngredients(draft.ingredients && draft.ingredients.length > 0 ? draft.ingredients : [{ name: "", amount: "" }]);
          setSteps(draft.steps && draft.steps.length > 0 ? draft.steps : [{ description: "", image: null }]);
          setMainImagePreview(draft.image || null);
          setCurrentDraftId(draftId);
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
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("steps", JSON.stringify(steps.map(s => ({ description: s.description }))));
      formData.append("tags", JSON.stringify([]));
      formData.append("nutrition", JSON.stringify({}));
      formData.append("tips", JSON.stringify([]));
      formData.append("status", "draft");

      // Main image
      if (mainImage) {
        formData.append("image", mainImage);
      }

      // Step images
      steps.forEach((step) => {
        if (step.imageFile) {
          formData.append("stepImages", step.imageFile);
        }
      });

      await updateRecipe(currentDraftId, formData);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Autosave error:", error);
    } finally {
      setSaving(false);
    }
  }, [currentDraftId, recipeName, description, totalTime, servings, ingredients, steps, mainImage]);

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
    const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.amount.trim());
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
      formData.append("nutrition", JSON.stringify({}));
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
      await handleAutosave();
      message.success("Đã lưu nháp");
      navigate("/my-recipes/drafts");
    } catch (error) {
      console.error("Save draft error:", error);
      message.error("Lỗi khi lưu nháp");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    navigate("/my-recipes/drafts");
  };

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
              <div className="ingredients-list">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <Input
                      placeholder="Tên nguyên liệu"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, "name", e.target.value)}
                      style={{ marginBottom: "8px" }}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Input
                        placeholder="Số lượng"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <Button 
                        danger 
                        icon={<Icon icon="mdi:delete" />}
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  type="dashed" 
                  onClick={addIngredient} 
                  block 
                  icon={<Icon icon="mdi:plus" />}
                  style={{ marginTop: "12px" }}
                >
                  Thêm nguyên liệu
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Steps */}
          <div className="recipe-create-steps-column">
            <div className="section-card">
              <h3>Các bước</h3>

              <div className="steps-list">
                {steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <TextArea
                        placeholder={`Trộn bột và nước đến khi đặc lại`}
                        value={step.description}
                        onChange={(e) => updateStep(index, "description", e.target.value)}
                        rows={3}
                        style={{ marginBottom: "12px" }}
                      />
                      
                      <div className="step-image-upload">
                        {step.imagePreview ? (
                          <div className="step-image-preview">
                            <img src={step.imagePreview} alt={`Bước ${index + 1}`} />
                            <Button 
                              danger 
                              size="small"
                              icon={<Icon icon="mdi:close" />}
                              onClick={() => updateStepImage(index, null)}
                              className="remove-image-btn"
                            />
                          </div>
                        ) : (
                          <Upload
                            beforeUpload={(file) => {
                              updateStepImage(index, file);
                              return false;
                            }}
                            showUploadList={false}
                          >
                            <div className="upload-placeholder">
                              <Icon icon="mdi:camera" width="32" />
                            </div>
                          </Upload>
                        )}
                      </div>

                      <Button 
                        danger
                        size="small"
                        icon={<Icon icon="mdi:delete" />}
                        onClick={() => removeStep(index)}
                        disabled={steps.length === 1}
                        style={{ marginTop: "8px" }}
                      >
                        Xóa bước
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="dashed" 
                  onClick={addStep}
                  block
                  icon={<Icon icon="mdi:plus" />}
                  className="add-step-btn"
                >
                  Thêm bước
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingLayout>
  );
};

export default RecipeCreate;

