// src/pages/BlogDetail.jsx
import React, {
  useEffect,
  useState,
  // === EM ĐÃ XÓA CÁC IMPORT KHÔNG CẦN THIẾT (useRef, useContext, v.v...) ===
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
// === EM ĐÃ XÓA IMPORT LIÊN QUAN ĐẾN MESSAGE/SOCKET ===

import { getBlogById } from "../apis/blog";
import { getAllRecipes } from "../apis/recipe";
import ReactionBar from "../components/blog/ReactionBar";
import Comments from "../components/blog/Comments";
import Rating from "../components/blog/Rating";
import CardRecent from "../components/CardRecent/CardRecent";
import Layout from "../components/layout/SettingLayout";
import "../pages/style/blogdetail.css";

// === EM ĐÃ XÓA TOÀN BỘ COMPONENT 'AuthorDropdown' Ở ĐÂY ===

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const fetchedIds = React.useRef(new Set());

  useEffect(() => {
    // Prevent double fetch in React StrictMode for the same id
    if (fetchedIds.current.has(id)) return;
    fetchedIds.current.add(id);

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlogById(id);
        if (response.success && response.data) {
          setPost(response.data);

          // Fetch related recipes
          if (
            response.data.relatedRecipes &&
            response.data.relatedRecipes.length > 0
          ) {
            setRelatedRecipes(response.data.relatedRecipes);
          } else if (response.data.tags && response.data.tags.length > 0) {
            const recipesResponse = await getAllRecipes({
              tags: response.data.tags.slice(0, 2).join(","),
              limit: 4,
            });
            if (recipesResponse.success && recipesResponse.data) {
              setRelatedRecipes(recipesResponse.data);
            }
          } else {
            const recipesResponse = await getAllRecipes({ limit: 4 });
            if (recipesResponse.success && recipesResponse.data) {
              setRelatedRecipes(recipesResponse.data);
            }
          }
        } else {
          setError("Không tìm thấy blog");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  function getTopEmotes(postId) {
    try {
      const raw = localStorage.getItem(`post:${postId}:reactions`);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const counts = parsed && parsed.counts ? parsed.counts : parsed || {};
      const EMOTIONS = [
        { key: "like", label: "👍" },
        { key: "love", label: "❤️" },
        { key: "haha", label: "😂" },
        { key: "wow", label: "😮" },
        { key: "sad", label: "😢" },
        { key: "angry", label: "😡" },
      ];
      return EMOTIONS.map((e) => ({ ...e, count: counts[e.key] || 0 }))
        .filter((e) => e.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    } catch {
      return [];
    }
  }

  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    function onUpdate(e) {
      if (!e?.detail || String(e.detail.postId) !== String(id)) return;
      setTick((t) => t + 1);
    }
    window.addEventListener("reactions:update", onUpdate);

    function onStorageChange(e) {
      if (e.key === `post:${id}:reactions`) {
        setTick((t) => t + 1);
      }
    }
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("reactions:update", onUpdate);
      window.removeEventListener("storage", onStorageChange);
    };
  }, [id]);
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              {error || "Bài viết không tìm thấy"}
            </h2>
            <Link
              to="/blog"
              className="text-sm text-neutral-600 mt-2 inline-block"
            >
              Quay về danh sách bài viết
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  console.log("Dữ liệu post nhận được:", post); // Dòng này của anh

  // === THÊM 3 DÒNG NÀY VÀO ===
  console.log("Kiểm tra post.authorId:", post.authorId);
  console.log("Kiểm tra post.author:", post.author);
  // ============================

  const authorId = post?.authorId || post?.author?._id;
  
  // === THÊM DÒNG NÀY VÀO ===
  console.log("=== ID TÁC GIẢ CUỐI CÙNG LÀ:", authorId);
  // ============================
  
  const authorName = post?.author?.name;
  const authorAvatar = post?.author?.avatar || post?.authorAvatar;
  
  const currentPostId = post._id || post.id;

  return (
    <React.Fragment>
      <Layout>
        <div className="py-5 blogdetail-container">
          {/* Back Navigation */}
          <div className="blogdetail-back-nav">
            <Link to="/blog" className="blogdetail-back-link">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ width: "1.25rem", height: "1.25rem" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại danh sách bài viết
            </Link>
          </div>

          {/* Article Content Grid */}
          <div className="blogdetail-article-grid">
            {/* Article Content (Left Column ~65%) */}
            <div className="blogdetail-article-content">
              <div className="blogdetail-meta-info">
                {post.category} •{" "}
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : post.date || "N/A"}
              </div>

              {/* =========================================== */}
              {/* === START: ĐÂY LÀ KHU VỰC ĐÃ SỬA === */}
              {/* =========================================== */}
              {post.author && (
                <Link
                  to={`/user/${authorId}`}
                  // Dùng d-flex để xếp hàng ngang
                  className="blogdetail-author-profile d-flex align-items-center"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={authorAvatar || "https://placehold.co/50x50/c0c0c0/ffffff?text=A"}
                    alt={authorName}
                    // Thêm class 'rounded-circle' và 'me-3' (margin-right) của Bootstrap
                    className="blogdetail-author-avatar rounded-circle me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div>
                    <p className="blogdetail-author-name fw-bold mb-0" style={{fontSize: '1rem', color: '#1a1a1a'}}>
                      {authorName}
                    </p>
                    <p className="blogdetail-author-role text-muted mb-0" style={{fontSize: '0.85rem'}}>
                      Người đóng góp nội dung
                    </p>
                  </div>
                </Link>
              )}
              {/* =========================================== */}
              {/* === END: KHU VỰC ĐÃ SỬA === */}
              {/* =========================================== */}

              <h1 className="blogdetail-title">{post.title}</h1>
              <p className="blogdetail-description">{post.content}</p>
            </div>

            {/* Article Image (Right Column ~35%) */}
            <div className="blogdetail-image-container">
              <img
                src={post.imageUrl || post.image}
                className="blogdetail-image"
                alt={post.title}
              />

              {/* Emote Display Below Image */}
              {getTopEmotes(currentPostId).length > 0 && (
                <div className="blogdetail-emote-overlay">
                  {getTopEmotes(currentPostId).map((e) => (
                    <div
                      key={`${e.key}-${tick}`}
                      className="blogdetail-emote-item"
                    >
                      <span className="blogdetail-emote-icon">{e.label}</span>
                      <span className="blogdetail-emote-count">{e.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reaction Bar */}
          <div className="blogdetail-reaction-section">
            <ReactionBar postId={currentPostId} />
          </div>

          {/* Rating Section */}
          <div className="blogdetail-rating-section">
            <Rating postId={currentPostId} />
          </div>

          {/* Comments Section */}
          <div className="blogdetail-comments-section">
            <Comments postId={currentPostId} />
          </div>

          {/* Related Recipes Section */}
          {relatedRecipes.length > 0 && (
            <div className="blogdetail-related-recipes-section">
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginBottom: "1.5rem",
                  color: "#1a1a1a",
                }}
              >
                Công thức liên quan
              </h2>
              <Row gutter={[16, 16]}>
                {relatedRecipes.map((recipe) => (
                  <Col xs={24} sm={12} md={12} lg={6} key={recipe._id}>
                    <div
                      onClick={() => navigate(`/recipe/${recipe._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <CardRecent
                        title={recipe.name}
                        src={recipe.image}
                        avatar={recipe.authorAvatar}
                        userName={recipe.author}
                        subtitle={recipe.description}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </Layout>
    </React.Fragment>
  );
}