// src/components/blog/PostCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { Card, CardContent } from "./ui";

export default function PostCard({ post, formatDate }) {
  return (
    <Card className="blog-post-card">
      <div className="tw:h-48 tw:overflow-hidden">
        <Link to={`/blog/${post.id}`} className="tw:block tw:h-full">
          <img
            src={post.image}
            alt={post.title}
            className="blog-post-image"
          />
        </Link>
      </div>
      <CardContent className="blog-post-content">
        <div className="blog-post-meta">
          <span className="blog-post-category">
            <Tag className="tw:h-3 tw:w-3" /> {post.category}
          </span>
          <span>•</span>
          <span>{formatDate(post.date)}</span>
        </div>
        <h3 className="blog-post-title">
          <Link to={`/blog/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        <p className="blog-post-excerpt">
          {post.excerpt}
        </p>
      </CardContent>
    </Card>
  );
}
