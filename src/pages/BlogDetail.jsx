// src/pages/BlogDetail.jsx
import React, {
  useEffect,
  useState,
  useRef,
  useContext, // <--- SỬA LỖI 1: THÊM 'useContext' VÀO ĐÂY
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
// -> THÊM IMPORTS MỚI
import { MessageSquare, ChevronDown } from "lucide-react";
import { createOrGetConversation } from "../services/messageService";
import { SocketContext } from "../context/SocketContext";
import { useAuth } from "../context/useAuth";
// <- END THÊM IMPORTS MỚI

import { getBlogById } from "../apis/blog";
import { getAllRecipes } from "../apis/recipe";
import ReactionBar from "../components/blog/ReactionBar";
import Comments from "../components/blog/Comments";
import Rating from "../components/blog/Rating";
import CardRecent from "../components/CardRecent/CardRecent";
import Layout from "../components/layout/SettingLayout";
import "../pages/style/blogdetail.css";

// Component nhỏ để xử lý Dropdown và logic Nhắn tin
const AuthorDropdown = ({ authorId, authorName, authorAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  // <--- SỬA LỖI 2: DÙNG 'useContext(SocketContext)' THAY VÌ 'SocketContext()'
  const { setCurrentConversationId } = useContext(SocketContext);
  const dropdownRef = useRef(null);

  // Xử lý click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStartConversation = async () => {
    if (!isAuthenticated) {
      // Thay thế alert bằng console.warn
      console.warn("Bạn cần đăng nhập để nhắn tin.");
      return;
    }

    // Kiểm tra tránh chat với chính mình
    if (String(authorId) === String(user?._id)) {
      // Thay thế alert bằng console.warn
      console.warn("Không thể nhắn tin với chính mình.");
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    try {
      // 1. Gọi API tạo/lấy Conversation
      const conversation = await createOrGetConversation(authorId);

      // 2. Mở cửa sổ chat Widget
      setCurrentConversationId(conversation._id);
    } catch (error) {
      console.error("Lỗi khi tạo/lấy conversation:", error);
      // Thay thế alert bằng console.warn
      console.warn(
        `Lỗi: ${error.message || "Không thể khởi tạo cuộc trò chuyện."}`
      );
    }
  };

  // Nếu không có ID hoặc chưa đăng nhập, chỉ hiển thị thông tin profile tĩnh
  if (!authorId || !isAuthenticated) {
    return (
      <div className="blogdetail-author-profile">
        <img
          src={authorAvatar || "https://placehold.co/50x50/c0c0c0/ffffff?text=A"}
          alt={authorName}
          className="blogdetail-author-avatar"
        />
        <div>
          <p className="blogdetail-author-name">{authorName}</p>
          <p className="blogdetail-author-role">Người đóng góp nội dung</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative z-50"
      ref={dropdownRef}
      style={{ position: "relative", zIndex: 50 }}
    >
      {/* Khu vực kích hoạt Dropdown (Avatar + Name) */}
      <div
        className="blogdetail-author-profile cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={authorAvatar || "https://placehold.co/50x50/c0c0c0/ffffff?text=A"}
          alt={authorName}
          className="blogdetail-author-avatar"
        />
        <div
          className="flex items-center space-x-1"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <p className="blogdetail-author-name m-0">{authorName}</p>
          <ChevronDown
            className="w-4 h-4 text-gray-500 transition-transform"
            style={{
              width: "1rem",
              height: "1rem",
              color: "#6b7280",
              transition: "transform 0.2s",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 w-48 left-0"
          style={{
            position: "absolute",
            zIndex: 50,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
            marginTop: "0.25rem",
            width: "12rem",
            left: 0,
          }}
        >
          <div
            className="flex items-center p-3 text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={handleStartConversation}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem",
              color: "#374151",
              cursor: "pointer",
            }}
            // Thêm hiệu ứng hover nội tuyến cho đơn giản
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            <MessageSquare
              className="w-4 h-4 mr-2"
              style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }}
            />
            Nhắn tin
          </div>
        </div>
      )}
    </div>
  );
};

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const fetchedIds = React.useRef(new Set());

  useEffect(() => {
    // Prevent double fetch in React StrictMode for the same id
    if (fetchedIds.current.has(id)) return;
    fetchedIds.current.add(id);

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlogById(id);
        if (response.success && response.data) {
          setPost(response.data);

          // Fetch related recipes - use blog's relatedRecipes first, then fallback to tags
          if (
            response.data.relatedRecipes &&
            response.data.relatedRecipes.length > 0
          ) {
            // Blog has directly linked recipes
            setRelatedRecipes(response.data.relatedRecipes);
          } else if (response.data.tags && response.data.tags.length > 0) {
            // Fallback to recipes based on tags
            const recipesResponse = await getAllRecipes({
              tags: response.data.tags.slice(0, 2).join(","),
              limit: 4,
            });
            if (recipesResponse.success && recipesResponse.data) {
              setRelatedRecipes(recipesResponse.data);
            }
          } else {
            // If no tags, just get random recipes
            const recipesResponse = await getAllRecipes({ limit: 4 });
            if (recipesResponse.success && recipesResponse.data) {
              setRelatedRecipes(recipesResponse.data);
            }
          }
        } else {
          setError("Không tìm thấy blog");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]); // Thêm navigate vào dependency array nếu getAllRecipes hoặc getBlogById sử dụng nó

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
      return EMOTIONS.map((e) => ({ ...e, count: counts[e.key] || 0 }))
        .filter((e) => e.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    } catch {
      return [];
    }
  }

  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    function onUpdate(e) {
      if (!e?.detail || String(e.detail.postId) !== String(id)) return;
      // force re-render by touching state via noop setState with useState dummy
      setTick((t) => t + 1);
    }
    // Add event listener immediately
    window.addEventListener("reactions:update", onUpdate);

    // Also listen for storage changes as backup
    function onStorageChange(e) {
      if (e.key === `post:${id}:reactions`) {
        setTick((t) => t + 1);
      }
    }
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("reactions:update", onUpdate);
      window.removeEventListener("storage", onStorageChange);
    };
  }, [id]);
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              {error || "Bài viết không tìm thấy"}
            </h2>
            <Link
              to="/blog"
              className="text-sm text-neutral-600 mt-2 inline-block"
            >
              Quay về danh sách bài viết
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  console.log("Dữ liệu post nhận được:", post);

  // Lấy ID/Name/Avatar của tác giả (Giả định post.authorId hoặc post.author._id là ID)
  const authorId = post?.authorId || post?.author?._id;
  const authorName = post?.author;
  const authorAvatar = post?.authorAvatar;
  const currentPostId = post._id || post.id;

  return (
    <React.Fragment>
      <Layout>
        <div className="py-5 blogdetail-container">
          {/* Back Navigation */}
          <div className="blogdetail-back-nav">
            <Link to="/blog" className="blogdetail-back-link">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ width: "1.25rem", height: "1.25rem" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại danh sách bài viết
            </Link>
          </div>

          {/* Article Content Grid */}
          <div className="blogdetail-article-grid">
            {/* Article Content (Left Column ~65%) */}
            <div className="blogdetail-article-content">
              <div className="blogdetail-meta-info">
                {post.category} •{" "}
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : post.date || "N/A"}
              </div>

              {/* START: THAY THẾ KHU VỰC TÁC GIẢ BẰNG AuthorDropdown */}
              {post.author && (
                <AuthorDropdown
                  authorId={authorId}
                  authorName={authorName}
                  authorAvatar={authorAvatar}
                />
              )}
              {/* END: KHU VỰC TÁC GIẢ */}

              <h1 className="blogdetail-title">{post.title}</h1>
              <p className="blogdetail-description">{post.content}</p>
            </div>

            {/* Article Image (Right Column ~35%) */}
            <div className="blogdetail-image-container">
              <img
                src={post.imageUrl || post.image}
                className="blogdetail-image"
                alt={post.title}
              />

              {/* Emote Display Below Image */}
              {getTopEmotes(currentPostId).length > 0 && (
                <div className="blogdetail-emote-overlay">
                  {getTopEmotes(currentPostId).map((e) => (
                    <div
                      key={`${e.key}-${tick}`}
                      className="blogdetail-emote-item"
                    >
                      <span className="blogdetail-emote-icon">{e.label}</span>
                      <span className="blogdetail-emote-count">{e.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reaction Bar */}
          <div className="blogdetail-reaction-section">
            <ReactionBar postId={currentPostId} />
          </div>

          {/* Rating Section */}
          <div className="blogdetail-rating-section">
            <Rating postId={currentPostId} />
          </div>

          {/* Comments Section */}
          <div className="blogdetail-comments-section">
            <Comments postId={currentPostId} />
          </div>

          {/* Related Recipes Section */}
          {relatedRecipes.length > 0 && (
            <div className="blogdetail-related-recipes-section">
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginBottom: "1.5rem",
                  color: "#1a1a1a",
                }}
              >
                Công thức liên quan
              </h2>
              <Row gutter={[16, 16]}>
                {relatedRecipes.map((recipe) => (
                  <Col xs={24} sm={12} md={12} lg={6} key={recipe._id}>
                    <div
                      onClick={() => navigate(`/recipe/${recipe._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <CardRecent
                        title={recipe.name}
                        src={recipe.image}
                        avatar={recipe.authorAvatar}
                        userName={recipe.author}
                        subtitle={recipe.description}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </Layout>
    </React.Fragment>
  );
}