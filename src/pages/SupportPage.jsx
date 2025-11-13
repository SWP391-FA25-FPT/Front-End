import React, { useState } from "react";
import AppLayout from "../components/layout/AppLayout"; // <--- Đã sửa lỗi: Giả định AppLayout là component layout chính
import { Container } from "react-bootstrap";
import SupportCard from "../components/support/SupportCard";
import { useTheme } from "../context/ThemeContext"; // <--- Bổ sung để sử dụng theme

import "./style/SupportPage.css";

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const { themeMode } = useTheme(); // <--- Bổ sung: Lấy themeMode

  // NOTE: Đã SỬA LẠI icon từ Emoji sang tên Iconify
  const items = [
    {
      icon: "ph:apple-logo-bold", // <-- Sửa 1
      title: "Bắt đầu với M&M",
      description:
        "Hướng dẫn chi tiết để bắt đầu hành trình dinh dưỡng của bạn",
      link: "/support/getting-started",
    },
    {
      icon: "ph:chart-pie-slice-bold", // <-- Sửa 2
      title: "Theo dõi dinh dưỡng",
      description: "Ghi chép và phân tích chế độ ăn uống hàng ngày",
      link: "/support/nutrition-tracking",
    },
    {
      icon: "ph:calendar-check-bold", // <-- Sửa 3
      title: "Lên kế hoạch bữa ăn",
      description: "Tạo thực đơn cân bằng và phù hợp với mục tiêu",
      link: "/support/meal-planner",
    },
    {
      icon: "ph:credit-card-bold", // <-- Sửa 4
      title: "Tài khoản & Thanh toán",
      description: "Quản lý thông tin cá nhân và phương thức thanh toán",
      link: "/support/account-billing",
    },
    {
      icon: "ph:trophy-bold", // <-- Sửa 5
      title: "Thử thách & Cộng đồng",
      description: "Tham gia cộng đồng và chinh phục các thử thách",
      link: "/support/challenges-community",
    },
    {
      icon: "ph:lock-key-bold", // <-- Sửa 6
      title: "Quyền riêng tư & Bảo mật",
      description: "Bảo vệ dữ liệu và quyền riêng tư của bạn",
      link: "/support/privacy-security",
    },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <Container 
        className="py-4"
        // Bổ sung style để đảm bảo nền container đổi màu
        style={{ 
          backgroundColor: 'var(--color-bg-body)',
          color: 'var(--color-text-primary)'
        }}
      >
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
              // Bổ sung style để Input đổi màu nền/chữ
              style={{ 
                backgroundColor: 'var(--color-bg-elevated)',
                color: 'var(--color-text-primary)',
                border: `1px solid var(--color-primary-faded)`
              }}
            />
          </div>

          {/* Các mục hỗ trợ */}
          <main className="support-grid">
            {filtered.map((item, index) => (
              <SupportCard
                key={index}
                icon={item.icon} // Sẽ truyền "ph:apple-logo-bold"
                title={item.title}
                description={item.description}
                link={item.link}
              />
            ))}
            {filtered.length === 0 && (
              <p className="support-empty">
                Không tìm thấy mục hỗ trợ phù hợp.
              </p>
            )}
          </main>
        </div>
      </Container>
    </AppLayout>
  );
}