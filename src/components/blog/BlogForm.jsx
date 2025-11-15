import React from "react";
import { Input, Upload, Select, Switch } from "antd";
import { Icon } from "@iconify/react";

const { TextArea } = Input;
const { Option } = Select;

const BlogForm = ({
  title,
  setTitle,
  excerpt,
  setExcerpt,
  content,
  setContent,
  category,
  setCategory,
  tags,
  setTags,
  published,
  setPublished,
  mainImage,
  setMainImage,
  mainImagePreview,
  setMainImagePreview,
  relatedRecipes,
  setRelatedRecipes,
  availableRecipes,
  loadingRecipes,
}) => {
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

  const categories = [
    "Dinh dưỡng",
    "Sức khỏe",
    "Thực đơn",
    "Mẹo vặt",
    "Review sản phẩm",
    "Giảm cân",
    "Tăng cân",
    "Phòng chống bệnh",
    "Khác",
  ];

  return (
    <div className="recipe-form-container">
      {/* Main Image Upload */}
      <div className="form-section">
        <label className="form-label">
          <Icon icon="mdi:image-outline" width="20" /> Ảnh bìa
        </label>
        <Upload
          accept="image/*"
          beforeUpload={handleMainImageUpload}
          showUploadList={false}
          className="image-uploader"
        >
          <div className="upload-area">
            {mainImagePreview ? (
              <img
                src={mainImagePreview}
                alt="Preview"
                className="preview-image"
              />
            ) : (
              <div className="upload-placeholder">
                <Icon icon="mdi:plus" width="48" />
                <p>Tải ảnh lên</p>
              </div>
            )}
          </div>
        </Upload>
      </div>

      {/* Title */}
      <div className="form-section">
        <label className="form-label">
          <Icon icon="mdi:text" width="20" /> Tiêu đề *
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề blog..."
          size="large"
        />
      </div>

      {/* Excerpt */}
      <div className="form-section">
        <label className="form-label">
          <Icon icon="mdi:text-short" width="20" /> Tóm tắt
        </label>
        <TextArea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Nhập tóm tắt ngắn gọn..."
          rows={3}
          maxLength={200}
          showCount
        />
      </div>

      {/* Category */}
      <div className="form-section">
        <label className="form-label">
          <Icon icon="mdi:folder-outline" width="20" /> Danh mục
        </label>
        <Select
          value={category}
          onChange={setCategory}
          placeholder="Chọn danh mục..."
          size="large"
          style={{ width: "100%" }}
          allowClear
        >
          {categories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))}
        </Select>
      </div>

      {/* Tags */}
      <div className="form-section">
        <label className="form-label">
          <Icon icon="mdi:tag-outline" width="20" /> Tags
        </label>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Nhập tags (phân cách bằng dấu phẩy)..."
          size="large"
        />
      </div>

      {/* Related Recipes */}
      <div className="form-section">
        <label className="form-label">
          <Icon icon="mdi:book-open-outline" width="20" /> Công thức liên quan
        </label>
        <Select
          mode="multiple"
          value={relatedRecipes}
          onChange={setRelatedRecipes}
          placeholder="Chọn công thức liên quan..."
          size="large"
          style={{ width: "100%" }}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
          loading={loadingRecipes}
        >
          {availableRecipes.map((recipe) => (
            <Option key={recipe._id} value={recipe._id}>
              {recipe.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Content */}
      <div className="form-section">
        <label className="form-label">
          <Icon icon="mdi:file-document-outline" width="20" /> Nội dung *
        </label>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung blog..."
          rows={15}
        />
      </div>

      {/* Info: Blog cần admin duyệt */}
      <div className="form-section">
        <div style={{ 
          padding: "12px 16px", 
          background: "#E6F7FF", 
          border: "1px solid #91D5FF",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <Icon icon="mdi:information-outline" width="20" color="#1890FF" />
          <div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#1890FF", marginBottom: "4px" }}>
              Lưu ý về kiểm duyệt
            </div>
            <div style={{ fontSize: "13px", color: "#595959" }}>
              Blog của bạn sẽ được gửi để admin kiểm duyệt. Blog chỉ hiển thị công khai sau khi được admin duyệt.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
