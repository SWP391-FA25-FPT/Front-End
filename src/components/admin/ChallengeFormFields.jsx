import React from "react";
import ChallengePrizeFields from "./ChallengePrizeFields";
import ChallengeRequirementFields from "./ChallengeRequirementFields";

export default function ChallengeFormFields({
  formData,
  setFormData,
  errors,
  challenge,
}) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleHashtagAdd = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !formData.hashtags.includes(value)) {
        setFormData({
          ...formData,
          hashtags: [...formData.hashtags, value],
        });
        e.target.value = "";
      }
    }
  };

  const handleHashtagRemove = (index) => {
    setFormData({
      ...formData,
      hashtags: formData.hashtags.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      {/* Basic Information */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Thông Tin Cơ Bản</h6>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">
            Tiêu đề <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Nhập tiêu đề thử thách"
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title}</div>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">
            Mô tả <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            rows="4"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Nhập mô tả chi tiết về thử thách"
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">
            Danh mục <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.category ? "is-invalid" : ""}`}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Chọn danh mục</option>
            <option value="Món Á">Món Á</option>
            <option value="Món Tây">Món Tây</option>
            <option value="Món tráng miệng">Món tráng miệng</option>
            <option value="Healthy">Healthy</option>
            <option value="Chay">Chay</option>
            <option value="Khác">Khác</option>
          </select>
          {errors.category && (
            <div className="invalid-feedback">{errors.category}</div>
          )}
        </div>

        {/* Image */}
        <div className="mb-3">
          <label className="form-label">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {challenge && challenge.image && !formData.image && (
            <div className="mt-2">
              <img
                src={challenge.image}
                alt="Current"
                style={{
                  maxWidth: "200px",
                  maxHeight: "150px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}
          {formData.image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                style={{
                  maxWidth: "200px",
                  maxHeight: "150px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Thời Gian</h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Ngày bắt đầu <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            {errors.startDate && (
              <div className="invalid-feedback">{errors.startDate}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Ngày kết thúc <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
            {errors.endDate && (
              <div className="invalid-feedback">{errors.endDate}</div>
            )}
          </div>
        </div>
      </div>

      {/* Host Information */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Thông Tin Người Tổ Chức</h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Tên người tổ chức</label>
            <input
              type="text"
              className="form-control"
              value={formData.hostName}
              onChange={(e) =>
                setFormData({ ...formData, hostName: e.target.value })
              }
              placeholder="Tên người tổ chức"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Avatar URL</label>
            <input
              type="text"
              className="form-control"
              value={formData.hostAvatar}
              onChange={(e) =>
                setFormData({ ...formData, hostAvatar: e.target.value })
              }
              placeholder="URL avatar"
            />
          </div>
        </div>
      </div>

      {/* Prizes */}
      <div className="mb-4">
        <ChallengePrizeFields
          prizes={formData.prizes}
          prizeDetails={formData.prizeDetails}
          setFormData={setFormData}
        />
      </div>

      {/* Requirements */}
      <div className="mb-4">
        <ChallengeRequirementFields
          requirements={formData.requirements}
          setFormData={setFormData}
        />
      </div>

      {/* Hashtags */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Hashtags</h6>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập hashtag và nhấn Enter"
            onKeyPress={handleHashtagAdd}
          />
        </div>
        <div className="d-flex flex-wrap gap-2">
          {formData.hashtags.map((tag, index) => (
            <span
              key={index}
              className="badge bg-primary d-flex align-items-center gap-2"
            >
              #{tag}
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ fontSize: "0.7rem" }}
                onClick={() => handleHashtagRemove(index)}
              ></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

