import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Logo from '../components/Logo/Logo.jsx';
import './style/ForgotPassword.css';

function ForgotPassword() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

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
            // EmailJS configuration
            const serviceId = 'service_g92sko8';
            const templateId = 'template_gvtzwtr';
            const publicKey = '33PPjPU1_sOscWeY-';

            // Generate reset token (simple version for demo)
            const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;

            // Template parameters for EmailJS
            const templateParams = {
                email: email, // Khớp với {{email}} trong template
                to_email: email, // Backup
                to_name: email.split('@')[0],
                reset_url: resetUrl,
                link: resetUrl, // Backup cho {{link}}
                from_name: 'Meta Meal',
                message: `Hello ${email.split('@')[0]}, we received a request to reset your password for your Meta Meal account. Click the link below to reset your password. This link will expire in 10 minutes for security reasons.`,
                // Additional fields that might be needed
                user_email: email,
                user_name: email.split('@')[0],
            };

            // Debug logging
            console.log('EmailJS Config:', { serviceId, templateId, publicKey });
            console.log('Template Params:', templateParams);
            
            // Send email using EmailJS
            const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log('EmailJS Result:', result);
            
            // Store token in localStorage for demo (in real app, store in database)
            localStorage.setItem('resetToken', resetToken);
            localStorage.setItem('resetEmail', email);
            
            setIsSubmitted(true);
        } catch (err) {
            console.error('EmailJS error:', err);
            
            // Handle specific EmailJS errors
            if (err.status === 400) {
                setError('Public Key không hợp lệ. Vui lòng kiểm tra cấu hình EmailJS.');
            } else if (err.status === 422) {
                setError('Email không hợp lệ hoặc thiếu thông tin người nhận.');
            } else if (err.text && err.text.includes('recipients address is empty')) {
                setError('Địa chỉ email người nhận không được để trống.');
            } else {
                setError('Có lỗi xảy ra khi gửi email! Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="forgot-password-container">
                <div className="forgot-password-card">
                    <div className="success-content">
                        <div className="success-icon">
                            <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1>Kiểm tra email của bạn</h1>
                        <p>
                            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. 
                            Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.
                        </p>
                        <div className="success-actions">
                            <button 
                                className="btn-secondary" 
                                onClick={() => setIsSubmitted(false)}
                            >
                                Gửi lại email
                            </button>
                            <a href="/" className="back-link">
                                ← Quay lại đăng nhập
                            </a>
                        </div>
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

                        <a href="/" className="back-link">
                            ← Quay lại đăng nhập
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
