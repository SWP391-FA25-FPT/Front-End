import React from "react";
// NOTE: Thêm import useNavigate
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react'; // Thêm icon cho chuyên nghiệp

export default function SupportCard({ icon, title, description, link }) {
  // NOTE: Khởi tạo hook
  const navigate = useNavigate();

  // NOTE: Tạo hàm xử lý click
  const handleNavigate = (e) => {
    e.preventDefault(); // Ngăn thẻ <a> tải lại trang
    navigate(link);     // Dùng navigate để chuyển trang
  };

  return (
    // NOTE: Thêm onClick vào thẻ cha để click vào đâu cũng đi
    <div className="support-card" onClick={handleNavigate}>
      {/* Icon */}
      {/* NOTE: Sửa lại để dùng Iconify */}
      <div className="icon text-orange-500 text-5xl mb-3">
        {/* Sẽ nhận "ph:apple-logo-bold" và hiển thị icon */}
        <Icon icon={icon} /> 
      </div>

      {/* Tiêu đề */}
      <h3 className="font-semibold text-lg mb-3 text-gray-800">{title}</h3>

      {/* Mô tả */}
      <p className="text-gray-600 mb-4 text-sm">{description}</p>

      {/* Link */}
      {/* NOTE: Sửa thẻ <a> */}
      <a 
        href={link} 
        onClick={handleNavigate} // Thêm onClick
        className="text-orange-600 font-medium hover:underline"
      >
        Xem chi tiết
      </a>
    </div>
  );
}