import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiHelper from '../utils/apiHelper';
import { apiUrls } from '../utils/constants';
import Logo from '../components/Logo/Logo';
import './style/ResetPassword.css';

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp!');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự!');
            setLoading(false);
            return;
        }

        // Check password strength
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
            setError('Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt!');
            setLoading(false);
            return;
        }

        try {
            // Call backend API to reset password with token
            const response = await apiHelper.post(apiUrls.resetPassword, {
                token,
                newPassword: password
            });

            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.error || 'Không thể đặt lại mật khẩu!');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError(err.response?.data?.error || 'Có lỗi xảy ra khi đặt lại mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="success-content">
                        <div className="success-icon">
                            <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1>Mật khẩu đã được đặt lại!</h1>
                        <p>
                            Mật khẩu của bạn đã được cập nhật thành công. 
                            Bây giờ bạn có thể đăng nhập với mật khẩu mới.
                        </p>
                        <a href="/login" className="btn-primary">
                            Đăng nhập ngay
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                {/* Logo Section */}
                <div className="logo-section">
                    <div className="logo">
                        <Logo collapsed={false} />
                    </div>
                </div>

                {/* Title */}
                <div className="page-title">
                    <h1>Đặt lại mật khẩu</h1>
                    <p className="subtitle">
                        Nhập mật khẩu mới của bạn
                    </p>
                </div>

                {/* Form Container */}
                <div className="form-container">
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="reset-password-form">
                        {/* Password Fields */}
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu mới</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                required
                                disabled={loading}
                                minLength={8}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                required
                                disabled={loading}
                                minLength={8}
                            />
                        </div>

                        {/* Password Requirements */}
                        <div className="password-requirements">
                            <div className={`requirement-item ${password.length >= 8 ? 'valid' : ''}`}>
                                <span className="requirement-circle"></span>
                                <span>Tối thiểu phải 8 kí tự</span>
                            </div>
                            <div className={`requirement-item ${/[A-Z]/.test(password) ? 'valid' : ''}`}>
                                <span className="requirement-circle"></span>
                                <span>Bao gồm 1 kí tự in hoa</span>
                            </div>
                            <div className={`requirement-item ${/[0-9]/.test(password) ? 'valid' : ''}`}>
                                <span className="requirement-circle"></span>
                                <span>Bao gồm 1 chữ số</span>
                            </div>
                            <div className={`requirement-item ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'valid' : ''}`}>
                                <span className="requirement-circle"></span>
                                <span>Bao gồm 1 kí tự đặc biệt</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-change-password"
                            disabled={loading || !password || !confirmPassword}
                        >
                            {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                        </button>

                        <a href="/login" className="back-link">
                            ← Quay lại đăng nhập
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
