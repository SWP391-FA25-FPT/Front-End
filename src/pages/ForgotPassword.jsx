import { useState } from 'react';
import { baseUrl } from '../utils/constants';
import apiHelper from '../utils/apiHelper';
import { apiUrls } from '../utils/constants';
import { sendPasswordResetEmail } from '../services/emailService';
import Logo from '../components/Logo/Logo';
import './style/ForgotPassword.css';

function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate email
        if (!email || email.trim() === '') {
            setError('Vui lòng nhập email!');
            setLoading(false);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Vui lòng nhập email hợp lệ!');
            setLoading(false);
            return;
        }

        try {
            // Call backend API to generate reset token
            const response = await apiHelper.post(apiUrls.forgotPassword, { email });

            if (response.success && response.data) {
                const { resetToken, username } = response.data;
                
                // Send reset link via email using EmailJS
                if (resetToken) {
                    // Create reset link (use window.location.origin to get correct base URL)
                    const frontendUrl = window.location.origin;
                    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
                    
                    console.log('Sending password reset link to:', email);
                    console.log('Reset link:', resetLink);
                    
                    const emailResult = await sendPasswordResetEmail(
                        email, 
                        username || email.split('@')[0], 
                        resetLink
                    );
                    
                    if (!emailResult.success) {
                        console.error('❌ Failed to send reset email:', emailResult.error);
                        setError('Không thể gửi email. Lỗi: ' + emailResult.error);
                        setLoading(false);
                        return;
                    }
                    console.log('✅ Reset email sent successfully!');
                }

                // Show success message
                setIsSubmitted(true);
            } else {
                setError(response.error || 'Có lỗi xảy ra!');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(err.response?.data?.error || 'Có lỗi xảy ra khi gửi link đặt lại mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    // Show success screen after email sent
    if (isSubmitted) {
        return (
            <div className="forgot-password-container">
                <div className="forgot-password-card">
                    <div className="logo-section">
                        <div className="logo">
                            <Logo collapsed={false} />
                        </div>
                    </div>
                    
                    <div className="success-content">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                            </svg>
                        </div>
                        <h1>Kiểm tra email của bạn!</h1>
                        <p>
                            Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>
                        </p>
                        <p className="sub-note">
                            Vui lòng kiểm tra cả thư mục spam nếu bạn không thấy email.
                        </p>
                        <a href="/login" className="btn-back-login">
                            ← Quay lại đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                {/* Logo Section */}
                <div className="logo-section">
                    <div className="logo">
                        <Logo collapsed={false} />
                    </div>
                </div>

                {/* Title */}
                <div className="page-title">
                    <h1>Quên mật khẩu?</h1>
                </div>

                {/* Form Container with dotted border */}
                <div className="form-container">
                    <p className="form-description">
                        Nhập email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
                    </p>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-send-reset"
                            disabled={loading}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
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

export default ForgotPassword;
