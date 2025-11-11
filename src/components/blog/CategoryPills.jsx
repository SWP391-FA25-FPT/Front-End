// src/components/blog/CategoryPills.jsx
import React from "react";
import { cx } from "./utils";

export default function CategoryPills({ current, categories, onPick }) {
  return (
    <div id="cat" className="blog-category-pills">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onPick(c)}
          className={cx(
            "blog-category-pill",
            current === c ? "active" : ""
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
