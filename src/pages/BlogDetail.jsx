// src/pages/BlogDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { findPostById } from "@/data/posts";
import ReactionBar from "@/components/blog/ReactionBar";
import Comments from "@/components/blog/Comments";
import Rating from "@/components/blog/Rating";

export default function BlogDetail() {
  const { id } = useParams();
  const post = findPostById(id);
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Bài viết không tìm thấy</h2>
          <Link to="/" className="text-sm text-neutral-600 mt-2 inline-block">
            Quay về
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 w-full">
      <div className="w-full px-4 md:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách bài viết
          </Link>
        </div>
        <img
          src={post.image}
          className="w-full h-72 object-cover rounded-lg"
          alt={post.title}
        />
        <div className="mt-6">
          <div className="text-sm text-neutral-600">
            {post.category} • {post.date}
          </div>
          <h1 className="text-3xl font-bold mt-2 text-black">{post.title}</h1>
          <p className="text-neutral-700 mt-4 leading-relaxed">
            {post.content}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <Rating postId={post.id} />
            <ReactionBar postId={post.id} />
          </div>

          <div className="mt-8">
            <Comments postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
