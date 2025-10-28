import React from "react";

export default function SupportCard({ icon, title, description, link }) {
  return (
    <div className="support-card">
      {/* Icon */}
      <div className="icon text-orange-500 text-5xl mb-3">{icon}</div>

      {/* Tiêu đề */}
      <h3 className="font-semibold text-lg mb-3 text-gray-800">{title}</h3>

      {/* Mô tả */}
      <p className="text-gray-600 mb-4 text-sm">{description}</p>

      {/* Link */}
      <a href={link} className="text-orange-600 font-medium hover:underline">
        Xem chi tiết 
      </a>
    </div>
  );
}
