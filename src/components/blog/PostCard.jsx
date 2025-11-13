import React from "react";
import { Link } from "react-router-dom";
import { Tag, Eye } from "lucide-react";
import { Card, CardContent } from "./ui";

/**
 * Component hiển thị từng bài viết trong Blog
 * - Card nhận màu nền động từ CSS theme
 * - Ảnh nằm trong wrapper riêng để kiểm soát kích thước
 * - Hỗ trợ hiển thị lượt xem, danh mục, ngày đăng
 */
export default function PostCard({ post, formatDate }) {
  const postId = post._id || post.id;
  const postDate =
    post.createdAt
      ? formatDate(post.createdAt)
      : post.publishedAt
      ? formatDate(post.publishedAt)
      : post.updatedAt
      ? formatDate(post.updatedAt)
      : formatDate(post.date);

  return (
    <Card className="blog-post-card">
      {/* Ảnh đại diện bài viết */}
      <div className="blog-post-image-wrapper">
        <Link to={`/blog/${postId}`} className="blog-post-image-link">
          <img
            src={post.imageUrl || post.image}
            alt={post.title}
            className="blog-post-image"
          />
        </Link>
      </div>

      {/* Nội dung thẻ bài viết */}
      <CardContent className="blog-post-content">
        <div className="blog-post-meta">
          <span className="blog-post-category">
            <Tag className="h-3 w-3 flex-shrink-0" />
            <span>{post.category}</span>
          </span>
          <span>•</span>
          <span>{postDate}</span>

          {post.views !== undefined && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.views}</span>
              </span>
            </>
          )}
        </div>

        <h3 className="blog-post-title">
          <Link to={`/blog/${postId}`}>{post.title}</Link>
        </h3>

        <p className="blog-post-excerpt">{post.excerpt}</p>
      </CardContent>
    </Card>
  );
}
