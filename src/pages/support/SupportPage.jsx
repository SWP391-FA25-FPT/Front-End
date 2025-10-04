import React, { useState } from "react";
import SupportCard from "../../components/support/SupportCard";
import "../style/SupportPage.css";

export default function SupportPage() {
  const [search, setSearch] = useState("");

  const items = [
    {
      icon: "🍎",
      title: "Bắt đầu với M&M",
      description: "Hướng dẫn chi tiết để bắt đầu hành trình dinh dưỡng của bạn",
      link: "/support/getting-started",
    },
    {
      icon: "🥗",
      title: "Theo dõi dinh dưỡng",
      description: "Ghi chép và phân tích chế độ ăn uống hàng ngày",
      link: "/support/nutrition-tracking",
    },
    {
      icon: "📅",
      title: "Lên kế hoạch bữa ăn",
      description: "Tạo thực đơn cân bằng và phù hợp với mục tiêu",
      link: "/support/meal-planner",
    },
    {
      icon: "💳",
      title: "Tài khoản & Thanh toán",
      description: "Quản lý thông tin cá nhân và phương thức thanh toán",
      link: "/support/account-billing",
    },
    {
      icon: "🏆",
      title: "Thử thách & Cộng đồng",
      description: "Tham gia cộng đồng và chinh phục các thử thách",
      link: "/support/challenges-community",
    },
    {
      icon: "🔒",
      title: "Quyền riêng tư & Bảo mật",
      description: "Bảo vệ dữ liệu và quyền riêng tư của bạn",
      link: "/support/privacy-security",
    },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="support-page">
      {/* Phần tiêu đề */}
      <section className="support-header">
        <h1>Trung Tâm Hỗ Trợ</h1>
        <p>Tôi có thể giúp gì cho bạn?</p>
      </section>

      {/* Ô tìm kiếm */}
      <div className="support-search">
        <input
          type="text"
          placeholder="Tìm kiếm hỗ trợ..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Các mục hỗ trợ */}
      <main className="support-grid">
        {filtered.map((item, index) => (
          <div className="support-card" key={index}>
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p className="description">{item.description}</p>
            <a href={item.link}>Xem chi tiết </a>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="support-empty">
            Không tìm thấy mục hỗ trợ phù hợp.
          </p>
        )}
      </main>
    </div>
  );
}
