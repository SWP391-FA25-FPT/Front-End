import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Select,
  Space,
  Card,
  message,
  Row,
  Col,
  Divider
} from "antd";
import { Icon } from "@iconify/react";
import "./Recipe.css";

const { TextArea } = Input;
const { Option } = Select;

const RecipeForm = ({ initialData, onSubmit, isLoading, mode = "create" }) => {
  const [form] = Form.useForm();
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(initialData?.image || null);
  const [stepImages, setStepImages] = useState([]);
  const [ingredients, setIngredients] = useState(initialData?.ingredients || [{ name: "", amount: "" }]);
  const [steps, setSteps] = useState(initialData?.steps || [{ description: "", image: null }]);
  const [tips, setTips] = useState(initialData?.tips || [""]);

  // Common tag options
  const commonTags = [
    "Món chính", "Món phụ", "Món tráng miệng", "Đồ uống",
    "Ăn sáng", "Ăn trưa", "Ăn tối", "Ăn vặt",
    "Món Việt", "Món Á", "Món Âu", "Món Hàn", "Món Nhật",
    "Chay", "Eat Clean", "Low Carb", "Keto",
    "Dễ làm", "Nhanh gọn", "Tiết kiệm"
  ];

  useEffect(() => {
    if (initialData && mode === "update") {
      form.setFieldsValue({
        name: initialData.name,
        description: initialData.description,
        totalTime: initialData.totalTime,
        servings: initialData.servings,
        tags: initialData.tags || [],
        calories: initialData.nutrition?.calories,
        protein: initialData.nutrition?.protein,
        carbs: initialData.nutrition?.carbs,
        fat: initialData.nutrition?.fat,
        fiber: initialData.nutrition?.fiber,
        sugar: initialData.nutrition?.sugar,
      });
      setIngredients(initialData.ingredients || [{ name: "", amount: "" }]);
      setSteps(initialData.steps || [{ description: "", image: null }]);
      setTips(initialData.tips || [""]);
    }
  }, [initialData, mode, form]);

  // Ingredients handlers
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients.length > 0 ? newIngredients : [{ name: "", amount: "" }]);
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Steps handlers
  const addStep = () => {
    setSteps([...steps, { description: "", image: null }]);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps.length > 0 ? newSteps : [{ description: "", image: null }]);
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const updateStepImage = (index, file) => {
    const newSteps = [...steps];
    newSteps[index].imageFile = file;
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newSteps[index].imagePreview = e.target.result;
        setSteps([...newSteps]);
      };
      reader.readAsDataURL(file);
    }
    setSteps(newSteps);
  };

  // Tips handlers
  const addTip = () => {
    setTips([...tips, ""]);
  };

  const removeTip = (index) => {
    const newTips = tips.filter((_, i) => i !== index);
    setTips(newTips.length > 0 ? newTips : [""]);
  };

  const updateTip = (index, value) => {
    const newTips = [...tips];
    newTips[index] = value;
    setTips(newTips);
  };

  // Main image upload
  const handleMainImageUpload = (file) => {
    setMainImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setMainImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    return false; // Prevent auto upload
  };

  // Form submit
  const handleSubmit = async (values) => {
    // Validate
    const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.amount.trim());
    if (validIngredients.length === 0) {
      message.error("Vui lòng thêm ít nhất 1 nguyên liệu");
      return;
    }

    const validSteps = steps.filter(step => step.description.trim());
    if (validSteps.length === 0) {
      message.error("Vui lòng thêm ít nhất 1 bước thực hiện");
      return;
    }

    if (!mainImage && !mainImagePreview) {
      message.error("Vui lòng upload ảnh chính cho công thức");
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("totalTime", values.totalTime || "");
    formData.append("servings", values.servings);
    formData.append("tags", JSON.stringify(values.tags || []));
    formData.append("ingredients", JSON.stringify(validIngredients));
    formData.append("steps", JSON.stringify(validSteps.map(s => ({ description: s.description }))));
    
    // Nutrition
    const nutrition = {
      calories: values.calories || 0,
      protein: values.protein || 0,
      carbs: values.carbs || 0,
      fat: values.fat || 0,
      fiber: values.fiber || 0,
      sugar: values.sugar || 0,
    };
    formData.append("nutrition", JSON.stringify(nutrition));

    // Tips
    const validTips = tips.filter(tip => tip.trim());
    formData.append("tips", JSON.stringify(validTips));

    // Main image
    if (mainImage) {
      formData.append("image", mainImage);
    }

    // Step images
    validSteps.forEach((step, index) => {
      if (step.imageFile) {
        formData.append("stepImages", step.imageFile);
      }
    });

    await onSubmit(formData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      {/* Basic Info */}
      <Card title="Thông tin cơ bản" style={{ marginBottom: "24px" }}>
        <Form.Item
          name="name"
          label="Tên món ăn"
          rules={[{ required: true, message: "Vui lòng nhập tên món ăn" }]}
        >
          <Input placeholder="Ví dụ: Phở bò Hà Nội" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <TextArea rows={4} placeholder="Mô tả ngắn về món ăn..." />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="totalTime" label="Thời gian">
              <Input placeholder="Ví dụ: 30 phút" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="servings"
              label="Số khẩu phần"
              rules={[{ required: true, message: "Vui lòng nhập số khẩu phần" }]}
            >
              <InputNumber min={1} placeholder="Ví dụ: 4" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="tags" label="Danh mục">
          <Select
            mode="tags"
            placeholder="Chọn hoặc nhập danh mục"
            style={{ width: "100%" }}
          >
            {commonTags.map(tag => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Main Image Upload */}
        <Form.Item label="Ảnh món ăn" required>
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={handleMainImageUpload}
            onRemove={() => {
              setMainImage(null);
              setMainImagePreview(null);
            }}
            defaultFileList={mainImagePreview ? [{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: mainImagePreview,
            }] : []}
          >
            {!mainImage && !mainImagePreview && (
              <div>
                <Icon icon="mdi:plus" width="32" />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Card>

      {/* Ingredients */}
      <Card title="Nguyên liệu" style={{ marginBottom: "24px" }}>
        {ingredients.map((ingredient, index) => (
          <Row key={index} gutter={16} style={{ marginBottom: "8px" }}>
            <Col xs={14} sm={16}>
              <Input
                placeholder="Tên nguyên liệu"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
              />
            </Col>
            <Col xs={8} sm={6}>
              <Input
                placeholder="Số lượng"
                value={ingredient.amount}
                onChange={(e) => updateIngredient(index, "amount", e.target.value)}
              />
            </Col>
            <Col xs={2} sm={2}>
              <Button
                danger
                icon={<Icon icon="mdi:delete" />}
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length === 1}
              />
            </Col>
          </Row>
        ))}
        <Button type="dashed" onClick={addIngredient} block icon={<Icon icon="mdi:plus" />}>
          Thêm nguyên liệu
        </Button>
      </Card>

      {/* Steps */}
      <Card title="Các bước thực hiện" style={{ marginBottom: "24px" }}>
        {steps.map((step, index) => (
          <div key={index} style={{ marginBottom: "16px", padding: "16px", border: "1px solid #f0f0f0", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong>Bước {index + 1}</strong>
              <Button
                danger
                size="small"
                icon={<Icon icon="mdi:delete" />}
                onClick={() => removeStep(index)}
                disabled={steps.length === 1}
              >
                Xóa
              </Button>
            </div>
            <TextArea
              rows={3}
              placeholder="Mô tả bước thực hiện..."
              value={step.description}
              onChange={(e) => updateStep(index, "description", e.target.value)}
              style={{ marginBottom: "8px" }}
            />
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                updateStepImage(index, file);
                return false;
              }}
              onRemove={() => updateStepImage(index, null)}
            >
              <Button icon={<Icon icon="mdi:image" />}>Upload ảnh (không bắt buộc)</Button>
            </Upload>
          </div>
        ))}
        <Button type="dashed" onClick={addStep} block icon={<Icon icon="mdi:plus" />}>
          Thêm bước
        </Button>
      </Card>

      {/* Nutrition */}
      <Card title="Thông tin dinh dưỡng (không bắt buộc)" style={{ marginBottom: "24px" }}>
        <Row gutter={16}>
          <Col xs={12} sm={8}>
            <Form.Item name="calories" label="Calories (kcal)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8}>
            <Form.Item name="protein" label="Protein (g)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8}>
            <Form.Item name="carbs" label="Carbs (g)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8}>
            <Form.Item name="fat" label="Fat (g)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8}>
            <Form.Item name="fiber" label="Fiber (g)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8}>
            <Form.Item name="sugar" label="Sugar (g)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Tips */}
      <Card title="Mẹo nấu ăn (không bắt buộc)" style={{ marginBottom: "24px" }}>
        {tips.map((tip, index) => (
          <Row key={index} gutter={16} style={{ marginBottom: "8px" }}>
            <Col xs={22}>
              <Input
                placeholder="Nhập mẹo nấu ăn..."
                value={tip}
                onChange={(e) => updateTip(index, e.target.value)}
              />
            </Col>
            <Col xs={2}>
              <Button
                danger
                icon={<Icon icon="mdi:delete" />}
                onClick={() => removeTip(index)}
                disabled={tips.length === 1}
              />
            </Col>
          </Row>
        ))}
        <Button type="dashed" onClick={addTip} block icon={<Icon icon="mdi:plus" />}>
          Thêm mẹo
        </Button>
      </Card>

      {/* Submit Buttons */}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" size="large" loading={isLoading}>
            {mode === "create" ? "Tạo công thức" : "Cập nhật công thức"}
          </Button>
          <Button size="large" onClick={() => window.history.back()}>
            Hủy
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RecipeForm;

