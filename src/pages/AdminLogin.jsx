import { useState } from 'react';
import { loginApi } from '../apis/auth';
import { useAuth } from '../context/useAuth';
import Logo from '../components/Logo/Logo';
import './style/AdminLogin.css';

function AdminLogin() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // ----------------- HANDLE INPUT -----------------
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // ----------------- VALIDATION -----------------
  const validateLoginForm = () => {
    if (!loginData.username.trim()) {
      setError('Vui lòng nhập email!');
      return false;
    }
    if (!loginData.password.trim()) {
      setError('Vui lòng nhập mật khẩu!');
      return false;
    }
    return true;
  };

  // ----------------- LOGIN HANDLER -----------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!validateLoginForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await loginApi(loginData);

      if (response.success) {
        // Check if user is admin
        if (response.data.user.role !== 'admin') {
          setError('Bạn không có quyền truy cập trang admin!');
          setLoading(false);
          return;
        }

        // Update AuthContext
        login({
          token: response.data.token,
          user: response.data.user
        });

        setSuccess('Đăng nhập thành công! Đang chuyển đến trang quản trị...');

        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = "/admin";
        }, 800);
      } else {
        setError(response.error || 'Đăng nhập thất bại!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // ----------------- RENDER -----------------
  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        {/* LEFT PANEL */}
        <div className="admin-left-panel">
          <div className="admin-left-content">
            <div className="admin-logo-section">
              <Logo collapsed={false} />
            </div>

            <div className="admin-welcome-section">
              <h1 className="admin-welcome-title">
                Đăng Nhập Quản Trị 🔐
              </h1>
              <p className="admin-welcome-subtitle">
                Chỉ dành cho quản trị viên hệ thống Meta Meal.
                Vui lòng đăng nhập bằng tài khoản admin của bạn.
              </p>
            </div>

            <div className="admin-back-link">
              <a href="/" className="back-to-home">
                ← Về trang chủ
              </a>
            </div>

            {/* Floating shapes */}
            <div className="admin-shape admin-shape-1"></div>
            <div className="admin-shape admin-shape-2"></div>
            <div className="admin-shape admin-shape-3"></div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="admin-right-panel">
          <div className="admin-form-wrapper">
            <h2 className="admin-form-title">
              Đăng nhập Admin
            </h2>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}
            {success && <div className="admin-alert admin-alert-success">{success}</div>}

            {/* LOGIN FORM */}
            <form
              onSubmit={handleLoginSubmit}
              className="admin-auth-form"
              autoComplete="off"
            >
              <div className="admin-input-group">
                <input
                  type="email"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  placeholder="Nhập email admin..."
                  className="admin-form-input"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="admin-input-group">
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Mật khẩu"
                  className="admin-form-input"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="admin-forgot-password">
                <a href="/forgot-password" className="admin-forgot-link">
                  Quên mật khẩu? 🔐
                </a>
              </div>

              <button type="submit" className="admin-submit-button" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP ADMIN'}
              </button>
            </form>

            <div className="admin-note">
              <p>⚠️ Trang này chỉ dành cho quản trị viên</p>
              <p>Nếu bạn là người dùng thường, vui lòng <a href="/login">đăng nhập tại đây</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

