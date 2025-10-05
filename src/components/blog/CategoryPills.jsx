// src/components/blog/CategoryPills.jsx
import React from "react";
import { cx } from "./ui";

export default function CategoryPills({ current, categories, onPick }) {
  return (
    <div id="cat" className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onPick(c)}
          className={cx(
            "px-3 py-1.5 rounded-full text-sm transition-colors",
            current === c
              ? "bg-orange-500 text-white border border-orange-600 shadow-sm"
              : "bg-neutral-100 hover:bg-neutral-200 border border-neutral-200"
          )}
          style={current !== c ? { color: '#EEEEEE' } : {}}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
