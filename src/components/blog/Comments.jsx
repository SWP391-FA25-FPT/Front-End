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
    <div>
      <h3 className="text-xl font-semibold text-black">Bình luận</h3>
      <div className="mt-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          className="w-full p-3 rounded border"
          placeholder="Viết bình luận..."
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={addComment}
            className="px-4 py-2 bg-neutral-900 text-white rounded"
          >
            Gửi
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {comments.length === 0 && (
          <div className="text-sm text-neutral-600">Chưa có bình luận nào.</div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="p-3 bg-white rounded shadow-sm">
            <div className="text-sm text-neutral-700">{c.text}</div>
            <div className="text-xs text-neutral-500 mt-2 flex items-center justify-between">
              <span>{new Date(c.date).toLocaleString()}</span>
              <button
                onClick={() => remove(c.id)}
                className="text-red-500 text-xs"
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
