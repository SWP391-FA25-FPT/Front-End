import { useState, useEffect } from 'react';
import { userAPI } from '../../services/userAPI';
import './style/TakeSurvey.css';

function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    name: '', // Để trống để user nhập
    profile: {
      weight: '',
      height: '',
      gender: '',
      age: '',
      workHabits: '',
      eatingHabits: '',
      diet: '',
      allergies: [],
      meals: [],
      profileImageUrl: '',
    },
  });

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    setError('');
  };

  const handleArrayChange = (field, value, isChecked) => {
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: isChecked
          ? [...prev.profile[field], value]
          : prev.profile[field].filter(item => item !== value),
      },
    }));
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(''); // Clear error when moving to next step
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation functions for each step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!profileData.name.trim()) {
          setError('Vui lòng nhập tên của bạn!');
          return false;
        }
        if (!profileData.profile.gender) {
          setError('Vui lòng chọn giới tính!');
          return false;
        }
        if (!profileData.profile.age) {
          setError('Vui lòng nhập tuổi!');
          return false;
        }
        break;
      case 2:
        if (!profileData.profile.weight) {
          setError('Vui lòng nhập cân nặng!');
          return false;
        }
        if (!profileData.profile.height) {
          setError('Vui lòng nhập chiều cao!');
          return false;
        }
        if (!profileData.profile.workHabits) {
          setError('Vui lòng chọn mức độ hoạt động!');
          return false;
        }
        break;
      case 3:
        if (!profileData.profile.eatingHabits) {
          setError('Vui lòng chọn thói quen ăn uống!');
          return false;
        }
        if (!profileData.profile.diet) {
          setError('Vui lòng chọn chế độ ăn!');
          return false;
        }
        break;
      case 4:
        if (profileData.profile.meals.length === 0) {
          setError('Vui lòng chọn ít nhất một bữa ăn!');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Final validation before submit
    if (!validateStep(4)) {
      setLoading(false);
      return;
    }

    try {
      // Convert string numbers to actual numbers
      const processedData = {
        name: profileData.name, // Gửi tên từ user data
        profile: {
          ...profileData.profile,
          weight: profileData.profile.weight ? Number(profileData.profile.weight) : undefined,
          height: profileData.profile.height ? Number(profileData.profile.height) : undefined,
          age: profileData.profile.age ? Number(profileData.profile.age) : undefined,
        },
      };

      await userAPI.updateProfile(processedData);
      await userAPI.completeOnboarding();
      
      setSuccess('Thông tin đã được lưu thành công! Đang chuyển về trang đăng nhập...');
      
      // Call the completion callback to logout and return to login
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra khi lưu thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Thông tin cơ bản</h2>
            <div className="form-group">
              <label>Tên của bạn <span className="required">*</span></label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên của bạn"
                required
              />
            </div>
            <div className="form-group">
              <label>Giới tính <span className="required">*</span></label>
              <select
                value={profileData.profile.gender}
                onChange={(e) => handleInputChange('profile.gender', e.target.value)}
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tuổi <span className="required">*</span></label>
              <input
                type="number"
                value={profileData.profile.age}
                onChange={(e) => handleInputChange('profile.age', e.target.value)}
                placeholder="Nhập tuổi"
                min="1"
                max="120"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Thông tin thể chất</h2>
            <div className="form-group">
              <label>Cân nặng (kg) <span className="required">*</span></label>
              <input
                type="number"
                value={profileData.profile.weight}
                onChange={(e) => handleInputChange('profile.weight', e.target.value)}
                placeholder="Nhập cân nặng"
                min="1"
                max="300"
                required
              />
            </div>
            <div className="form-group">
              <label>Chiều cao (cm) <span className="required">*</span></label>
              <input
                type="number"
                value={profileData.profile.height}
                onChange={(e) => handleInputChange('profile.height', e.target.value)}
                placeholder="Nhập chiều cao"
                min="50"
                max="250"
                required
              />
            </div>
            <div className="form-group">
              <label>Mức độ hoạt động <span className="required">*</span></label>
              <select
                value={profileData.profile.workHabits}
                onChange={(e) => handleInputChange('profile.workHabits', e.target.value)}
                required
              >
                <option value="">Chọn mức độ hoạt động</option>
                <option value="sedentary">Ít vận động (ngồi nhiều)</option>
                <option value="light">Nhẹ nhàng (đi bộ nhẹ)</option>
                <option value="moderate">Vừa phải (tập thể dục 3-4 lần/tuần)</option>
                <option value="active">Tích cực (tập thể dục 5-6 lần/tuần)</option>
                <option value="very active">Rất tích cực (tập thể dục hàng ngày)</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Thói quen ăn uống</h2>
            <div className="form-group">
              <label>Thói quen ăn uống <span className="required">*</span></label>
              <select
                value={profileData.profile.eatingHabits}
                onChange={(e) => handleInputChange('profile.eatingHabits', e.target.value)}
                required
              >
                <option value="">Chọn thói quen ăn uống</option>
                <option value="light">Ăn nhẹ</option>
                <option value="moderate">Ăn vừa phải</option>
                <option value="heavy">Ăn nhiều</option>
                <option value="snacker">Thích ăn vặt</option>
              </select>
            </div>
            <div className="form-group">
              <label>Chế độ ăn <span className="required">*</span></label>
              <select
                value={profileData.profile.diet}
                onChange={(e) => handleInputChange('profile.diet', e.target.value)}
                required
              >
                <option value="">Chọn chế độ ăn</option>
                <option value="none">Không có chế độ đặc biệt</option>
                <option value="vegan">Thuần chay</option>
                <option value="vegetarian">Ăn chay</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="gluten-free">Không gluten</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dị ứng thực phẩm (tùy chọn - có thể chọn nhiều)</label>
              <div className="checkbox-group">
                {['Đậu phộng', 'Hải sản', 'Sữa', 'Trứng', 'Đậu nành', 'Lúa mì', 'Hạt cây', 'Khác'].map(allergy => (
                  <label key={allergy} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profileData.profile.allergies.includes(allergy)}
                      onChange={(e) => handleArrayChange('allergies', allergy, e.target.checked)}
                    />
                    <span>{allergy}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Bữa ăn yêu thích</h2>
            <div className="form-group">
              <label>Bạn thường ăn những bữa nào? <span className="required">*</span> (chọn ít nhất một bữa)</label>
              <div className="checkbox-group">
                {[
                  { value: 'breakfast', label: 'Bữa sáng' },
                  { value: 'lunch', label: 'Bữa trưa' },
                  { value: 'dinner', label: 'Bữa tối' },
                  { value: 'snack', label: 'Bữa phụ' },
                ].map(meal => (
                  <label key={meal.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profileData.profile.meals.includes(meal.value)}
                      onChange={(e) => handleArrayChange('meals', meal.value, e.target.checked)}
                    />
                    <span>{meal.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>URL ảnh đại diện (tùy chọn)</label>
              <input
                type="url"
                value={profileData.profile.profileImageUrl}
                onChange={(e) => handleInputChange('profile.profileImageUrl', e.target.value)}
                placeholder="https://example.com/your-image.jpg"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <h1>Chào mừng đến với Meta Meal! 🎉</h1>
          <p>Hãy cho chúng tôi biết một chút về bạn để tạo ra trải nghiệm cá nhân hóa tốt nhất</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>

        <div className="step-indicator">
          Bước {currentStep} / {totalSteps}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="step-wrapper">
          {renderStep()}
        </div>

        <div className="step-navigation">
          {currentStep > 1 && (
            <button onClick={prevStep} className="btn-secondary">
              Quay lại
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button onClick={nextStep} className="btn-primary">
              Tiếp theo
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Hoàn thành'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
