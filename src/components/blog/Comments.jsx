// src/components/blog/Comments.jsx
import React, { useEffect, useState } from "react";

function storageKey(postId) {
  return `post:${postId}:comments`;
}

export default function Comments({ postId }) {
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
        <button
          onClick={addComment}
          className="blogdetail-comment-submit"
        >
          Gửi
        </button>
      </div>

      {/* Comments List */}
      <div className="blogdetail-comments-list">
        {comments.length === 0 && (
          <div className="blogdetail-no-comments">Chưa có bình luận nào.</div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="blogdetail-comment-item">
            <div className="blogdetail-comment-author">
              Người dùng • {new Date(c.date).toLocaleString()}
            </div>
            <div className="blogdetail-comment-content">
              {c.text}
            </div>
            <div className="blogdetail-comment-time">
              <button
                onClick={() => remove(c.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
