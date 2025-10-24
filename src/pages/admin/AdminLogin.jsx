import { useState } from "react";
// THAY ĐỔI 1: Import hàm loginAdminApi
import { loginAdminApi } from "../../apis/auth";
import { useAuth } from "../../context/useAuth";
import Logo from "../../components/Logo";
import "../style/Login.css"; // Dùng chung file style

function AdminLogin() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError("");
  }; // Validation function

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Validate form

    if (!validateLoginForm()) {
      setLoading(false);
      return;
    }

    try {
      // THAY ĐỔI 2: Gọi đúng hàm loginAdminApi
      const response = await loginAdminApi(loginData);
      if (response.success) {
        // Update AuthContext
        login({
          token: response.data.token,
          user: response.data.user,
        });
        setSuccess("Đăng nhập Admin thành công!");
        console.log("Admin User:", response.data.user); // THAY ĐỔI 3: Redirect to admin page
        setTimeout(() => {
          window.location.href = "/admin"; // Chuyển hướng đến trang /admin
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

  return (
    <div className="login-container">
      {" "}
      <div className="login-card">
        {/* Logo Section */}{" "}
        <div className="logo-section">
          {" "}
          <div className="logo">
            <Logo collapsed={false} />{" "}
          </div>{" "}
        </div>
        {/* Title */}{" "}
        <div className="page-title">
          {/* THAY ĐỔI 4: Sửa tiêu đề */} <h1>Đăng nhập Admin</h1>{" "}
        </div>
        {/* Form Container with dotted border */}{" "}
        <div className="form-container">
          {error && <div className="alert alert-error">{error}</div>}{" "}
          {success && <div className="alert alert-success">{success}</div>}
          {/* THAY ĐỔI 5: Xóa bỏ logic isLogin và form Đăng ký */}{" "}
          <form onSubmit={handleLoginSubmit} className="login-form">
            {" "}
            <div className="form-group">
              <label>Email</label>{" "}
              <input
                type="email"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                placeholder="Email"
                required
                disabled={loading}
              />{" "}
            </div>
            _{" "}
            <div className="form-group">
              <label>Password</label>{" "}
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Password"
                required
                disabled={loading}
              />{" "}
            </div>{" "}
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}{" "}
            </button>{" "}
          </form>{" "}
        </div>
        {/* THAY ĐỔI 6: Xóa bỏ các nút "External Login" và "Đăng ký" */}{" "}
      </div>{" "}
    </div>
  );
}

export default AdminLogin;
