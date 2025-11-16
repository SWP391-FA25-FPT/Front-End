// src/utils/authUtils.js
import Cookies from 'js-cookie';

// Giả định token được lưu trong cookie với tên là 'token' (hoặc tên bạn đã dùng ở backend)
const TOKEN_KEY = 'token'; 

/**
 * @desc Lấy JWT token từ Cookies
 * @returns {string | undefined} Token hoặc undefined nếu không tồn tại
 */
export const getAuthToken = () => {
    // Trả về giá trị của cookie có tên là 'token'
    return Cookies.get(TOKEN_KEY);
};

/**
 * @desc Lưu JWT token vào Cookies
 * @param {string} token - Token cần lưu
 * @param {object} options - Tùy chọn cho Cookies (ví dụ: expires, secure)
 */
export const setAuthToken = (token, options = { expires: 7 }) => {
    // expires: 7 ngày. Bạn có thể thay đổi tùy theo logic Backend của bạn
    Cookies.set(TOKEN_KEY, token, options);
};

/**
 * @desc Xóa JWT token khỏi Cookies khi đăng xuất
 */
export const removeAuthToken = () => {
    Cookies.remove(TOKEN_KEY);
};