import React from "react";

export default function SupportCard({ icon, title, link }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition">
      <div className="text-4xl mb-3 text-orange-500">{icon}</div>
      <h3 className="font-semibold text-lg mb-2 text-gray-800">{title}</h3>
      <a href={link} className="text-orange-600 font-medium hover:underline">
        Xem chi tiết →
      </a>
    </div>
  );
}
