// src/pages/BlogDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { findPostById } from "../data/posts.js";
import ReactionBar from "../components/blog/ReactionBar";
import Comments from "../components/blog/Comments";
import Rating from "../components/blog/Rating";
import Layout from "../components/layout/AppLayout";
import "../styles/blogdetail.css";

export default function BlogDetail() {
  const { id } = useParams();
  const post = findPostById(id);
  
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
      return EMOTIONS
        .map((e) => ({ ...e, count: counts[e.key] || 0 }))
        .filter((e) => e.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    } catch (e) {
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
    window.addEventListener('reactions:update', onUpdate);
    
    // Also listen for storage changes as backup
    function onStorageChange(e) {
      if (e.key === `post:${id}:reactions`) {
        setTick((t) => t + 1);
      }
    }
    window.addEventListener('storage', onStorageChange);
    
    return () => {
      window.removeEventListener('reactions:update', onUpdate);
      window.removeEventListener('storage', onStorageChange);
    };
  }, [id]);
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Bài viết không tìm thấy</h2>
          <Link to="/blog" className="text-sm text-neutral-600 mt-2 inline-block">
            Quay về danh sách bài viết
          </Link>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Layout>
        <div className="tw:py-8 blogdetail-container">
          {/* Back Navigation */}
          <div className="blogdetail-back-nav">
            <Link 
              to="/blog" 
              className="blogdetail-back-link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
              <p className="blogdetail-description">
                {post.content}
              </p>
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
                    <div key={`${e.key}-${tick}`} className="blogdetail-emote-item">
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
