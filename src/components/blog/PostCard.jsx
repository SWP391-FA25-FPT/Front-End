// src/components/blog/PostCard.jsx
import React from "react";
import { Tag } from "lucide-react";
import { Card, CardContent } from "./ui";

export default function PostCard({ post, formatDate }) {
  return (
    <Card className="overflow-hidden group h-full">
      <div className="h-44 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="p-5">
        <div className="text-xs text-neutral-600 flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" /> {post.category}
          </span>
          <span>•</span>
          <span>{formatDate(post.date)}</span>
        </div>
        <h3 className="mt-2 font-semibold text-lg leading-snug line-clamp-2 text-neutral-900">
          {post.title}
        </h3>
        <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
          {post.excerpt}
        </p>
      </CardContent>
    </Card>
  );
}
