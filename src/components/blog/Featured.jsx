// src/components/blog/Featured.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { Card, CardContent } from "./ui";

export default function Featured({ post }) {
  if (!post) return null;
  return (
    <section className="tw:w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="blog-hero"
      >
        {/* Ảnh bên trái */}
        <div className="blog-hero-image">
          <img
            src={post.image}
            alt={post.title}
            className="tw:h-full tw:w-full tw:object-cover"
          />
        </div>
        
        {/* Nội dung bên phải */}
        <div className="blog-hero-content">
          {/* Thẻ chủ đề và ngày */}
          <div className="blog-hero-meta">
            <span className="blog-category-tag">
              <Tag className="tw:h-3 tw:w-3 tw:flex-shrink-0" />
              <span>{post.category}</span>
            </span>
            <span className="tw:text-gray-500">•</span>
            <span className="tw:text-gray-500">{post.date}</span>
          </div>
          
          {/* Tiêu đề lớn đậm */}
          <h1 className="blog-title">
            {post.title}
          </h1>

          {/* Mô tả ngắn */}
          <p className="blog-excerpt">
            {post.excerpt}
          </p>
          
          {/* Nút Đọc tiếp */}
          <div>
            <Link
              to={`/blog/${post.id}`}
              className="blog-read-more-btn"
            >
              Đọc tiếp
              <svg className="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
