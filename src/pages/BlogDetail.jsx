// src/pages/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import { getBlogById } from "../apis/blog";
import { getAllRecipes } from "../apis/recipe";
import ReactionBar from "../components/blog/ReactionBar";
import Comments from "../components/blog/Comments";
import Rating from "../components/blog/Rating";
import CardRecent from "../components/CardRecent/CardRecent";
import Layout from "../components/layout/SettingLayout";
import "../pages/style/blogdetail.css";

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

          // Fetch related recipes - use blog's relatedRecipes first, then fallback to tags
          if (
            response.data.relatedRecipes &&
            response.data.relatedRecipes.length > 0
          ) {
            // Blog has directly linked recipes
            setRelatedRecipes(response.data.relatedRecipes);
          } else if (response.data.tags && response.data.tags.length > 0) {
            // Fallback to recipes based on tags
            const recipesResponse = await getAllRecipes({
              tags: response.data.tags.slice(0, 2).join(","),
              limit: 4,
            });
            if (recipesResponse.success && recipesResponse.data) {
              setRelatedRecipes(recipesResponse.data);
            }
          } else {
            // If no tags, just get random recipes
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
  }, [id]);

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
      // force re-render by touching state via noop setState with useState dummy
      setTick((t) => t + 1);
    }
    // Add event listener immediately
    window.addEventListener("reactions:update", onUpdate);

    // Also listen for storage changes as backup
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
              {getTopEmotes(post._id || post.id).length > 0 && (
                <div className="blogdetail-emote-overlay">
                  {getTopEmotes(post._id || post.id).map((e) => (
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
            <ReactionBar postId={post._id || post.id} />
          </div>

          {/* Rating Section */}
          <div className="blogdetail-rating-section">
            <Rating postId={post._id || post.id} />
          </div>

          {/* Comments Section */}
          <div className="blogdetail-comments-section">
            <Comments postId={post._id || post.id} />
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
