// src/pages/BlogDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { findPostById } from "../data/posts.js";
import ReactionBar from "../components/blog/ReactionBar";
import Comments from "../components/blog/Comments";
import Rating from "../components/blog/Rating";

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

  React.useEffect(() => {
    function onUpdate(e) {
      if (!e?.detail || String(e.detail.postId) !== String(id)) return;
      // force re-render by touching state via noop setState with useState dummy
      setTick((t) => t + 1);
    }
    window.addEventListener('reactions:update', onUpdate);
    return () => window.removeEventListener('reactions:update', onUpdate);
  }, [id]);

  const [tick, setTick] = React.useState(0);
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
    <div className="min-h-screen bg-neutral-100 w-full">
      <div className="w-full px-4 md:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-black hover:text-orange-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách bài viết
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <div className="text-sm text-neutral-600">
              {post.category} • {post.date}
            </div>
            <h1 className="text-3xl font-bold mt-2 text-black">{post.title}</h1>
            <p className="text-neutral-700 mt-4 leading-relaxed">
              {post.content}
            </p>
          </div>
          <div className="relative">
            <img
              src={post.image}
              className="w-full h-80 object-cover rounded-lg"
              alt={post.title}
            />
            {getTopEmotes(post.id).length > 0 && (
              <div className="absolute bottom-2 left-2 inline-flex items-center gap-2">
                {getTopEmotes(post.id).map((e) => (
                  <div key={e.key} className="inline-flex items-center gap-1 bg-neutral-900 text-white rounded-full px-2 py-1">
                    <span className="text-lg">{e.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start gap-3">
          <ReactionBar postId={post.id} />
          <Rating postId={post.id} />
        </div>

        <div className="mt-8">
          <Comments postId={post.id} />
        </div>
      </div>
    </div>
  );
}
