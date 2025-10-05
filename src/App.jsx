import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/post/:id" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
