// src/pages/Blog.jsx
import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import { Container } from "react-bootstrap";
import Layout from "../components/layout/SettingLayout";
import Featured from "../components/blog/Featured";
import CategoryPills from "../components/blog/CategoryPills";
import PostGrid from "../components/blog/PostGrid";
import { getAllBlogs, getTopBlogsByViews } from "../apis/blog";
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
  if (!iso) return "N/A";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error, iso);
    return "N/A";
  }
}

export default function Blog() {
  const [current, setCurrent] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 6; // Hiển thị 6 bài viết mỗi trang

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        console.log("Fetching blogs from API...");

        // Fetch featured blog (top views) and all blogs
        const [featuredResponse, blogsResponse] = await Promise.all([
          getTopBlogsByViews(1),
          getAllBlogs({ limit: 100 }),
        ]);

        console.log("Featured Response:", featuredResponse);
        console.log("Blogs Response:", blogsResponse);

        if (
          featuredResponse.success &&
          featuredResponse.data &&
          featuredResponse.data.length > 0
        ) {
          console.log("Featured blog loaded:", featuredResponse.data[0]);
          setFeaturedBlog(featuredResponse.data[0]);
        }

        if (blogsResponse.success && blogsResponse.data) {
          console.log("Blogs loaded successfully:", blogsResponse.data.length);
          setBlogs(blogsResponse.data);
        } else {
          console.error("Invalid response format:", blogsResponse);
          setError("Không thể tải danh sách blog");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(`Đã xảy ra lỗi khi tải dữ liệu: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs by category
  const filtered = React.useMemo(
    () =>
      current === "Tất cả"
        ? blogs
        : blogs.filter((p) => p.category === current),
    [current, blogs]
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
            <p>Đang tải dữ liệu...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container className="py-5 blog-container">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <React.Fragment>
      <Layout>
        <Container className="py-5 blog-container">
          {/* Hero Section - Bài viết nổi bật */}
          {featuredBlog && (
            <div className="mb-5 blog-fade-in">
              <Featured post={featuredBlog} />
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
