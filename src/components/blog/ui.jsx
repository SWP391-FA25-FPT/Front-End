import React from "react";

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({ variant = "default", className = "", ...props }) {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all";
  
  const styles = {
    default: "bg-[var(--color-text-primary)] text-white hover:bg-[var(--primary-color)]", 
    outline: "border bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[rgba(245, 158, 11, 0.1)]",
    ghost: "text-[var(--color-text-primary)] hover:bg-[rgba(245, 158, 11, 0.1)]",
  }[variant] || "bg-[var(--color-text-primary)] text-white hover:bg-[var(--primary-color)]";
  
  return <button className={cx(base, styles, className)} {...props} />;
}

export function Input({ className = "", ...props }) {
  return (
    <input 
      className={cx(
        "rounded-xl border px-3 py-2 text-sm outline-none w-full",
        className
      )} 
      style={{
          borderColor: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-bg-elevated)',
          color: 'var(--color-text-primary)',
      }}
      {...props} 
    />
  );
}

export function Card({ className = "", ...props }) {
  return (
    <div 
      className={cx(
        "rounded-2xl border", 
        className
      )} 
      style={{
          borderColor: 'var(--color-bg-elevated)', 
          backgroundColor: 'var(--color-bg-elevated)', 
      }}
      {...props} 
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={cx("p-6", className)} {...props} />;
}