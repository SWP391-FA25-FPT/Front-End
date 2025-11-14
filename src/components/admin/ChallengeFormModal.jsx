import React, { useState, useEffect } from "react";
import { createChallenge, updateChallenge } from "../../apis/challenge";
import ChallengeFormFields from "./ChallengeFormFields";
import { message } from "antd";
import "../../pages/style/ChallengeFormModal.css";

export default function ChallengeFormModal({ challenge, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    hostName: "",
    hostAvatar: "",
    prizes: [],
    prizeDetails: { note: "", items: "" },
    hashtags: [],
    requirements: [],
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (challenge) {
      // Format dates for input
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Format time for input
      const formatTimeForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      setFormData({
        title: challenge.title || "",
        description: challenge.description || "",
        category: challenge.category || "",
        startDate: formatDateForInput(challenge.startDate),
        startTime: formatTimeForInput(challenge.startDate),
        endDate: formatDateForInput(challenge.endDate),
        endTime: formatTimeForInput(challenge.endDate),
        hostName: challenge.host?.name || "",
        hostAvatar: challenge.host?.avatar || "",
        prizes: challenge.prizes || [],
        prizeDetails: challenge.prizeDetails || { note: "", items: "" },
        hashtags: challenge.hashtags || [],
        requirements: challenge.requirements || [],
        image: null,
      });
    }
  }, [challenge]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Danh mục là bắt buộc";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    }

    if (formData.startDate && formData.endDate) {
      // Combine date and time for comparison
      const startDateTime = formData.startTime 
        ? `${formData.startDate}T${formData.startTime}:00`
        : `${formData.startDate}T00:00:00`;
      const endDateTime = formData.endTime 
        ? `${formData.endDate}T${formData.endTime}:00`
        : `${formData.endDate}T23:59:59`;
      
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      if (start >= end) {
        newErrors.endDate = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      
      // Combine date and time for startDate
      const startDateTime = formData.startTime 
        ? `${formData.startDate}T${formData.startTime}:00`
        : `${formData.startDate}T00:00:00`;
      formDataToSend.append("startDate", startDateTime);
      
      // Combine date and time for endDate
      const endDateTime = formData.endTime 
        ? `${formData.endDate}T${formData.endTime}:00`
        : `${formData.endDate}T23:59:59`;
      formDataToSend.append("endDate", endDateTime);
      formDataToSend.append("hostName", formData.hostName);
      formDataToSend.append("hostAvatar", formData.hostAvatar);
      formDataToSend.append("prizes", JSON.stringify(formData.prizes));
      formDataToSend.append(
        "prizeDetails",
        JSON.stringify(formData.prizeDetails)
      );
      formDataToSend.append("hashtags", JSON.stringify(formData.hashtags));
      formDataToSend.append(
        "requirements",
        JSON.stringify(formData.requirements)
      );

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (challenge) {
        await updateChallenge(challenge._id, formDataToSend);
        message.success("Cập nhật thử thách thành công!");
      } else {
        await createChallenge(formDataToSend);
        message.success("Tạo thử thách thành công!");
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving challenge:", err);
      message.error(err.message || "Lỗi khi lưu thử thách");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {challenge ? "Sửa Thử Thách" : "Tạo Thử Thách Mới"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body challenge-form-modal-body">
              <ChallengeFormFields
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                challenge={challenge}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Đang lưu..."
                  : challenge
                  ? "Cập nhật"
                  : "Tạo mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

