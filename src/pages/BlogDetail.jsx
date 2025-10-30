// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Empty, Spin } from "antd";
import { getBlogById } from "../apis/blog";
import ReactionBar from "../components/blog/ReactionBar";
import Comments from "../components/blog/Comments";
import Rating from "../components/blog/Rating";
import Layout from "../components/layout/SettingLayout";
import "../pages/style/blogdetail.css";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Loading blog with ID:", id);
        const result = await getBlogById(id);
        console.log("Blog API response:", result);

        if (!result || !result.data) {
          throw new Error("Blog data not found");
        }

        // Transform API data to match frontend format
        const transformedPost = {
          id: result.data._id || result.data.slug || id,
          title: result.data.title,
          excerpt: result.data.excerpt,
          content: result.data.content,
          author: result.data.author,
          authorAvatar: result.data.authorAvatar,
          date: result.data.publishedAt
            ? new Date(result.data.publishedAt).toISOString().split("T")[0]
            : result.data.date,
          category: result.data.category,
          image: result.data.imageUrl,
        };

        console.log("Transformed post:", transformedPost);
        setPost(transformedPost);
      } catch (error) {
        console.error("Error loading blog:", error);
        setError(error.message || "Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBlog();
    }
  }, [id]);

  useEffect(() => {
    if (!post) return;

    function onUpdate(e) {
      if (!e?.detail || String(e.detail.postId) !== String(post.id)) return;
      // force re-render by touching state via noop setState with useState dummy
      setTick((t) => t + 1);
    }
    // Add event listener immediately
    window.addEventListener("reactions:update", onUpdate);

    // Also listen for storage changes as backup
    function onStorageChange(e) {
      if (e.key === `post:${post.id}:reactions`) {
        setTick((t) => t + 1);
      }
    }
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("reactions:update", onUpdate);
      window.removeEventListener("storage", onStorageChange);
    };
  }, [post]);

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

  if (loading) {
    return (
      <Layout>
        <div className="py-5 blogdetail-container">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-3">Đang tải...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="py-5 blogdetail-container">
          <Empty
            description={
              error || !post ? "Bài viết không tìm thấy" : "Đang tải..."
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: "60px 0" }}
          >
            <Link to="/blog" className="ant-btn ant-btn-primary">
              Quay về danh sách bài viết
            </Link>
          </Empty>
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
                {post.category} • {post.date}
              </div>
              <h1 className="blogdetail-title">{post.title}</h1>
              <p className="blogdetail-description">{post.content}</p>
            </div>

            {/* Article Image (Right Column ~35%) */}
            <div className="blogdetail-image-container">
              <img
                src={post.image}
                className="blogdetail-image"
                alt={post.title}
              />

              {/* Emote Display Below Image */}
              {getTopEmotes(post.id).length > 0 && (
                <div className="blogdetail-emote-overlay">
                  {getTopEmotes(post.id).map((e) => (
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
            <ReactionBar postId={post.id} />
          </div>

          {/* Rating Section */}
          <div className="blogdetail-rating-section">
            <Rating postId={post.id} />
          </div>

          {/* Comments Section */}
          <div className="blogdetail-comments-section">
            <Comments postId={post.id} />
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
}
