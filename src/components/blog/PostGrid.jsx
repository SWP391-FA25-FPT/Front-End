// src/components/blog/PostGrid.jsx
import React from "react";
import PostCard from "./PostCard";

export default function PostGrid({ posts, formatDate }) {
  return (
    <div className="blog-post-grid">
      {posts.map((p) => <PostCard key={p.id} post={p} formatDate={formatDate} />)}
    </div>
  );
}
