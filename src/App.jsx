import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import MealPlan from "./pages/MealPlan";
import AdminPage from "./pages/admin/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/post/:id" element={<BlogDetail />} />
        <Route path="/meal-plan" element={<MealPlan />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
