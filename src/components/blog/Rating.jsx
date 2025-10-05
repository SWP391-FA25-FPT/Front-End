// src/components/blog/Rating.jsx
import React, { useEffect, useState } from "react";

function storageKey(postId) {
  return `post:${postId}:rating`;
}

export default function Rating({ postId }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(postId));
      return raw ? JSON.parse(raw) : { total: 0, count: 0, user: 0 };
    } catch (e) {
      return { total: 0, count: 0, user: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey(postId), JSON.stringify(state));
  }, [state, postId]);

  function setRating(r) {
    // if user already rated, replace their rating
    setState((s) => {
      const prevUser = s.user || 0;
      const total = s.total - prevUser + r;
      const count = prevUser ? s.count : s.count + 1;
      return { total, count, user: r };
    });
  }

  function clearRating() {
    setState((s) => {
      const prevUser = s.user || 0;
      if (!prevUser) return s;
      const total = s.total - prevUser;
      const count = Math.max(0, s.count - 1);
      return { total, count, user: 0 };
    });
  }

  const avg = state.count ? (state.total / state.count).toFixed(1) : "—";

  return (
    <div className="rating flex items-center gap-3">
      <div className="text-sm text-neutral-600">Đánh giá:</div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className="p-0 bg-transparent border-none"
            title={`Đánh ${n} sao`}
            aria-label={`Đánh ${n} sao`}
          >
            <span className={`star ${state.user >= n ? 'selected' : 'unselected'}`}>★</span>
          </button>
        ))}
      </div>
      <div className="text-sm text-neutral-600">
        {avg} ({state.count})
      </div>
      <button
        onClick={clearRating}
        className="ml-2 text-sm text-neutral-600 hover:text-orange-600 bg-transparent clear-btn"
        title="Hủy đánh giá"
        aria-label="Hủy đánh giá"
      >
        Hủy
      </button>
    </div>
  );
}
