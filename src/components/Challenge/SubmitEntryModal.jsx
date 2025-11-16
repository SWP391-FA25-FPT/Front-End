import React, { useState } from "react";
import { Modal, message, Upload, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { submitEntry } from "../../apis/challenge";

const { TextArea } = Input;

export default function SubmitEntryModal({ 
  challengeId, 
  visible, 
  onClose, 
  onSuccess 
}) {
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handleImageChange = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ cho phép upload file ảnh!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    return false; // Prevent auto upload
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      message.warning("Vui lòng upload ảnh");
      return;
    }

    if (!content.trim()) {
      message.warning("Vui lòng nhập cách nấu hoặc status");
      return;
    }

    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("content", content.trim());
      if (title.trim()) {
        formData.append("title", title.trim());
      }

      const response = await submitEntry(challengeId, formData);
      if (response.success) {
        message.success("Nộp bài thành công!");
        onSuccess();
        handleClose();
      }
    } catch (err) {
      console.error("Error submitting entry:", err);
      message.error(err.message || "Lỗi khi nộp bài");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setImageFile(null);
    setImagePreview(null);
    setContent("");
    setTitle("");
    onClose();
  };

  return (
    <Modal
      title="Nộp bài tham gia thử thách"
      open={visible}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Nộp bài"
      cancelText="Hủy"
      okButtonProps={{ 
        disabled: !imageFile || !content.trim() || submitting,
        loading: submitting 
      }}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <label className="form-label">Tiêu đề (tùy chọn)</label>
        <Input
          placeholder="Nhập tiêu đề cho bài nộp của bạn"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="form-label">Ảnh món ăn <span style={{ color: "red" }}>*</span></label>
        <Upload
          beforeUpload={handleImageChange}
          onRemove={handleRemoveImage}
          fileList={imageFile ? [imageFile] : []}
          accept="image/*"
          listType="picture-card"
          maxCount={1}
        >
          {!imagePreview && (
            <div>
              <UploadOutlined style={{ fontSize: 24 }} />
              <div style={{ marginTop: 8 }}>Upload ảnh</div>
            </div>
          )}
        </Upload>
        {imagePreview && (
          <div style={{ marginTop: 8 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "4px",
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label className="form-label">
          Chia sẻ cách nấu hoặc status <span style={{ color: "red" }}>*</span>
        </label>
        <TextArea
          rows={6}
          placeholder="Chia sẻ cách bạn nấu món này, bí quyết, hoặc cảm nhận của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          showCount
        />
      </div>
    </Modal>
  );
}
