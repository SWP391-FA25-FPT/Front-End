// src/pages/Blog.jsx
import React, { useMemo, useState } from "react";
import Header from "@/components/blog/Header";
import Featured from "@/components/blog/Featured";
import CategoryPills from "@/components/blog/CategoryPills";
import PostGrid from "@/components/blog/PostGrid";
import { Button } from "@/components/blog/ui";

const CATEGORIES = [

  "Tất cả",
  "Mẹo nhà bếp",
  "Thực đơn tuần",
  "Dụng cụ bếp",
  "Ăn theo mùa",
  "Kỹ thuật nấu",
  "Meal Prep",

];

const POSTS = [

  {
    id: 1,
    title: "5 mẹo nấu ăn nhanh mà vẫn ngon cho người bận rộn",
    excerpt:
      "Tiết kiệm 30 phút mỗi tối với những mẹo nhỏ nhưng hiệu quả, từ chuẩn bị nguyên liệu đến tối ưu dụng cụ...",
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
    author: "Bếp Nhàn",
    authorAvatar: "https://i.pravatar.cc/80?img=22",
    date: "2025-09-10",
    category: "Meal Prep",
    image:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1200&auto=format&fit=crop",
  },

];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Blog() {
  const [current, setCurrent] = useState("Tất cả");
  const filtered = useMemo(() => (current === "Tất cả" ? POSTS : POSTS.filter(p => p.category === current)), [current]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <Featured post={POSTS[1]} />

      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mt-12 space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold">Bài viết nổi bật & mới nhất</h2>
        </div>

        <CategoryPills current={current} categories={CATEGORIES} onPick={setCurrent} />

        <div className="mt-4" id="latest">
          <PostGrid posts={filtered.slice(0,9)} formatDate={formatDate} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="outline" disabled={current==="Tất cả"} onClick={() => setCurrent("Tất cả")}>Xem tất cả</Button>
        </div>
      </section>
    </div>
  );
}
