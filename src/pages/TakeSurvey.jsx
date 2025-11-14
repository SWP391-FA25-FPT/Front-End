import { useState, useEffect } from 'react';
import { getProfile, updateProfile, completeOnboarding } from '../apis/user';
import { useAuth } from '../context/useAuth';
import Logo from '../components/Logo/Logo';
import './style/TakeSurvey.css';
import { useNavigate } from "react-router-dom";


function TakeSurvey({ onComplete }) {
  const { updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
<<<<<<< Updated upstream
      meals: [],
      knowledgeSource: '',
=======
      meals: ['breakfast', 'lunch', 'dinner'], // Always include 3 main meals
      profileImageUrl: '',
>>>>>>> Stashed changes
    },
  });

  const [customAllergy, setCustomAllergy] = useState('');

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
    setProfileData(prev => {
      let newArray = [...prev.profile[field]];

      if (value === 'Không') {
        // Nếu chọn "Không", xóa tất cả các dị ứng khác
        if (isChecked) {
          newArray = ['Không'];
        } else {
          newArray = [];
        }
      } else {
        // Nếu chọn dị ứng khác, xóa "Không" nếu có
        if (isChecked) {
          newArray = newArray.filter(item => item !== 'Không');
          newArray.push(value);
        } else {
          newArray = newArray.filter(item => item !== value);
        }
      }

      return {
        ...prev,
        profile: {
          ...prev.profile,
          [field]: newArray,
        },
      };
    });
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
<<<<<<< Updated upstream
        if (profileData.profile.meals.length === 0) {
          setError('Vui lòng chọn ít nhất một bữa ăn!');
          return false;
        }
        if (!profileData.profile.knowledgeSource) {
          setError('Vui lòng chọn nguồn biết đến hệ thống!');
          return false;
        }
=======
        // Meals will always have at least breakfast, lunch, dinner
        // No validation needed as these are always included
>>>>>>> Stashed changes
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
      // Process allergies - add custom allergy if provided
      let processedAllergies = [...profileData.profile.allergies];
      if (profileData.profile.allergies.includes('Khác') && customAllergy.trim()) {
        // Replace 'Khác' with the actual custom allergy text
        processedAllergies = processedAllergies.filter(item => item !== 'Khác');
        processedAllergies.push(customAllergy.trim());
      }

      // Ensure meals always include breakfast, lunch, dinner
      const baseMeals = ['breakfast', 'lunch', 'dinner'];
      const finalMeals = profileData.profile.meals.includes('snack')
        ? [...baseMeals, 'snack']
        : baseMeals;

      // Convert string numbers to actual numbers
      const processedData = {
        name: profileData.name, // Gửi tên từ user data
        profile: {
          ...profileData.profile,
          weight: profileData.profile.weight ? Number(profileData.profile.weight) : undefined,
          height: profileData.profile.height ? Number(profileData.profile.height) : undefined,
          age: profileData.profile.age ? Number(profileData.profile.age) : undefined,
          allergies: processedAllergies,
          meals: finalMeals, // Ensure meals always have the 3 main meals
        },
      };

<<<<<<< Updated upstream
      const updateResponse = await updateProfile(null, processedData);
=======
      // updateProfile now requires userId as first parameter (or undefined for current user)
      const updateResponse = await updateProfile(undefined, processedData);
>>>>>>> Stashed changes
      const completeResponse = await completeOnboarding();

      // Update user data in context
      if (completeResponse?.success) {
        updateUser({
          ...completeResponse.data,   // dùng data từ completeOnboarding
          isFirstLogin: false,        // đảm bảo luôn false
        });
      }

      setSuccess('Thông tin đã được lưu thành công! Đang chuyển về trang chính...');

      // Redirect to home page after successful completion
      setTimeout(() => {
        navigate("/", { replace: true });
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
              <label>Dị ứng thực phẩm (tùy chọn)</label>
              <div className="allergy-section">
                <div className="allergy-grid">
                  {['Không', 'Đậu phộng', 'Hải sản', 'Sữa', 'Trứng', 'Đậu nành', 'Lúa mì', 'Hạt cây', 'Khác'].map(allergy => (
                    <label key={allergy} className="allergy-checkbox">
                      <input
                        type="checkbox"
                        checked={profileData.profile.allergies.includes(allergy)}
                        onChange={(e) => handleArrayChange('allergies', allergy, e.target.checked)}
                      />
                      <span className="allergy-text">{allergy}</span>
                    </label>
                  ))}
                </div>

                {/* Custom allergy input */}
                {profileData.profile.allergies.includes('Khác') && (
                  <div className="custom-allergy-input">
                    <input
                      type="text"
                      value={customAllergy}
                      onChange={(e) => setCustomAllergy(e.target.value)}
                      placeholder="Nhập dị ứng khác..."
                      className="allergy-text-input"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Bữa ăn yêu thích</h2>
            <div className="form-group">
              <label>Bạn sẽ có 3 bữa chính mỗi ngày:</label>
              <div className="checkbox-group" style={{ opacity: 0.6, pointerEvents: 'none' }}>
                {[
                  { value: 'breakfast', label: 'Bữa sáng' },
                  { value: 'lunch', label: 'Bữa trưa' },
                  { value: 'dinner', label: 'Bữa tối' },
                ].map(meal => (
                  <label key={meal.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                    />
                    <span>{meal.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
<<<<<<< Updated upstream
              <label>Bạn biết đến hệ thống qua đâu? <span className="required">*</span></label>
              <select
                value={profileData.profile.knowledgeSource}
                onChange={(e) => handleInputChange('profile.knowledgeSource', e.target.value)}
                required
              >
                <option value="">Chọn nguồn</option>
                <option value="social-media">Mạng xã hội (TikTok, Facebook, Instagram...)</option>
                <option value="google-search">Tìm kiếm Google</option>
                <option value="referral">Link chia sẻ / Giới thiệu từ người khác</option>
                <option value="advertisement">Quảng cáo</option>
                <option value="other">Khác</option>
              </select>
=======
              <label>Bạn có hay ăn bữa phụ không?</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profileData.profile.meals.includes('snack')}
                    onChange={(e) => {
                      const hasSnack = e.target.checked;
                      setProfileData(prev => {
                        const baseMeals = ['breakfast', 'lunch', 'dinner'];
                        return {
                          ...prev,
                          profile: {
                            ...prev.profile,
                            meals: hasSnack ? [...baseMeals, 'snack'] : baseMeals
                          }
                        };
                      });
                    }}
                  />
                  <span>Có, tôi thường ăn bữa phụ (ở giữa bữa trưa và bữa tối)</span>
                </label>
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
>>>>>>> Stashed changes
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <Logo collapsed={false} />
          </div>
        </div>

        {/* Title */}
        <div className="page-title">
          <h1>Khảo sát thông tin cá nhân</h1>
        </div>

        {/* Form Container with dotted border */}
        <div className="form-container">
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

        {/* Progress indicator */}
        <div className="progress-section">
          <div className="step-indicator">
            Bước {currentStep} / {totalSteps}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeSurvey;
