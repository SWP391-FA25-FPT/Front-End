// src/pages/Blog.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Typography, Empty, Spin } from "antd";
import { Container } from "react-bootstrap";
import Layout from "../components/layout/SettingLayout";
import Featured from "../components/blog/Featured";
import CategoryPills from "../components/blog/CategoryPills";
import PostGrid from "../components/blog/PostGrid";
import { getAllBlogs } from "../apis/blog";
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6; // Hiển thị 6 bài viết mỗi trang

  // Fetch blogs from API
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const result = await getAllBlogs({
          page: 1,
          limit: 100, // Get all published blogs
        });

        // Transform API data to match frontend format
        const transformedPosts = result.data.map((blog) => ({
          id: blog._id || blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          author: blog.author,
          authorAvatar: blog.authorAvatar,
          date: blog.publishedAt
            ? new Date(blog.publishedAt).toISOString().split("T")[0]
            : blog.date,
          category: blog.category,
          image: blog.imageUrl,
        }));

        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error loading blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const filtered = useMemo(
    () =>
      current === "Tất cả"
        ? posts
        : posts.filter((p) => p.category === current),
    [current, posts]
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

  if (loading) {
    return (
      <Layout>
        <Container className="py-5 blog-container">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-3">Đang tải...</div>
          </div>
        </Container>
      </Layout>
    );
  }

  if (posts.length === 0) {
    return (
      <Layout>
        <Container className="py-5 blog-container">
          <Empty
            description="Chưa có bài viết nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: "60px 0" }}
          />
        </Container>
      </Layout>
    );
  }

  return (
    <React.Fragment>
      <Layout>
        <Container className="py-5 blog-container">
          {/* Hero Section - Bài viết nổi bật */}
          {posts.length > 0 && (
            <div className="mb-5 blog-fade-in">
              <Featured post={posts[1] || posts[0]} />
            </div>
          )}

          {/* Phần bài viết khác */}
          <div className="mb-4">
            <CategoryPills
              current={current}
              categories={CATEGORIES}
              onPick={handleCategoryChange}
            />
          </div>

          {filtered.length === 0 ? (
            <Empty
              description={`Không có bài viết trong danh mục "${current}"`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: "40px 0" }}
            />
          ) : (
            <div id="latest" className="blog-fade-in">
              <PostGrid posts={currentPosts} formatDate={formatDate} />
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && totalPages > 1 && (
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
