import { useState } from 'react';
import { loginApi, registerApi } from '../apis/auth';
import { useAuth } from '../context/useAuth';
import Logo from '../components/Logo/Logo';
import './style/Login.css';

function Login() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slideDirection, setSlideDirection] = useState('');

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // ----------------- HANDLE INPUT -----------------
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // ----------------- VALIDATION -----------------
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateLoginForm = () => {
    if (!loginData.username.trim()) {
      setError('Vui lòng nhập tên đăng nhập hoặc email!');
      return false;
    }
    if (!loginData.password.trim()) {
      setError('Vui lòng nhập mật khẩu!');
      return false;
    }
    return true;
  };

  const validateRegisterForm = () => {
    const hasUpperCase = /[A-Z]/.test(registerData.password);
    const hasNumber = /[0-9]/.test(registerData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(registerData.password);

    if (!registerData.username.trim()) {
      setError('Vui lòng nhập tên đăng nhập!');
      return false;
    }
    if (registerData.username.trim().length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự!');
      return false;
    }
    if (!registerData.email.trim()) {
      setError('Vui lòng nhập email!');
      return false;
    }
    if (!validateEmail(registerData.email)) {
      setError('Email không đúng định dạng!');
      return false;
    }
    if (!registerData.password.trim()) {
      setError('Vui lòng nhập mật khẩu!');
      return false;
    }
    if (registerData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự!');
      return false;
    }
    if (!hasUpperCase) {
      setError('Mật khẩu phải có ít nhất 1 ký tự in hoa!');
      return false;
    }
    if (!hasNumber) {
      setError('Mật khẩu phải có ít nhất 1 chữ số!');
      return false;
    }
    if (!hasSpecialChar) {
      setError('Mật khẩu phải có ít nhất 1 ký tự đặc biệt!');
      return false;
    }
    if (!registerData.confirmPassword.trim()) {
      setError('Vui lòng xác nhận mật khẩu!');
      return false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError('Mật khẩu không khớp!');
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
        // Update AuthContext
        login({
          token: response.data.token,
          user: response.data.user
        });

        setSuccess('Đăng nhập thành công!');
        console.log('User:', response.data.user);

        // Redirect to home page (admin should use /admin/login)
        setTimeout(() => {
          window.location.href = "/";
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


  // ----------------- REGISTER HANDLER -----------------
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!validateRegisterForm()) {
      setLoading(false);
      return;
    }

    try {
      await registerApi({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        onSuccess: async () => {
          setSuccess('Đăng ký thành công! Đang đăng nhập...');

          try {
            const loginRes = await loginApi({
              username: registerData.email,
              password: registerData.password
            });

            if (loginRes.success) {
              login({
                token: loginRes.data.token,
                user: loginRes.data.user
              });

              setTimeout(() => {
                window.location.href = "/";
              }, 800);
            } else {
              setError("Tự động đăng nhập thất bại, vui lòng đăng nhập lại!");
            }
          } catch {
            setError("Có lỗi khi đăng nhập tự động!");
          }
        },

        onFail: (error) => {
          setError(error || 'Đăng ký thất bại!');
        }
      });
    } catch {
      setError('Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };
  // ----------------- TOGGLE SLIDE -----------------
  const handleToggle = () => {
    setSlideDirection(isLogin ? 'slide-left' : 'slide-right');

    // Reset cả 2 form khi chuyển
    setLoginData({ username: '', password: '' });
    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });

    setTimeout(() => {
      setIsLogin(!isLogin);
      setSlideDirection('');
      setError('');
      setSuccess('');
    }, 350);
  };

  // ----------------- RENDER -----------------
  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="left-content">
            <div className="logo-section">
              <Logo collapsed={false} />
            </div>

            <div className="welcome-section">
              <h1 className="welcome-title">
                {isLogin ? 'Chào Mừng Trở Lại 🌿' : 'Bắt Đầu Hành Trình Lành Mạnh!'}
              </h1>
              <p className="welcome-subtitle">
                {isLogin
                  ? 'Tiếp tục theo dõi bữa ăn & cải thiện sức khỏe mỗi ngày cùng Meta Meal.'
                  : 'Tạo tài khoản để lưu bữa ăn, xem dưỡng chất và nhận thực đơn phù hợp.'}
              </p>
            </div>

            <button className="toggle-button" onClick={handleToggle}>
              {isLogin ? 'TẠO TÀI KHOẢN MỚI' : 'ĐĂNG NHẬP NGAY'}
            </button>

            {/* Floating shapes */}
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="form-wrapper">
            <h2 className="form-title">
              {isLogin ? 'Đăng nhập Meta Meal' : 'Tạo Tài Khoản Meta Meal'}
            </h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* LOGIN FORM */}
            {isLogin ? (
              <form
                key="login-form"
                onSubmit={handleLoginSubmit}
                className={`auth-form ${slideDirection}`}
                autoComplete="off"
              >
                <div className="input-group">
                  <input
                    type="email"
                    name="username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    placeholder="Nhập email..."
                    className="form-input"
                    required
                    autoComplete="new-email"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Mật khẩu"
                    className="form-input"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className="forgot-password">
                  <a href="/forgot-password" className="forgot-link">
                    Quên mật khẩu? 🌱
                  </a>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                </button>
              </form>
            ) : (
              // REGISTER FORM
              <form
                key="register-form"
                onSubmit={handleRegisterSubmit}
                className={`auth-form ${slideDirection}`}
                autoComplete="off"
              >
                <input
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="Tên hiển thị"
                  className="form-input"
                  required
                  minLength={3}
                  autoComplete="new-username"
                />

                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="Email"
                  className="form-input"
                  required
                  autoComplete="new-email"
                />

                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Mật khẩu"
                  className="form-input"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Nhập lại mật khẩu"
                  className="form-input"
                  required
                  autoComplete="new-password"
                />

                {/* Password Requirements */}
                <div className="password-requirements">
                  <div className={`requirement-item ${registerData.password.length >= 8 ? 'valid' : ''}`}>
                    <span className="requirement-circle"></span>
                    <span>Tối thiểu phải 8 kí tự</span>
                  </div>

                  <div className={`requirement-item ${/[A-Z]/.test(registerData.password) ? 'valid' : ''}`}>
                    <span className="requirement-circle"></span>
                    <span>Bao gồm 1 kí tự in hoa</span>
                  </div>

                  <div className={`requirement-item ${/[0-9]/.test(registerData.password) ? 'valid' : ''}`}>
                    <span className="requirement-circle"></span>
                    <span>Bao gồm 1 chữ số</span>
                  </div>

                  <div className={`requirement-item ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(registerData.password) ? 'valid' : ''}`}>
                    <span className="requirement-circle"></span>
                    <span>Bao gồm 1 kí tự đặc biệt</span>
                  </div>



                  <a
                    href="#"
                    className="back-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(true);
                    }}
                  >
                    ← Quay lại đăng nhập
                  </a>
                </div>

                <button type="submit" className="btn-register" disabled={loading}>
                  {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
              </form>
            )}
            {/* MOVE GOOGLE BUTTON HERE */}
            <div className="external-login">
              <button className="btn-google" type="button">
                <div className="google-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                Tiếp tục với Google
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
