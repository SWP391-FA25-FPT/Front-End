import React, { useState, useEffect } from "react";
import Guest from "../../assets/guest.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProfileForm = ({ userProfile, onProfileUpdate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profilePath = user?._id ? `/user/${user._id}` : "/";

  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    gender: "",
    weight: "",
    height: "",
    phone: "",
    email: "",
    workHabits: "",
    eatingHabits: "",
    diet: "",
    allergies: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    return () => {
      if (avatarFile && avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarFile, avatarPreview]);

  // Khi userProfile thay đổi → cập nhật form
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        birthdate: userProfile.profile?.age
          ? new Date(new Date().getFullYear() - userProfile.profile.age, 0, 1)
              .toISOString()
              .split("T")[0]
          : "2025-01-01",
        gender:
          userProfile.profile?.gender === "male"
            ? "Nam"
            : userProfile.profile?.gender === "female"
            ? "Nữ"
            : "Khác",
        weight: userProfile.profile?.weight || "",
        height: userProfile.profile?.height || "",
        phone: "",
        email: userProfile.email || "",
        workHabits: userProfile.profile?.workHabits || "",
        eatingHabits: userProfile.profile?.eatingHabits || "",
        diet: userProfile.profile?.diet || "",
        allergies: userProfile.profile?.allergies?.join(", ") || "",
      });
      setAvatarPreview(userProfile.profile?.profileImageUrl || Guest);
      setAvatarFile(null);
    }
  }, [userProfile]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Xử lý chọn ảnh mới
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setAvatarPreview(previewURL);
    setAvatarFile(file);
  };

  // Gửi form cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const profilePayload = {
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        gender:
          formData.gender === "Nam"
            ? "male"
            : formData.gender === "Nữ"
            ? "female"
            : "other",
        age: formData.birthdate
          ? new Date().getFullYear() -
            new Date(formData.birthdate).getFullYear()
          : undefined,
        workHabits: formData.workHabits || undefined,
        eatingHabits: formData.eatingHabits || undefined,
        diet: formData.diet || undefined,
        allergies: formData.allergies
          ? formData.allergies
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a)
          : undefined,
      };

      Object.keys(profilePayload).forEach((key) => {
        if (profilePayload[key] === undefined || profilePayload[key] === null) {
          delete profilePayload[key];
        }
      });

      const payload = new FormData();
      if (formData.name) {
        payload.append("name", formData.name);
      }
      if (Object.keys(profilePayload).length > 0) {
        payload.append("profile", JSON.stringify(profilePayload));
      }
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      const result = await onProfileUpdate(payload);

      if (result.success) {
        alert("Cập nhật thông tin thành công!");
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const handleSkip = () => {
    navigate(profilePath);
  };

  return (
    <div className="profile-form-container">
      <div className="profile-layout">
        {/* 🌿 Cột trái - Avatar & thông tin cơ bản */}
        <div className="profile-left-column">
          <div
            className="profile-avatar-large"
            onClick={() => document.getElementById("avatarUpload").click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" />
            ) : (
              <span>👤</span>
            )}
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
            />
          </div>

          {/* Thông tin cơ bản */}
          <div className="profile-form-group">
            <label>Tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ và tên"
            />
          </div>

          <div className="profile-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
            />
          </div>

          <div className="profile-form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
            />
          </div>
        </div>

        {/* 🌸 Cột phải - Form chi tiết */}
        <div className="profile-right-column">
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label>Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="profile-form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-form-group">
                <label>Cân nặng (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="70"
                />
              </div>

              <div className="profile-form-group">
                <label>Chiều cao (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="180"
                />
              </div>
            </div>

            <h3 className="profile-section-title">
              Thông tin chế độ sinh hoạt
            </h3>

            <div className="profile-form-group">
              <label>Thói quen làm việc</label>
              <input
                type="text"
                name="workHabits"
                value={formData.workHabits}
                onChange={handleChange}
                placeholder="Ví dụ: Ngồi nhiều, thường xuyên đi lại..."
              />
            </div>

            <div className="profile-form-group">
              <label>Thói quen ăn uống</label>
              <input
                type="text"
                name="eatingHabits"
                value={formData.eatingHabits}
                onChange={handleChange}
                placeholder="Ví dụ: Ăn nhiều rau, ít thịt..."
              />
            </div>

            <div className="profile-form-group">
              <label>Chế độ ăn</label>
              <select name="diet" value={formData.diet} onChange={handleChange}>
                <option value="">-- Chọn chế độ ăn --</option>
                <option value="none">Không có chế độ đặc biệt</option>
                <option value="vegetarian">Ăn chay</option>
                <option value="vegan">Thuần chay</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="gluten-free">Không gluten</option>
              </select>
            </div>

            <div className="profile-form-group">
              <label>Dị ứng</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Ví dụ: Dị ứng hải sản, sữa..."
              />
            </div>

            <div className="profile-button-group">
              <button type="submit" className="profile-btn profile-btn-primary">
                Cập nhật
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="profile-btn profile-btn-secondary"
              >
                Bỏ qua
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
