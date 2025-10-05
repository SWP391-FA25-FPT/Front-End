// src/components/blog/ui.jsx
import React from "react";

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({ variant = "default", className = "", ...props }) {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all";
  const styles = {
    default: "bg-neutral-900 text-white hover:bg-orange-600",
    outline: "border bg-white hover:bg-orange-100",
    ghost: "hover:bg-orange-100",
  }[variant] || "bg-neutral-900 text-white hover:bg-neutral-800";
  return <button className={cx(base, styles, className)} {...props} />;
}

export function Input({ className = "", ...props }) {
  return <input className={cx("rounded-xl border bg-white px-3 py-2 text-sm outline-none w-full", className)} {...props} />;
}

export function Card({ className = "", ...props }) {
  return <div className={cx("rounded-2xl border bg-white", className)} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={cx("p-6", className)} {...props} />;
}
