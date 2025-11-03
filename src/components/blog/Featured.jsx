// src/components/blog/Featured.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag, Eye } from "lucide-react";
import { Card, CardContent } from "./ui";

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

export default function Featured({ post }) {
  if (!post) return null;
  return (
    <section className="w-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="blog-hero"
      >
        {/* Ảnh bên trái */}
        <div className="blog-hero-image">
          <img
            src={post.imageUrl || post.image}
            alt={post.title}
            className="h-100 w-100 object-fit-cover"
          />
        </div>

        {/* Nội dung bên phải */}
        <div className="blog-hero-content">
          {/* Thẻ chủ đề và ngày */}
          <div className="blog-hero-meta">
            <span className="blog-category-tag">
              <Tag className="h-3 w-3 flex-shrink-0" />
              <span>{post.category}</span>
            </span>
            <span className="text-muted">•</span>
            <span className="text-muted">
              {post.createdAt
                ? formatDate(post.createdAt)
                : post.publishedAt
                ? formatDate(post.publishedAt)
                : post.updatedAt
                ? formatDate(post.updatedAt)
                : post.date}
            </span>
            {post.views !== undefined && (
              <>
                <span className="text-muted">•</span>
                <span className="text-muted flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.views}</span>
                </span>
              </>
            )}
          </div>

          {/* Tiêu đề lớn đậm */}
          <h1 className="blog-title">{post.title}</h1>

          {/* Mô tả ngắn */}
          <p className="blog-excerpt">{post.excerpt}</p>

          {/* Nút Đọc tiếp */}
          <Link
            to={`/blog/${post._id || post.id}`}
            className="blog-read-more-btn"
          >
            Đọc tiếp
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
