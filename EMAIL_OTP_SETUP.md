# Hướng dẫn cấu hình Email OTP với EmailJS

## ✅ Đã tích hợp

Hệ thống OTP verification qua email đã được tích hợp hoàn toàn vào ứng dụng.

## 📧 Thông tin EmailJS đã cấu hình

```javascript
Service ID: service_pslv8u8
Template Verify Account: template_qlzmdxf
Template Password Reset: template_xylyfaa
Public API Key: 2p0vfxItS3g5NHbrI
```

## 📝 Cấu hình Email Template trên EmailJS

### Template cho Verify Account (template_qlzmdxf)

**Subject:** Xác thực tài khoản Meta Meal

**Body Template:**
```html
Xin chào {{to_name}},

Cảm ơn bạn đã đăng ký tài khoản Meta Meal!

Mã OTP xác thực của bạn là: **{{otp_code}}**

Mã này sẽ hết hạn sau 10 phút.

Vui lòng không chia sẻ mã này với bất kỳ ai.

Trân trọng,
Đội ngũ Meta Meal
```

**Template Parameters cần có:**
- `to_email`: Email người nhận
- `to_name`: Tên người nhận
- `otp_code`: Mã OTP 6 số
- `subject`: Tiêu đề email
- `message`: Nội dung bổ sung

### Template cho Password Reset (template_xylyfaa)

**Subject:** Đặt lại mật khẩu Meta Meal

**Body Template:**
```html
Xin chào {{to_name}},

Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Meta Meal.

Mã xác thực của bạn là: **{{reset_token}}**

Mã này sẽ hết hạn sau 10 phút.

Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

Trân trọng,
Đội ngũ Meta Meal
```

**Template Parameters cần có:**
- `to_email`: Email người nhận
- `to_name`: Tên người nhận
- `reset_token`: Mã reset password
- `subject`: Tiêu đề email
- `message`: Nội dung bổ sung

## 🔄 Luồng hoạt động OTP

### 1. Đăng ký tài khoản mới
```
User điền form đăng ký 
  ↓
Backend tạo user và generate OTP
  ↓
Frontend nhận OTP và gửi email qua EmailJS
  ↓
User nhập OTP trên trang /verify-otp
  ↓
Backend verify OTP
  ↓
Đăng nhập thành công → Survey (nếu first login) hoặc Homepage
```

### 2. Resend OTP
- User có thể click "Gửi lại mã" sau 60 giây
- Backend generate OTP mới
- Frontend gửi email mới qua EmailJS

## 🎨 Tính năng UI

- ✅ 6 ô input OTP riêng biệt
- ✅ Auto-focus và auto-submit
- ✅ Hỗ trợ paste mã OTP
- ✅ Countdown 60s cho resend button
- ✅ Responsive design
- ✅ Real-time validation
- ✅ Error và success messages

## 🔒 Bảo mật

- OTP hết hạn sau 10 phút
- Mã OTP 6 số ngẫu nhiên
- Không thể resend liên tục (cooldown 60s)
- Email verification required trước khi login

## 📁 Files đã tạo/sửa

### Frontend:
- ✅ `Front-End/src/services/emailService.js` - Service gửi email
- ✅ `Front-End/src/pages/OTPVerification.jsx` - Trang verify OTP
- ✅ `Front-End/src/pages/style/OTPVerification.css` - Style cho OTP page
- ✅ `Front-End/src/apis/auth.js` - Thêm verifyOTP và resendOTP APIs
- ✅ `Front-End/src/pages/Login.jsx` - Cập nhật register flow
- ✅ `Front-End/src/App.jsx` - Thêm route /verify-otp
- ✅ `Front-End/src/utils/constants.js` - Thêm API URLs

### Backend:
- ✅ `Back-End/models/User.model.js` - Thêm OTP fields
- ✅ `Back-End/controllers/auth.controller.js` - Thêm verify/resend OTP
- ✅ `Back-End/routes/auth.routes.js` - Thêm routes OTP

## 🚀 Test Flow

1. Vào `/login` và click "TẠO TÀI KHOẢN MỚI"
2. Điền thông tin và submit
3. Sẽ redirect đến `/verify-otp`
4. Check email để lấy mã OTP
5. Nhập 6 số OTP
6. Verify thành công → Redirect đến Survey hoặc Homepage

## 🔧 Cấu hình Local Development

Nếu muốn test local mà không gửi email thật:
- Backend đang trả về OTP trong response (dòng 65 trong auth.controller.js)
- Comment dòng gửi email trong OTPVerification.jsx để skip gửi email
- OTP sẽ hiển thị trong console/response

## ⚠️ Lưu ý Production

Khi deploy production:
- ✅ Email template đã được configure trên EmailJS
- ✅ Public API key đã được set
- ⚠️ Nên xóa dòng trả về OTP trong response ở backend (line 65)
- ⚠️ Đảm bảo CORS được cấu hình đúng cho EmailJS

## 📞 Troubleshooting

**Email không được gửi:**
- Kiểm tra Service ID, Template ID, Public Key
- Check console log để xem lỗi từ EmailJS
- Verify email template có đúng parameters

**OTP không verify được:**
- Check OTP có đúng 6 số
- Check OTP chưa hết hạn (10 phút)
- Check user đã được tạo trong database

**Resend không hoạt động:**
- Đợi 60s countdown
- Check backend có generate OTP mới
- Check email có được gửi

---

✨ **Hệ thống OTP đã sẵn sàng sử dụng!**

