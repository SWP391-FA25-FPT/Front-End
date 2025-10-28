// src/components/blog/Comments.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";

function storageKey(postId) {
  return `post:${postId}:comments`;
}

export default function Comments({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(postId));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [value, setValue] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey(postId), JSON.stringify(comments));
  }, [comments, postId]);

  function addComment() {
    if (!value.trim()) return;
    const c = {
      id: Date.now(),
      text: value.trim(),
      date: new Date().toISOString(),
      author: user?.name || "Người dùng",
      avatar: user?.profilePicture || null,
      userId: user?.id || null,
    };
    setComments((s) => [c, ...s]);
    setValue("");
  }

  function remove(id) {
    setComments((s) => s.filter((c) => c.id !== id));
  }

  return (
    <div className="blogdetail-comments-section">
      <h3 className="text-xl font-semibold text-black mb-4">Bình luận</h3>

      {/* Comment Input */}
      <div className="mb-6">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          className="blogdetail-comment-input"
          placeholder="Viết bình luận..."
        />
        <button onClick={addComment} className="blogdetail-comment-submit">
          Gửi
        </button>
      </div>

      {/* Comments List */}
      <div className="blogdetail-comments-list">
        {comments.length === 0 && (
          <div className="blogdetail-no-comments">Chưa có bình luận nào.</div>
        )}
        {comments.map((c) => {
          // Get the first letter of author's name for avatar fallback
          // Use stored author or current user's name
          const authorName = c.author || user?.name || "Người dùng";
          // Get first letter, handle Vietnamese and remove accents
          const getAvatarLetter = (name) => {
            const cleanName = name.trim();
            if (!cleanName) return "U";

            // Get the first word
            const firstWord = cleanName.split(/\s+/)[0];
            if (!firstWord) return "U";

            // Return uppercase first character
            return firstWord.charAt(0).toUpperCase();
          };
          const avatarLetter = getAvatarLetter(authorName);

          return (
            <div key={c.id} className="blogdetail-comment-item">
              {/* Avatar and Content Row */}
              <div className="blogdetail-comment-row">
                {/* Avatar */}
                <div className="blogdetail-comment-avatar">
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={authorName}
                      className="blogdetail-avatar-image"
                    />
                  ) : (
                    <div className="blogdetail-avatar-circle">
                      {avatarLetter}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="blogdetail-comment-body">
                  <div className="blogdetail-comment-header">
                    <div className="blogdetail-comment-author">
                      {authorName}
                    </div>
                    <div className="blogdetail-comment-date">
                      {new Date(c.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="blogdetail-comment-content">{c.text}</div>
                  <div className="blogdetail-comment-time">
                    <button
                      onClick={() => remove(c.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
