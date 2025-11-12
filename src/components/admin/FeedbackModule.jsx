import React, { useState } from "react";
import { Modal, Rate, Button, Tag } from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/FeedbackAdmin.css";

export default function FeedbackModule() {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =====================================================================
  // ✅ MOCK DATA (20 FEEDBACK NGƯỜI DÙNG)
  // =====================================================================
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      name: "Uyên Phương",
      avatar: "https://i.pravatar.cc/100?img=1",
      rating: 5,
      content: "Tính năng AI gợi ý món ăn rất thông minh và dễ sử dụng.",
      date: "10/11/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 2,
      name: "Khánh Linh",
      avatar: "https://i.pravatar.cc/100?img=8",
      rating: 4,
      content: "Giao diện đẹp, nhưng tốc độ xử lý đôi khi hơi chậm.",
      date: "09/11/2025",
      status: "Đã phản hồi",
      reply: "Chúng tôi đã tối ưu lại server, cảm ơn đóng góp của bạn!",
    },
    {
      id: 3,
      name: "Minh Triết",
      avatar: "https://i.pravatar.cc/100?img=13",
      rating: 3,
      content: "Ứng dụng tốt nhưng thiếu tính năng xuất báo cáo dinh dưỡng.",
      date: "07/11/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 4,
      name: "Hồng Vy",
      avatar: "https://i.pravatar.cc/100?img=5",
      rating: 5,
      content: "Tôi rất thích giao diện của app. Mọi thứ đều rõ ràng.",
      date: "07/11/2025",
      status: "Đã phản hồi",
      reply: "Cảm ơn bạn đã đánh giá!",
    },
    {
      id: 5,
      name: "Tấn Phát",
      avatar: "https://i.pravatar.cc/100?img=11",
      rating: 4,
      content: "Phần theo dõi calories hoạt động tốt và chính xác.",
      date: "06/11/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 6,
      name: "Mai Hương",
      avatar: "https://i.pravatar.cc/100?img=7",
      rating: 2,
      content: "Không lưu được dữ liệu sau khi đăng xuất.",
      date: "06/11/2025",
      status: "Đã phản hồi",
      reply: "Chúng tôi sẽ cải thiện tính năng này trong bản cập nhật tới.",
    },
    {
      id: 7,
      name: "Lộc",
      avatar: "https://i.pravatar.cc/100?img=15",
      rating: 3,
      content: "Công cụ AI đôi khi đề xuất món ăn không phù hợp sở thích.",
      date: "05/11/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 8,
      name: "Thu Hà",
      avatar: "https://i.pravatar.cc/100?img=17",
      rating: 5,
      content: "Có nhiều món ăn healthy siêu xinh, đúng gu của mình!",
      date: "05/11/2025",
      status: "Đã phản hồi",
      reply: "Cảm ơn bạn đã yêu thích Meta Meal!",
    },
    {
      id: 9,
      name: "Thanh Đạt",
      avatar: "https://i.pravatar.cc/100?img=22",
      rating: 4,
      content: "Ước gì có thêm tính năng cộng đồng để chia sẻ món ăn.",
      date: "04/11/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 10,
      name: "Ngọc Anh",
      avatar: "https://i.pravatar.cc/100?img=19",
      rating: 1,
      content: "App bị crash khi upload hình quá lớn.",
      date: "04/11/2025",
      status: "Đã phản hồi",
      reply: "Lỗi đã được fix trong bản cập nhật mới nhất.",
    },
    {
      id: 11,
      name: "Minh Tâm",
      avatar: "https://i.pravatar.cc/100?img=25",
      rating: 5,
      content: "Tính năng quét hình ảnh nhận biết món ăn quá xịn!",
      date: "03/11/2025",
      status: "Đã phản hồi",
      reply: "Rất vui vì app hỗ trợ tốt cho bạn 💚",
    },
    {
      id: 12,
      name: "Lê Nam",
      avatar: "https://i.pravatar.cc/100?img=28",
      rating: 3,
      content: "Chưa hỗ trợ tìm kiếm công thức theo nguyên liệu.",
      date: "03/11/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 13,
      name: "Quỳnh Như",
      avatar: "https://i.pravatar.cc/100?img=29",
      rating: 4,
      content: "Nhiều công thức ngon và dễ làm.",
      date: "02/11/2025",
      status: "Đã phản hồi",
      reply: "Team sẽ bổ sung thêm nhiều món hơn nữa!",
    },
    {
      id: 14,
      name: "Khải Hoàng",
      avatar: "https://i.pravatar.cc/100?img=30",
      rating: 5,
      content: "Ứng dụng duy nhất mình gắn bó hơn 3 tháng nay ❤️",
      date: "02/11/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 15,
      name: "Thiên Ý",
      avatar: "https://i.pravatar.cc/100?img=32",
      rating: 2,
      content: "Quá nhiều popup quảng cáo trong phiên miễn phí.",
      date: "01/11/2025",
      status: "Đã phản hồi",
      reply: "Meta Meal sẽ giảm số popup trong bản mới.",
    },
    {
      id: 16,
      name: "Mẫn Nhi",
      avatar: "https://i.pravatar.cc/100?img=33",
      rating: 4,
      content: "Có thể lưu thực đơn theo tuần thì tuyệt hơn.",
      date: "01/11/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 17,
      name: "Diễm My",
      avatar: "https://i.pravatar.cc/100?img=35",
      rating: 3,
      content: "Chưa hỗ trợ đo calo bằng camera.",
      date: "30/10/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 18,
      name: "Thanh Thảo",
      avatar: "https://i.pravatar.cc/100?img=36",
      rating: 4,
      content: "Tính năng Premium rất đáng tiền.",
      date: "29/10/2025",
      status: "Đã phản hồi",
      reply: "Cảm ơn bạn đã ủng hộ!",
    },
    {
      id: 19,
      name: "Quốc Việt",
      avatar: "https://i.pravatar.cc/100?img=37",
      rating: 5,
      content: "Ứng dụng tuyệt vời!!!",
      date: "29/10/2025",
      status: "Chưa phản hồi",
      reply: "",
    },
    {
      id: 20,
      name: "Gia Hân",
      avatar: "https://i.pravatar.cc/100?img=38",
      rating: 4,
      content: "Mong app có thêm chế độ ăn cho người giảm cân.",
      date: "28/10/2025",
      status: "Đã phản hồi",
      reply: "Team đang phát triển mục này!",
    },
  ]);

  // =====================================================================
  // HANDLE REPLY SUBMIT
  // =====================================================================
  const handleReply = () => {
    setFeedbacks(
      feedbacks.map((f) =>
        f.id === selectedFeedback.id
          ? { ...f, reply: replyText, status: "Đã phản hồi" }
          : f
      )
    );

    setIsModalOpen(false);
    setReplyText("");
  };

  // =====================================================================
  // RATING SUMMARY
  // =====================================================================
  const averageRating =
    feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length;

  const countRates = (star) => feedbacks.filter((f) => f.rating === star).length;

  return (
    <div className="feedback-container">
      {/* ====== RATING OVERVIEW ====== */}
      <div className="rating-overview">

        {/* LEFT: DISTRIBUTION */}
        <div className="rating-bars">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="rating-row">
              <span className="rating-label">{star} sao</span>

              <div className="bar">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(countRates(star) / feedbacks.length) * 100 || 2
                      }%`,
                  }}
                ></div>
              </div>

              <span className="rating-count">{countRates(star)}</span>
            </div>
          ))}
        </div>

        {/* RIGHT: AVERAGE */}
        <div className="rating-summary-card">
          <h2>{averageRating.toFixed(1)}</h2>
          <Rate value={averageRating} allowHalf disabled />
          <p className="rating-total">{feedbacks.length} lượt đánh giá</p>
        </div>
      </div>

      {/* FEEDBACK LIST */}
      <h3 className="feedback-title">Phản hồi gần đây</h3>

      <div className="feedback-list">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <img src={fb.avatar} alt="user" className="avatar" />
            <div className="feedback-info">
              <div className="header-row">
                <h4>{fb.name}</h4>
                <Rate disabled defaultValue={fb.rating} />
              </div>
              <p>{fb.content}</p>
              <small>{fb.date}</small>

              <div className="status-row">
                <Tag color={fb.status === "Đã phản hồi" ? "green" : "red"}>
                  {fb.status}
                </Tag>

                <Button
                  type="link"
                  onClick={() => {
                    setSelectedFeedback(fb);
                    setReplyText(fb.reply || "");
                    setIsModalOpen(true);
                  }}
                >
                  <Icon icon="mdi:reply" style={{ marginRight: 4 }} />
                  Trả lời
                </Button>
              </div>

              {fb.reply && (
                <div className="reply-box">
                  <Icon icon="mdi:message-reply-text" />
                  <span>
                    <strong>Phản hồi:</strong> {fb.reply}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleReply}
        okText="Gửi phản hồi"
        cancelText="Hủy"
      >
        <h3>Trả lời phản hồi của người dùng</h3>
        <textarea
          className="reply-input"
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Nhập nội dung phản hồi..."
        />
      </Modal>
    </div>
  );
}
