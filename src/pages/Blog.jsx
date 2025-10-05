// src/pages/Blog.jsx
import React, { useMemo, useState } from "react";
import Header from "@/components/blog/Header";
import Featured from "@/components/blog/Featured";
import CategoryPills from "@/components/blog/CategoryPills";
import PostGrid from "@/components/blog/PostGrid";
import { Button } from "@/components/blog/ui";
import { POSTS } from "@/data/posts";

const CATEGORIES = [

  "Tất cả",
  "Mẹo nhà bếp",
  "Thực đơn tuần",
  "Dụng cụ bếp",
  "Ăn theo mùa",
  "Kỹ thuật nấu",
  "Meal Prep",

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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Hiển thị 6 bài viết mỗi trang
  
  const filtered = useMemo(() => (current === "Tất cả" ? POSTS : POSTS.filter(p => p.category === current)), [current]);
  
  // Tính toán pagination
  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filtered.slice(startIndex, endIndex);
  
  // Reset về trang 1 khi thay đổi category
  const handleCategoryChange = (category) => {
    setCurrent(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <Featured post={POSTS[1]} />

      <section className="w-full px-4 md:px-6 lg:px-8 mt-12 space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-black">Bài viết nổi bật & mới nhất</h2>
        </div>

        <CategoryPills current={current} categories={CATEGORIES} onPick={handleCategoryChange} />

        <div className="mt-4" id="latest">
          <PostGrid posts={currentPosts} formatDate={formatDate} />
        </div>

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {/* Previous button */}
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-2 border-black border-2 text-black hover:bg-orange-100"
            >
              ←
            </Button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 min-w-[40px] border-black border-2 ${
                  currentPage === page 
                    ? "bg-orange-500! text-white" 
                    : "bg-white text-neutral-700 hover:bg-orange-100"
                }`}
              >
                {page}
              </Button>
            ))}
            
            {/* Next button */}
            <Button 
              variant="outline" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-2 border-black border-2 text-black hover:bg-orange-100"
            >
              →
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
