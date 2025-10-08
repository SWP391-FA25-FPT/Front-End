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
    <div className="mt-8 p-4 border rounded-lg bg-white">
      <h3 className="text-xl font-semibold text-black">Bình luận</h3>
      <div className="mt-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          className="w-full p-3 rounded text-black placeholder:text-neutral-500 outline-none"
          placeholder="Viết bình luận..."
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={addComment}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-neutral-900"
          >
            Gửi
          </button>
        </div>
      </div>

      <div className="my-6 border-t border-neutral-200"></div>

      <div className="p-4 border rounded-lg bg-neutral-100">
        <div className="space-y-0 divide-y">
          {comments.length === 0 && (
            <div className="text-sm text-neutral-600">Chưa có bình luận nào.</div>
          )}
          {comments.map((c) => (
            <div key={c.id} className="p-4 bg-white">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="avatar rounded-full bg-neutral-200 text-neutral-700 inline-flex items-center justify-center" style={{width:'2.5rem',height:'2.5rem'}}>
                  <span className="text-sm font-semibold">{(c.text?.trim()?.[0] || 'U').toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black truncate max-w-[200px]">Người dùng</span>
                    <span className="text-xs text-neutral-500">{new Date(c.date).toLocaleString()}</span>
                  </div>
                  <div className="text-orange-600 text-sm">★★★★★</div>
                </div>
              </div>
              {/* Content */}
              <div className="mt-3 text-sm text-neutral-700 whitespace-pre-line">{c.text}</div>
              {/* Footer */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-500 text-sm">
                  <span>👍</span>
                  <span>Thích</span>
                </div>
                <button
                  onClick={() => remove(c.id)}
                  className="text-white text-xs bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
