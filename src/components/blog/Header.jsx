// src/components/blog/Header.jsx
import React from "react";
import { Menu } from "lucide-react";
import SearchInput from "./SearchInput";
import { Button } from "./ui";

export default function Header({ onToggleNav }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-orange-500 text-white grid place-items-center font-bold">
              C
            </div>
            <a href="#" className="font-semibold text-lg">Cookpad-style Blog</a>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600">
            <a className="hover:text-black" href="#topics">Chủ đề</a>
            <a className="hover:text-black" href="#latest">Bài mới</a>
            <a className="hover:text-black" href="#about">Giới thiệu</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block"><SearchInput /></div>
            <Button variant="outline" className="md:hidden" onClick={onToggleNav}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
