import React, { useState, useEffect } from "react";

const ProfileForm = ({ userProfile, onProfileUpdate, reloadProfile }) => {
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

  const [avatar, setAvatar] = useState(null); // ảnh preview
  const [updateStatus, setUpdateStatus] = useState(null); // 'success' | 'error' | null

  // Khi userProfile thay đổi → cập nhật form
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        birthdate: userProfile.profile?.birthdate
          ? userProfile.profile.birthdate.substring(0, 10)
          : "",
        gender:
          userProfile.profile?.gender === "male"
            ? "Nam"
            : userProfile.profile?.gender === "female"
              ? "Nữ"
              : "Khác",
        weight: userProfile.profile?.weight || "",
        height: userProfile.profile?.height || "",
        phone: userProfile.phone || "",
        email: userProfile.email || "",
        workHabits: userProfile.profile?.workHabits || "",
        eatingHabits: userProfile.profile?.eatingHabits || "",
        diet: userProfile.profile?.diet || "",
        allergies: userProfile.profile?.allergies?.join(", ") || "",
      });
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

  // Xử lý chọn ảnh mới
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setAvatar(previewURL);
  };

  // Gửi form cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        profile: {
          weight: formData.weight ? Number(formData.weight) : undefined,
          height: formData.height ? Number(formData.height) : undefined,
          gender:
            formData.gender === "Nam"
              ? "male"
              : formData.gender === "Nữ"
                ? "female"
                : "other",
          birthdate: formData.birthdate,
          workHabits: formData.workHabits || undefined,
          eatingHabits: formData.eatingHabits || undefined,
          diet: formData.diet || undefined,
          allergies: formData.allergies
            ? formData.allergies
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a)
            : undefined,
        },
      };

      const result = await onProfileUpdate(updateData);

      if (result.success) {
        setUpdateStatus("success");
        if (typeof reloadProfile === "function") {
          reloadProfile(); // thêm dấu ngoặc để gọi hàm
        }
        setTimeout(() => setUpdateStatus(null), 3000);
      } else {
        setUpdateStatus("error");
        setTimeout(() => setUpdateStatus(null), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const handleSkip = () => {
    console.log("Skip profile update");
    alert("Đã bỏ qua cập nhật thông tin");
  };

  return (
    <div className="profile-form-container">
      {updateStatus && (
        <div className="profile-toast-overlay">
          <div className="profile-toast-card">
            <div className="confetti"></div>

            <h2 className="toast-title">
              {updateStatus === "success"
                ? "Cập nhật thành công!"
                : "Có lỗi xảy ra rồi!"}
            </h2>

            <p className="toast-subtext">
              {updateStatus === "success"
                ? "Thông tin của bạn đã được lưu lại."
                : "Vui lòng thử lại sau nhé."}
            </p>
          </div>
        </div>
      )}


      <div className="profile-layout">
        {/* Cột trái - Avatar & thông tin cơ bản */}
        <div className="profile-left-column">
          <div
            className="profile-avatar-large"
            onClick={() => document.getElementById("avatarUpload").click()}
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" />
            ) : (
              <span></span>
            )}

            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData((prev) => ({
                      ...prev,
                      avatar: reader.result,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
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

            <h3 className="profile-section-title">Thông tin chế độ sinh hoạt</h3>

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
              <select
                name="diet"
                value={formData.diet}
                onChange={handleChange}
              >
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
