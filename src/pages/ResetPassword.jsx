import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';
import './style/ResetPassword.css';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Invalid reset link');
        }
    }, [searchParams]);

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

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            setLoading(false);
            return;
        }

        try {
            // Check if token matches (simple demo version)
            const storedToken = localStorage.getItem('resetToken');
            const storedEmail = localStorage.getItem('resetEmail');
            
            if (token !== storedToken) {
                setError('Token không hợp lệ hoặc đã hết hạn!');
                setLoading(false);
                return;
            }

            // Simulate API call (in real app, call backend API)
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            
            // Clear stored data
            localStorage.removeItem('resetToken');
            localStorage.removeItem('resetEmail');
            
            setSuccess(true);
        } catch (err) {
            setError('Có lỗi xảy ra khi đặt lại mật khẩu!');
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
                        <a href="/" className="btn-primary">
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
                    <h1>Thay đổi mật khẩu</h1>
                </div>

                {/* Form Container with dotted border */}
                <div className="form-container">
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="reset-password-form">
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                disabled={loading}
                                minLength={8}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Repeat Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Password"
                                required
                                disabled={loading}
                                minLength={8}
                            />
                        </div>

                        {/* Password Requirements */}
                        <div className="password-requirements">
                            <div className="requirement-item">
                                <span className="requirement-circle"></span>
                                <span>Tối thiểu phải 8 kí tự</span>
                            </div>
                            <div className="requirement-item">
                                <span className="requirement-circle"></span>
                                <span>Bao gồm 1 kí tự in hoa</span>
                            </div>
                            <div className="requirement-item">
                                <span className="requirement-circle"></span>
                                <span>Bao gồm 1 chữ số</span>
                            </div>
                            <div className="requirement-item">
                                <span className="requirement-circle"></span>
                                <span>Bao gồm 1 kí tự đặc biệt</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-change-password"
                            disabled={loading || !token}
                        >
                            {loading ? 'Đang cập nhật...' : 'Đăng Nhập'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
