import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAIL_CONFIG = {
  SERVICE_ID: 'service_pslv8u8',
  TEMPLATE_VERIFY_ACCOUNT: 'template_qlzmdxf',
  TEMPLATE_PASSWORD_RESET: 'template_xylyfaa',
  PUBLIC_KEY: '2p0vfxItS3g5NHbrI'
};

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

/**
 * Send OTP verification email
 * @param {string} toEmail - Recipient email address
 * @param {string} toName - Recipient name
 * @param {string} otp - OTP code
 * @returns {Promise} - EmailJS response
 */
export const sendVerificationEmail = async (toEmail, toName, otp) => {
  try {
    // Gửi tất cả các parameters có thể để phù hợp với template hiện có
    const templateParams = {
      to_email: toEmail,
      email: toEmail, // backup
      to_name: toName,
      user_name: toName, // backup
      otp: otp, // ⭐ Template EmailJS dùng {{otp}}
      otp_code: otp, // backup
      reset_token: otp, // backup nếu template dùng field này
      from_name: 'Meta Meal',
      subject: 'Xác thực tài khoản Meta Meal',
      message: `Xin chào ${toName}, mã OTP xác thực tài khoản của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.`
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_VERIFY_ACCOUNT,
      templateParams
    );

    console.log('Verification email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error: error.text || error.message };
  }
};

/**
 * Send password reset email with link
 * @param {string} toEmail - Recipient email address
 * @param {string} toName - Recipient name
 * @param {string} resetLink - Full reset password link
 * @returns {Promise} - EmailJS response
 */
export const sendPasswordResetEmail = async (toEmail, toName, resetLink) => {
  try {
    // Template dùng {{reset_url}} để hiển thị link reset password
    const templateParams = {
      to_email: toEmail,
      email: toEmail, // backup
      to_name: toName,
      user_name: toName, // backup
      reset_url: resetLink, // ⭐ LINK đầy đủ để reset password
      link: resetLink, // backup
      from_name: 'Meta Meal',
      subject: 'Đặt lại mật khẩu Meta Meal',
      message: `Xin chào ${toName}, vui lòng click vào link sau để đặt lại mật khẩu: ${resetLink}. Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_PASSWORD_RESET,
      templateParams
    );

    console.log('Password reset email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error: error.text || error.message };
  }
};

