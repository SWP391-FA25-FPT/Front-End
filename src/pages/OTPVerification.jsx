import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTPApi, resendOTPApi } from '../apis/auth';
import { useAuth } from '../context/useAuth';
import { sendVerificationEmail } from '../services/emailService';
import Logo from '../components/Logo/Logo';
import './style/OTPVerification.css';

function OTPVerification() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email and other data from location state
  const email = location.state?.email || '';
  const username = location.state?.username || '';
  const otp = location.state?.otp || '';
  
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const emailSentRef = useRef(false); // Track if email has been sent

  // Send email on component mount (only once when data is available)
  useEffect(() => {
    // Prevent sending email multiple times
    if (emailSentRef.current) return;
    
    // Wait for email, username, and otp to be available
    if (!email || !username || !otp) return;
    
    const sendEmail = async () => {
      if (emailSentRef.current) return; // Double check
      
      emailSentRef.current = true; // Mark as sent
      console.log('Sending OTP email to:', email, 'OTP:', otp);
      
      try {
        const result = await sendVerificationEmail(email, username, otp);
        if (result.success) {
          console.log('✅ Email sent successfully!');
        } else {
          console.error('❌ Failed to send email:', result.error);
          setError('Không thể gửi email. Vui lòng kiểm tra email hoặc gửi lại mã.');
          emailSentRef.current = false; // Reset on error to allow retry
        }
      } catch (error) {
        console.error('❌ Email error:', error);
        setError('Có lỗi khi gửi email: ' + error.message);
        emailSentRef.current = false; // Reset on error to allow retry
      }
    };
    
    sendEmail();
  }, [email, username, otp]); // Run when these values are available, but emailSentRef prevents duplicates

  // Countdown for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value && newOtpValues.every(v => v)) {
      handleVerify(newOtpValues.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Only allow 6 digits
    if (!/^\d{6}$/.test(pastedData)) {
      setError('Vui lòng dán mã OTP 6 số!');
      return;
    }

    const digits = pastedData.split('');
    setOtpValues(digits);
    inputRefs.current[5]?.focus();
    
    // Auto-submit
    handleVerify(pastedData);
  };

  const handleVerify = async (otpCode = null) => {
    const code = otpCode || otpValues.join('');
    
    if (code.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 số!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyOTPApi({
        email,
        otp: code
      });

      if (response.success) {
        setSuccess('Xác thực thành công! Đang đăng nhập...');
        
        // Update auth context
        login({
          token: response.data.token,
          user: response.data.user
        });

        // Redirect based on user type
        setTimeout(() => {
          if (response.data.user.isFirstLogin) {
            navigate('/survey');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        setError(response.error || 'Mã OTP không đúng!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await resendOTPApi({ email });

      if (response.success) {
        // Send new OTP via email
        if (response.data?.otp) {
          console.log('Resending OTP email to:', email, 'New OTP:', response.data.otp);
          const emailResult = await sendVerificationEmail(email, username, response.data.otp);
          
          if (emailResult.success) {
            console.log('✅ Resend email sent successfully!');
            setSuccess('Mã OTP mới đã được gửi đến email của bạn!');
          } else {
            console.error('❌ Failed to resend email:', emailResult.error);
            setError('Không thể gửi email. Lỗi: ' + emailResult.error);
            setLoading(false);
            return;
          }
        }
        
        setResendCooldown(60); // 60 seconds cooldown
        setOtpValues(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(response.error || 'Không thể gửi lại mã OTP!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification-wrapper">
      <div className="otp-verification-container">
        <div className="otp-logo-section">
          <Logo collapsed={false} />
        </div>

        <div className="otp-content">
          <h1 className="otp-title">Xác thực Email 📧</h1>
          <p className="otp-subtitle">
            Chúng tôi đã gửi mã OTP gồm 6 số đến
            <br />
            <strong>{email}</strong>
          </p>

          {error && <div className="otp-alert otp-alert-error">{error}</div>}
          {success && <div className="otp-alert otp-alert-success">{success}</div>}

          <div className="otp-input-container">
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
                className="otp-input"
                disabled={loading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            className="otp-verify-button"
            disabled={loading || otpValues.some(v => !v)}
          >
            {loading ? 'Đang xác thực...' : 'Xác thực'}
          </button>

          <div className="otp-resend-section">
            <p>Không nhận được mã?</p>
            <button
              onClick={handleResend}
              className="otp-resend-button"
              disabled={loading || resendCooldown > 0}
            >
              {resendCooldown > 0 
                ? `Gửi lại sau ${resendCooldown}s` 
                : 'Gửi lại mã'}
            </button>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="otp-back-button"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;

