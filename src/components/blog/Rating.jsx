// src/components/blog/Rating.jsx
import React, { useEffect, useState } from "react";

function storageKey(postId) {
  return `post:${postId}:rating`;
}

export default function Rating({ postId }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(postId));
      return raw ? JSON.parse(raw) : { user: 0, count: 0 };
    } catch (e) {
      return { user: 0, count: 0 };
    }
  });

  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    localStorage.setItem(storageKey(postId), JSON.stringify(state));
  }, [state, postId]);

  function setRating(r) {
    setState((prevState) => {
      // If clicking the same rating that's already active, toggle it off
      if (prevState.user === r) {
        return { user: 0, count: Math.max(0, prevState.count - 1) };
      }

      // Otherwise, set new rating
      const wasRated = prevState.user > 0;
      return {
        user: r,
        count: wasRated ? prevState.count : prevState.count + 1,
      };
    });
  }

  function clearRating() {
    setState((prevState) => {
      if (prevState.user === 0) return prevState;
      return { user: 0, count: Math.max(0, prevState.count - 1) };
    });
  }

  return (
    <div className="blogdetail-rating-section">
      <span className="blogdetail-rating-label">Đánh giá:</span>
      <div className="blogdetail-stars-container">
        {[1, 2, 3, 4, 5].map((n) => {
          const isActive = state.user >= n;
          const isHovered = hoverRating >= n;
          const shouldHighlight = isActive || isHovered;

          return (
            <span
              key={n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              className={`blogdetail-star ${shouldHighlight ? "active" : ""}`}
              title={`Đánh ${n} sao`}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setRating(n);
                }
              }}
            >
              {shouldHighlight ? "★" : "☆"}
            </span>
          );
        })}
      </div>
      <span className="blogdetail-rating-count">
        ({state.user > 0 ? state.user : 0})
      </span>
      <button
        onClick={clearRating}
        className="blogdetail-rating-clear"
        title="Hủy đánh giá"
        aria-label="Hủy đánh giá"
      >
        Hủy
      </button>
    </div>
  );
}
