import React, { useState } from 'react';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '2025-01-01',
    gender: 'Nam',
    weight: '',
    height: '',
    phone: '',
    email: '',
    workHabits: '',
    eatingHabits: '',
    diet: '',
    allergies: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Update profile:', formData);
    alert('Cập nhật thông tin thành công!');
  };

  const handleSkip = () => {
    console.log('Skip profile update');
    alert('Đã bỏ qua cập nhật thông tin');
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    background: '#fff',
    color: '#6b7280',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '2.5rem',
      width: '100%',
      maxWidth: '480px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      {/* Avatar */}
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: '#d1d5db',
        margin: '0 auto 2rem',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        color: '#9ca3af'
      }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        👤
      </div>

      {/* Form */}
      <form onSubmit={handleUpdate} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Name Field */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Birthdate Field */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Ngày sinh</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Gender Field */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* Weight Field */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Cân nặng (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="70"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Height Field */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Chiều cao (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="180"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Phone Field */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0123456789"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Email Field */}
        <div style={fieldStyle}>
          <label style={labelStyle}>E-Mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* ========================== */}
        {/* Diet Information Section */}
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '1rem', color: '#111827' }}>
          Thông tin chế độ sinh hoạt
        </h3>

        {/* Work Habits */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Thói quen làm việc</label>
          <input
            type="text"
            name="workHabits"
            value={formData.workHabits}
            onChange={handleChange}
            placeholder="Ví dụ: Ngồi nhiều, thường xuyên đi lại..."
            style={inputStyle}
          />
        </div>

        {/* Eating Habits */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Thói quen ăn uống</label>
          <input
            type="text"
            name="eatingHabits"
            value={formData.eatingHabits}
            onChange={handleChange}
            placeholder="Ví dụ: Ăn nhiều rau, ít thịt..."
            style={inputStyle}
          />
        </div>

        {/* Diet */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Chế độ ăn</label>
          <select
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="">-- Chọn chế độ ăn --</option>
            <option value="Ăn bình thường">Ăn bình thường</option>
            <option value="Ăn chay">Ăn chay</option>
            <option value="Ít tinh bột">Ít tinh bột (Low-carb)</option>
            <option value="Giàu đạm">Giàu đạm (High-protein)</option>
            <option value="Keto">Keto</option>
            <option value="Khác">Khác</option>
          </select>
        </div>


        {/* Allergies */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Dị ứng</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Ví dụ: Dị ứng hải sản, sữa..."
            style={inputStyle}
          />
        </div>
        {/* ========================== */}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          gap: '1rem'
        }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '0.875rem 2rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              fontSize: '14px',
              background: '#fbbf24',
              color: '#000',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f59e0b'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fbbf24'}
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={handleSkip}
            style={{
              flex: 1,
              padding: '0.875rem 2rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              fontSize: '14px',
              background: '#1f2937',
              color: 'white',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#111827'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1f2937'}
          >
            Bỏ qua
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
