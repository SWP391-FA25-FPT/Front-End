// src/data/posts.js
export const POSTS = [
  {
    id: 1,
    title: "5 mẹo nấu ăn nhanh mà vẫn ngon cho người bận rộn",
    excerpt:
      "Tiết kiệm 30 phút mỗi tối với những mẹo nhỏ nhưng hiệu quả, từ chuẩn bị nguyên liệu đến tối ưu dụng cụ...",
    content:
      "Nội dung chi tiết cho bài viết 1. Đây là phần mô phỏng nội dung để hiển thị khi vào trang chi tiết.",
    author: "Cookpad Team",
    authorAvatar: "https://i.pravatar.cc/80?img=12",
    date: "2025-09-24",
    category: "Mẹo nhà bếp",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Gợi ý thực đơn tuần: 7 món thanh đạm mà đủ chất",
    excerpt:
      "Thực đơn theo ngày với nguyên liệu dễ mua, kèm gợi ý chuẩn bị trước để bạn nhàn hơn trong tuần.",
    content: "Một tuần ăn lành mạnh không chỉ giúp cơ thể nhẹ nhàng mà còn duy trì năng lượng bền bỉ suốt ngày dài. Bộ thực đơn này được thiết kế với nguyên tắc “ít dầu mỡ – nhiều dinh dưỡng – dễ chế biến”, đảm bảo cân bằng giữa đạm, tinh bột, chất xơ và vitamin.\nMỗi bữa ăn đều sử dụng nguyên liệu tự nhiên, tươi mới, ưu tiên rau củ, đậu hũ, cá, ức gà và ngũ cốc nguyên hạt.\nThực đơn phù hợp cho người ăn healthy, giảm cân hoặc cần duy trì vóc dáng, nhưng vẫn đủ năng lượng cho học tập và làm việc.\nCác món được sắp xếp theo từng ngày, giúp bạn dễ dàng lên kế hoạch mua sắm và nấu nướng.\nChỉ cần vài phút chuẩn bị, bạn sẽ có một tuần tràn đầy dinh dưỡng mà không lo ngán.\nCùng bắt đầu hành trình ăn sạch – sống khỏe ngay hôm nay nhé!",
    author: "Lan Anh",
    authorAvatar: "https://i.pravatar.cc/80?img=5",
    date: "2025-09-20",
    category: "Thực đơn tuần",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Cách chọn nồi chảo an toàn cho sức khoẻ",
    excerpt:
      "So sánh inox, gang, gốm phủ và chống dính – ưu nhược điểm và khi nào nên dùng loại nào.",
    content: "Nội dung chi tiết cho bài viết 3.",
    author: "Hà Mi",
    authorAvatar: "https://i.pravatar.cc/80?img=14",
    date: "2025-08-30",
    category: "Dụng cụ bếp",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Thực hành ăn theo mùa: rau quả tháng 10",
    excerpt:
      "Danh sách rau củ quả ngon mùa này, lưu ngay để đi chợ thông minh hơn!",
    content: "Nội dung chi tiết cho bài viết 4.",
    author: "Minh Châu",
    authorAvatar: "https://i.pravatar.cc/80?img=36",
    date: "2025-09-28",
    category: "Ăn theo mùa",
    image:
      "https://images.unsplash.com/photo-1511690078903-7b54b58f0b4a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Bí kíp ướp thịt chuẩn đầu bếp",
    excerpt:
      "Tỉ lệ vàng cho từng loại thịt và 3 lỗi thường gặp khiến món nướng bị khô.",
    content: "Nội dung chi tiết cho bài viết 5.",
    author: "Quốc Việt",
    authorAvatar: "https://i.pravatar.cc/80?img=31",
    date: "2025-07-15",
    category: "Kỹ thuật nấu",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Meal prep 101: chuẩn bị 10 phần ăn trong 90 phút",
    excerpt:
      "Một quy trình đơn giản để nấu một lần ăn cả tuần, phù hợp người mới bắt đầu.",
    content: "Nội dung chi tiết cho bài viết 6.",
    author: "Bếp Nhàn",
    authorAvatar: "https://i.pravatar.cc/80?img=22",
    date: "2025-09-10",
    category: "Meal Prep",
    image:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1200&auto=format&fit=crop",
  },
];

export function findPostById(id) {
  return POSTS.find((p) => Number(p.id) === Number(id));
}
