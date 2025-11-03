// src/pages/Blog.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Typography, Empty, Spin } from "antd";
import { Container } from "react-bootstrap";
import Layout from "../components/layout/SettingLayout";
import Featured from "../components/blog/Featured";
import CategoryPills from "../components/blog/CategoryPills";
import PostGrid from "../components/blog/PostGrid";
import { getAllBlogs, getFeaturedBlog } from "../apis/blog";
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
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6; // Hiển thị 6 bài viết mỗi trang

  // Helper function to transform blog data
  const transformBlog = (blog) => ({
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
    viewCount: blog.viewCount || blog.views || 0,
  });

  // Fetch blogs from API
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);

        // Fetch featured blog and all blogs in parallel
        const [featuredResult, blogsResult] = await Promise.all([
          getFeaturedBlog().catch((err) => {
            console.log("Featured blog API not available or error:", err);
            return null;
          }),
          getAllBlogs({
            page: 1,
            limit: 100, // Get all published blogs
          }),
        ]);

        // Transform all blogs first
        const transformedPosts = blogsResult.data.map(transformBlog);

        // Try to get featured blog from API, or fallback to highest view blog
        let featured = null;

        // Check different response formats from API
        if (featuredResult) {
          if (featuredResult.data) {
            featured = transformBlog(featuredResult.data);
          } else if (featuredResult._id || featuredResult.slug) {
            // API might return blog object directly
            featured = transformBlog(featuredResult);
          }
        }

        // Fallback: Get blog with highest view count from the list if no featured from API
        if (!featured && transformedPosts.length > 0) {
          featured = transformedPosts.reduce((max, post) =>
            (post.viewCount || 0) > (max.viewCount || 0) ? post : max
          );
        }

        // Get featured blog ID to exclude from list
        const featuredId = featured ? featured.id : null;

        // Filter out featured blog from posts list
        const postsWithoutFeatured = featuredId
          ? transformedPosts.filter((post) => post.id !== featuredId)
          : transformedPosts;

        setFeaturedPost(featured);
        setPosts(postsWithoutFeatured);
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
          {featuredPost && (
            <div className="mb-5 blog-fade-in">
              <Featured post={featuredPost} />
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
