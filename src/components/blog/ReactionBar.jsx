// src/components/blog/ReactionBar.jsx
import React, { useEffect, useState } from "react";

const EMOTIONS = [
  { key: "like", label: "👍" },
  { key: "love", label: "❤️" },
  { key: "haha", label: "😂" },
  { key: "wow", label: "😮" },
  { key: "sad", label: "😢" },
  { key: "angry", label: "😡" },
];

function storageKey(postId) {
  return `post:${postId}:reactions`;
}

export default function ReactionBar({ postId }) {
  const [counts, setCounts] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(postId));
      return raw
        ? JSON.parse(raw)
        : EMOTIONS.reduce((a, e) => ({ ...a, [e.key]: 0 }), {});
    } catch (e) {
      return EMOTIONS.reduce((a, e) => ({ ...a, [e.key]: 0 }), {});
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey(postId), JSON.stringify(counts));
  }, [counts, postId]);

  function react(key) {
    setCounts((c) => ({ ...c, [key]: (c[key] || 0) + 1 }));
  }

  return (
    <div className="inline-flex items-center gap-2">
      {EMOTIONS.map((e) => (
        <button
          key={e.key}
          onClick={() => react(e.key)}
          className="rounded-md px-3 py-1 hover:bg-neutral-100"
          title={e.key}
        >
          <span className="text-lg">{e.label}</span>
          <span className="ml-2 text-sm text-neutral-600">{counts[e.key]}</span>
        </button>
      ))}
    </div>
  );
}
