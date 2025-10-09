// src/components/blog/SearchInput.jsx
import React from "react";
import { Search } from "lucide-react";
import { Input } from "./ui";

export default function SearchInput() {
  return (
    <div className="relative w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <Input className="pl-9 bg-white/90 border-white/20 placeholder:text-neutral-500" placeholder="Tìm bài viết, chủ đề..." />
    </div>
  );
}
