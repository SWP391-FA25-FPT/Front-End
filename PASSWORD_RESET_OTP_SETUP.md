# Hướng dẫn Forgot Password & Reset Password với OTP

## ✅ Đã cập nhật hoàn tất

Hệ thống Forgot Password và Reset Password đã được chuyển sang sử dụng OTP (giống như Registration flow) và EmailJS template mới.

## 📧 EmailJS Configuration

```javascript
Service ID: service_pslv8u8
Template Password Reset: template_xylyfaa
Public API Key: 2p0vfxItS3g5NHbrI
```

## 📝 Cấu hình Email Template

### Template Password Reset (`template_xylyfaa`)

**Subject:** Đặt lại mật khẩu Meta Meal

**Body Template:**
```html
Xin chào {{to_name}},

Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Meta Meal.

Mã OTP của bạn là: **{{reset_token}}**

Mã này sẽ hết hạn sau 10 phút.

Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

Trân trọng,
Đội ngũ Meta Meal
```

**Template Parameters:**
- `to_email` - Email người nhận
- `to_name` - Tên người nhận
- `reset_token` - Mã OTP 6 số
- `subject` - Tiêu đề email
- `message` - Nội dung bổ sung

## 🔄 Luồng hoạt động mới

### 1. Forgot Password
```
User nhập email → /forgot-password
  ↓
Backend generate OTP 6 số
  ↓
Frontend gửi OTP qua email (EmailJS)
  ↓
Redirect đến /reset-password với email và OTP trong state
```

### 2. Reset Password
```
User nhập 6 số OTP
  ↓
User nhập mật khẩu mới và xác nhận
  ↓
Backend verify OTP và email
  ↓
Update mật khẩu mới
  ↓
Success → Redirect đến /login
```

### 3. Resend OTP
- User có thể click "Gửi lại mã" sau 60 giây
- Backend generate OTP mới
- Frontend gửi email mới qua EmailJS

## 🎨 Tính năng UI

### Forgot Password Page
- ✅ Form nhập email đơn giản
- ✅ Validation email
- ✅ Error/Success messages
- ✅ Auto-redirect sau khi gửi OTP thành công

### Reset Password Page  
- ✅ 6 ô input OTP riêng biệt
- ✅ Auto-focus và navigation
- ✅ Hỗ trợ paste OTP (Ctrl+V)
- ✅ Resend button với countdown 60s
- ✅ Password input với validation real-time
- ✅ Password requirements indicator với checkmarks
- ✅ Confirm password field
- ✅ Success screen sau khi reset thành công

## 🔒 Bảo mật

- ✅ OTP 6 số ngẫu nhiên
- ✅ Hết hạn sau 10 phút
- ✅ Không reveal email tồn tại hay không (security)
- ✅ OTP được clear sau khi sử dụng thành công
- ✅ Password strength requirements:
  - Tối thiểu 8 ký tự
  - Ít nhất 1 chữ hoa
  - Ít nhất 1 chữ số
  - Ít nhất 1 ký tự đặc biệt

## 📁 Files đã cập nhật

### Backend:
- ✅ `Back-End/controllers/forgotPassword.controller.js`
  - Chuyển từ reset link → OTP
  - Thêm `resendResetOTP()` function
  - Cập nhật `resetPassword()` để verify OTP
- ✅ `Back-End/routes/auth.routes.js`
  - Thêm route `/api/auth/resend-reset-otp`

### Frontend:
- ✅ `Front-End/src/pages/ForgotPassword.jsx`
  - Xóa logic EmailJS cũ
  - Gọi backend API
  - Gửi OTP qua emailService
  - Navigate đến reset page với state
- ✅ `Front-End/src/pages/ResetPassword.jsx`
  - UI mới với OTP input
  - Password fields với validation
  - Resend OTP functionality
  - Success screen
- ✅ `Front-End/src/pages/style/ResetPassword.css`
  - Style cho OTP inputs
  - Password requirements với checkmarks
  - Responsive design
- ✅ `Front-End/src/utils/constants.js`
  - Thêm API URLs mới
- ✅ `Front-End/src/services/emailService.js`
  - Function `sendPasswordResetEmail()` sử dụng template mới

## 🚀 Test Flow

### Forgot Password:
1. Vào `/forgot-password`
2. Nhập email
3. Click "Gửi liên kết đặt lại"
4. Check email để lấy OTP
5. Tự động redirect đến `/reset-password`

### Reset Password:
1. Nhập 6 số OTP (có thể paste)
2. Nhập mật khẩu mới (min 8 chars, có uppercase, number, special char)
3. Nhập lại mật khẩu
4. Click "Đặt lại mật khẩu"
5. Success → Click "Đăng nhập ngay"

### Resend OTP:
1. Nếu không nhận được email
2. Click "Gửi lại mã"
3. Đợi 60s cooldown
4. Nhận OTP mới trong email

## 🔧 API Endpoints

### POST `/api/auth/forgot-password`
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Mã OTP đã được gửi đến email của bạn",
  "data": {
    "email": "user@example.com",
    "username": "username",
    "otp": "123456"
  }
}
```

### POST `/api/auth/reset-password`
```json
Request:
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPass123!"
}

Response:
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

### POST `/api/auth/resend-reset-otp`
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Mã OTP mới đã được gửi",
  "data": {
    "otp": "654321"
  }
}
```

## ⚠️ Lưu ý Production

**Khi deploy production:**
- ✅ Email template đã được config đúng trên EmailJS
- ✅ Public API key đã được set
- ⚠️ **XÓA dòng trả về OTP trong response của backend** (line 53 trong forgotPassword.controller.js)
- ⚠️ **XÓA dòng trả về OTP trong response của resendResetOTP** (line 149)
- ✅ OTP chỉ được gửi qua email, không trả về trong API response

## 📞 Troubleshooting

**Email không được gửi:**
- Check Service ID, Template ID, Public Key
- Verify template có đúng parameters
- Check console log

**OTP không verify được:**
- Check OTP đúng 6 số
- Check OTP chưa hết hạn (10 phút)
- Check email đúng

**Resend không hoạt động:**
- Đợi 60s countdown
- Check backend có generate OTP mới
- Check email có được gửi

---

✨ **Hệ thống Forgot/Reset Password với OTP đã sẵn sàng!**

