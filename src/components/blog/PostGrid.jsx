// src/components/blog/PostGrid.jsx
import React from "react";
import PostCard from "./PostCard";

export default function PostGrid({ posts, formatDate }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => <PostCard key={p.id} post={p} formatDate={formatDate} />)}
    </div>
  );
}
