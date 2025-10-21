// src/pages/Blog.jsx
import React, { useMemo, useState } from "react";
import { Typography } from "antd";
import { Container } from "react-bootstrap";
import Layout from "../components/layout/SettingLayout";
import Featured from "../components/blog/Featured";
import CategoryPills from "../components/blog/CategoryPills";
import PostGrid from "../components/blog/PostGrid";
import POSTS from "../data/posts.json";
import "../pages/style/blog.css";

const { Title } = Typography;

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

  const filtered = useMemo(
    () =>
      current === "Tất cả"
        ? POSTS
        : POSTS.filter((p) => p.category === current),
    [current]
  );

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
    <React.Fragment>
      <Layout>
        <Container className="tw:py-8 blog-container">
          {/* Hero Section - Bài viết nổi bật */}
          <div className="tw:mb-12 blog-fade-in">
            <Featured post={POSTS[1]} />
          </div>

          {/* Phần bài viết khác */}
          <div className="tw:mb-8">
            <CategoryPills
              current={current}
              categories={CATEGORIES}
              onPick={handleCategoryChange}
            />
          </div>

          <div id="latest" className="blog-fade-in">
            <PostGrid posts={currentPosts} formatDate={formatDate} />
          </div>

          {/* Pagination */}
          {totalPages >= 1 && (
            <div className="blog-pagination">
              {/* Previous button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="blog-pagination-btn"
              >
                ←
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`blog-pagination-btn ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="blog-pagination-btn"
              >
                →
              </button>
            </div>
          )}
        </Container>
      </Layout>
    </React.Fragment>
  );
}
