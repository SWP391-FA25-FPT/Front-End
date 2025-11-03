// src/components/blog/PostCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Tag, Eye } from "lucide-react";
import { Card, CardContent } from "./ui";

export default function PostCard({ post, formatDate }) {
  const viewCount = post.viewCount || post.views || 0;

  return (
    <Card className="blog-post-card">
      <div className="h-48 overflow-hidden">
        <Link to={`/blog/${post.id}`} className="d-block h-100">
          <img src={post.image} alt={post.title} className="blog-post-image" />
        </Link>
      </div>
      <CardContent className="blog-post-content">
        <div className="blog-post-meta">
          <span className="blog-post-category">
            <Tag className="h-3 w-3 flex-shrink-0" />
            <span>{post.category}</span>
          </span>
          <span>•</span>
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span className="blog-post-view">
            <Eye className="h-3 w-3" />
            <span>{viewCount.toLocaleString("vi-VN")}</span>
          </span>
        </div>
        <h3 className="blog-post-title">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="blog-post-excerpt">{post.excerpt}</p>
      </CardContent>
    </Card>
  );
}
