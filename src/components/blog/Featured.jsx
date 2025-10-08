// src/components/blog/Featured.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { Card, CardContent } from "./ui";

export default function Featured({ post }) {
  if (!post) return null;
  return (
    <section className="w-full px-4 md:px-6 lg:px-8 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <Card className="h-80 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </Card>
        <div className="flex flex-col justify-center">
          <div className="text-sm text-neutral-600 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-4 w-4" /> {post.category}
            </span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 leading-tight text-neutral-900">
            {post.title}
          </h1>

          <p className="text-neutral-600 mt-2 max-w-[58ch]">{post.excerpt}</p>
          <div className="mt-5">
            <Link
              to={`/post/${post.id}`}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 !text-white"
            >
              Đọc tiếp
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
