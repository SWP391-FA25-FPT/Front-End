import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Input, Button, Upload, Spin, Alert } from "antd";
import { Icon } from "@iconify/react";
import SettingLayout from "../components/layout/SettingLayout";
import { getRecipeById, updateRecipe } from "../apis/recipe";
import { useAuth } from "../context/useAuth";
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
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState([{ description: "", image: null }]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

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
      setIngredients(
        data.ingredients && data.ingredients.length > 0
          ? data.ingredients
          : [{ name: "", amount: "" }]
      );
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
    } catch (err) {
      console.error("Fetch recipe error:", err);
      setError(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!recipeName.trim()) {
      message.error("Vui lòng nhập tên món");
      return;
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() && ing.amount.trim()
    );
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
      formData.append("nutrition", JSON.stringify({}));
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
              <div className="ingredients-list">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <Input
                      placeholder="Tên nguyên liệu"
                      value={ingredient.name}
                      onChange={(e) =>
                        updateIngredient(index, "name", e.target.value)
                      }
                      style={{ marginBottom: "8px" }}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Input
                        placeholder="Số lượng"
                        value={ingredient.amount}
                        onChange={(e) =>
                          updateIngredient(index, "amount", e.target.value)
                        }
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
                        onChange={(e) =>
                          updateStep(index, "description", e.target.value)
                        }
                        rows={3}
                        style={{ marginBottom: "12px" }}
                      />

                      <div className="step-image-upload">
                        {step.imagePreview ? (
                          <div className="step-image-preview">
                            <img
                              src={step.imagePreview}
                              alt={`Bước ${index + 1}`}
                            />
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

export default RecipeUpdate;
