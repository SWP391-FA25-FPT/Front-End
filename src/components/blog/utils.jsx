// src/components/blog/utils.jsx

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
