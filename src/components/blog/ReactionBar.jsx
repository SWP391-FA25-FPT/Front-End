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
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(postId));
      if (!raw) {
        return {
          counts: EMOTIONS.reduce((a, e) => ({ ...a, [e.key]: 0 }), {}),
          user: null,
        };
      }
      const parsed = JSON.parse(raw);
      // Backward compatibility: older format stored only counts object
      if (parsed && typeof parsed === "object" && !("counts" in parsed)) {
        return { counts: parsed, user: null };
      }
      return parsed || { counts: {}, user: null };
    } catch (e) {
      return {
        counts: EMOTIONS.reduce((a, e) => ({ ...a, [e.key]: 0 }), {}),
        user: null,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey(postId), JSON.stringify(state));
  }, [state, postId]);

  function react(key) {
    setState((prevState) => {
      // If clicking the same reaction that's already active, toggle it off
      if (prevState.user === key) {
        const next = { 
          counts: EMOTIONS.reduce((a, e) => ({ ...a, [e.key]: 0 }), {}), 
          user: null 
        };
        
        // Notify listeners immediately after state update
        setTimeout(() => {
          try {
            window.dispatchEvent(new CustomEvent('reactions:update', { 
              detail: { postId, state: next } 
            }));
          } catch (e) {
            console.warn('Failed to dispatch reactions:update event', e);
          }
        }, 0);
        
        return next;
      }
      
      // Otherwise, set new reaction (reset all counts to 0, then set chosen to 1)
      const resetCounts = EMOTIONS.reduce((a, e) => ({ ...a, [e.key]: 0 }), {});
      resetCounts[key] = 1;
      const next = { counts: resetCounts, user: key };
      
      // Notify listeners immediately after state update
      setTimeout(() => {
        try {
          window.dispatchEvent(new CustomEvent('reactions:update', { 
            detail: { postId, state: next } 
          }));
        } catch (e) {
          console.warn('Failed to dispatch reactions:update event', e);
        }
      }, 0);
      
      return next;
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      {EMOTIONS.map((e) => (
        <button
          key={e.key}
          onClick={() => react(e.key)}
          className={`blogdetail-reaction-btn ${state.user === e.key ? 'active' : ''}`}
          title={e.key}
          aria-pressed={state.user === e.key}
        >
          <span className="text-lg">{e.label}</span>
        </button>
      ))}
    </div>
  );
}
