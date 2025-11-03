import { useState } from "react";
import { loginUserApi, registerApi } from "../apis/auth";
import { useAuth } from "../context/useAuth";
import Logo from "../components/Logo";
import "./style/Login.css";

function Login() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = () => {
    if (!loginData.username.trim()) {
      setError("Vui lòng nhập tên đăng nhập hoặc email!");
      return false;
    }
    if (!loginData.password.trim()) {
      setError("Vui lòng nhập mật khẩu!");
      return false;
    }
    return true;
  };

  const validateRegisterForm = () => {
    if (!registerData.username.trim()) {
      setError("Vui lòng nhập tên đăng nhập!");
      return false;
    }
    if (registerData.username.trim().length < 3) {
      setError("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return false;
    }
    if (!registerData.email.trim()) {
      setError("Vui lòng nhập email!");
      return false;
    }
    if (!validateEmail(registerData.email)) {
      setError("Email không đúng định dạng!");
      return false;
    }
    if (!registerData.password.trim()) {
      setError("Vui lòng nhập mật khẩu!");
      return false;
    }
    if (registerData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }
    if (!registerData.confirmPassword.trim()) {
      setError("Vui lòng xác nhận mật khẩu!");
      return false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu không khớp!");
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate form
    if (!validateLoginForm()) {
      setLoading(false);
      return;
    }

    try {
      // THAY ĐỔI 2: Gọi đúng hàm loginUserApi
      const response = await loginUserApi(loginData);

      if (response.success) {
        // Update AuthContext
        login({
          token: response.data.token,
          user: response.data.user,
        });

        setSuccess("Đăng nhập thành công!");
        console.log("User:", response.data.user);

        // Redirect to home page (đúng cho user)
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setError(response.error || "Đăng nhập thất bại!");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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
        onSuccess: () => {
          setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
          setRegisterData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          // Switch to login form after 2 seconds
          setTimeout(() => {
            setIsLogin(true);
            setSuccess("");
          }, 2000);
        },
        onFail: (error) => {
          setError(error || "Đăng ký thất bại!");
        },
      });
    } catch {
      setError("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Decorative Fruits/Vegetables */}
      <div className="decorative-fruit fruit-1">🥕</div>
      <div className="decorative-fruit fruit-2">🥦</div>
      <div className="decorative-fruit fruit-3">🍎</div>
      <div className="decorative-fruit fruit-4">🍊</div>

      <div className="login-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <Logo collapsed={false} />
          </div>
          
        </div>

        {/* Title */}
        <div className="page-title">
          <h1>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h1>
        </div>

        {/* Form Container with dotted border */}
        <div className="form-container">
          {/* Decorative corner fruits */}
          <div className="corner-fruit corner-tl">🍓</div>
          <div className="corner-fruit corner-tr">🥑</div>
          <div className="corner-fruit corner-bl">🍋</div>
          <div className="corner-fruit corner-br">🥬</div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  placeholder="Email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              {/* Forgot Password Link */}
              <div className="forgot-password-link">
                <a href="/forgot-password" className="forgot-link">
                  Forgot password?
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  T
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="Username"
                  required
                  disabled={loading}
                  minLength={3}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="Email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Password"
                  required
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="confirm password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Requirements */}
              <div className="password-requirements">
                <div className="requirement-item">
                  <span className="requirement-check">✓</span>
                  <span>Tối thiểu phải 8 kí tự</span>
                </div>
                <div className="requirement-item">
                  <span className="requirement-check">✓</span>
                  <span>Bao gồm 1 kí tự in hoa</span>
                </div>
                <div className="requirement-item">
                  <span className="requirement-check">✓</span>
                  <span>Bao gồm 1 chữ số</span>
                </div>
                <div className="requirement-item">
<<<<<<< Updated upstream
                  <span className="requirement-circle"></span>
                  <span>Bao gồm 1 kí tự đặc biệt</span>_{" "}
                </div>
                <a href="/" className="back-link">
=======
                  <span className="requirement-check">✓</span>
                  <span>Bao gồm 1 kí tự đặc biệt</span>
                </div>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(true);
                  setError('');
                  setSuccess('');
                }} className="back-link">
>>>>>>> Stashed changes
                  ← Quay lại đăng nhập
                </a>
              </div>

              <button type="submit" className="btn-register" disabled={loading}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </form>
          )}
        </div>

        {/* External Login Buttons */}
        <div className="external-login">
          <button className="btn-google">
            <div className="google-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                {" "}
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              T{" "}
            </div>
            Tiếp tục với Google
          </button>
<<<<<<< Updated upstream

          <button
            className="btn-register-external"
            onClick={() => {
              setIsLogin(false);
              setError("");
              setSuccess("");
            }}
          >
            Đăng ký tài khoản{" "}
          </button>
=======
          
          {isLogin && (
            <button 
              className="btn-register-external"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
            >
              Đăng ký tài khoản mới
            </button>
          )}
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
}

<<<<<<< Updated upstream
export default Login;
=======
export default Login;
>>>>>>> Stashed changes
