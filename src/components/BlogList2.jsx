// src/components/BlogList.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  ChevronRight,
  Clock,
  Tag,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

// --------- Vite-friendly UI primitives (no external UI lib) ----------
function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

function Button({
  className = "",
  variant = "default",
  size = "md",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-orange-500 hover:bg-orange-600 text-white",
    outline: "border border-neutral-300 bg-white hover:bg-neutral-50",
    ghost: "bg-transparent hover:bg-neutral-100",
  };
  const sizes = { md: "h-10 px-4 py-2", icon: "h-10 w-10 p-0" };
  return (
    <button
      className={cx(
        base,
        variants[variant],
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    />
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={cx(
        "h-10 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10",
        className
      )}
      {...props}
    />
  );
}

function Card({ className = "", ...props }) {
  return (
    <div className={cx("rounded-2xl border bg-white", className)} {...props} />
  );
}
function CardContent({ className = "", ...props }) {
  return <div className={cx("p-6", className)} {...props} />;
}
// ---------------------------------------------------------------------

// --------- Mock data -------------------------------------------------
const POSTS = [
  {
    id: 1,
    title: "5 mẹo nấu ăn nhanh mà vẫn ngon cho người bận rộn",
    excerpt:
      "Tiết kiệm 30 phút mỗi tối với những mẹo nhỏ nhưng hiệu quả, từ chuẩn bị nguyên liệu đến tối ưu dụng cụ...",
    author: "Cookpad Team",
    authorAvatar: "https://i.pravatar.cc/80?img=12",
    date: "2025-09-24",
    category: "Mẹo nhà bếp",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Gợi ý thực đơn tuần: 7 món thanh đạm mà đủ chất",
    excerpt:
      "Thực đơn theo ngày với nguyên liệu dễ mua, kèm gợi ý chuẩn bị trước để bạn nhàn hơn trong tuần.",
    author: "Lan Anh",
    authorAvatar: "https://i.pravatar.cc/80?img=5",
    date: "2025-09-20",
    category: "Thực đơn tuần",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Cách chọn nồi chảo an toàn cho sức khoẻ",
    excerpt:
      "So sánh inox, gang, gốm phủ và chống dính – ưu nhược điểm và khi nào nên dùng loại nào.",
    author: "Hà Mi",
    authorAvatar: "https://i.pravatar.cc/80?img=14",
    date: "2025-08-30",
    category: "Dụng cụ bếp",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Thực hành ăn theo mùa: rau quả tháng 10",
    excerpt:
      "Danh sách rau củ quả ngon mùa này, lưu ngay để đi chợ thông minh hơn!",
    author: "Minh Châu",
    authorAvatar: "https://i.pravatar.cc/80?img=36",
    date: "2025-09-28",
    category: "Ăn theo mùa",
    image:
      "https://images.unsplash.com/photo-1511690078903-7b54b58f0b4a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Bí kíp ướp thịt chuẩn đầu bếp",
    excerpt:
      "Tỉ lệ vàng cho từng loại thịt và 3 lỗi thường gặp khiến món nướng bị khô.",
    author: "Quốc Việt",
    authorAvatar: "https://i.pravatar.cc/80?img=31",
    date: "2025-07-15",
    category: "Kỹ thuật nấu",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Meal prep 101: chuẩn bị 10 phần ăn trong 90 phút",
    excerpt:
      "Một quy trình đơn giản để nấu một lần ăn cả tuần, phù hợp người mới bắt đầu.",
    author: "Bếp Nhàn",
    authorAvatar: "https://i.pravatar.cc/80?img=22",
    date: "2025-09-10",
    category: "Meal Prep",
    image:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1200&auto=format&fit=crop",
  },
];

const CATEGORIES = [
  "Tất cả",
  "Mẹo nhà bếp",
  "Thực đơn tuần",
  "Dụng cụ bếp",
  "Ăn theo mùa",
  "Kỹ thuật nấu",
  "Meal Prep",
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ----------------- Page pieces ---------------------------------------
function Header({ onToggleNav }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-orange-500 text-white grid place-items-center font-bold">
              C
            </div>
            <a href="#" className="font-semibold text-lg">
              Cookpad-style Blog
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600">
            <a className="hover:text-black" href="#cat">
              Chủ đề
            </a>
            <a className="hover:text-black" href="#latest">
              Bài mới
            </a>
            <a className="hover:text-black" href="#about">
              Giới thiệu
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <SearchInput />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onToggleNav}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ open }) {
  if (!open) return null;
  return (
    <div className="md:hidden border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-3 flex flex-col gap-3">
        <a className="text-neutral-700" href="#cat">
          Chủ đề
        </a>
        <a className="text-neutral-700" href="#latest">
          Bài mới
        </a>
        <a className="text-neutral-700" href="#about">
          Giới thiệu
        </a>
        <div className="pt-2">
          <SearchInput />
        </div>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <Input
        defaultValue={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Tìm bài viết, chủ đề..."
        className="pl-9 w-full md:w-72"
      />
    </form>
  );
}

function CategoryPills({ current, onPick }) {
  return (
    <div id="cat" className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onPick(c)}
          className={cx(
    "px-3 py-1.5 rounded-full text-sm transition-colors",
    current === c
      ? "bg-orange-500 text-white border border-orange-600 shadow-sm"
      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200"
  )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function Featured({ post }) {
  if (!post) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid md:grid-cols-2 gap-6 md:gap-10 items-stretch"
      >
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={post.image}
            alt={post.title}
            className="h-72 md:h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-2 inline-flex items-center gap-2 text-sm text-neutral-600">
            <Tag className="h-4 w-4" /> {post.category}
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4" /> {formatDate(post.date)}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            {post.title}
          </h1>
          <p className="mt-3 text-neutral-600">{post.excerpt}</p>
          <div className="mt-5 flex items-center gap-3">
            <img
              className="h-9 w-9 rounded-full"
              src={post.authorAvatar}
              alt={post.author}
            />
            <div className="text-sm">
              <div className="font-medium">{post.author}</div>
              <div className="text-neutral-500">Tác giả</div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="group">
              Đọc tiếp{" "}
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function PostCard({ post }) {
  return (
    <Card className="rounded-2xl overflow-hidden border-neutral-200 h-full">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="p-5">
        <div className="text-xs text-neutral-600 flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" /> {post.category}
          </span>
          <span>•</span>
          <span>{formatDate(post.date)}</span>
        </div>
        <h3 className="mt-2 font-semibold text-lg leading-snug line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <img
            className="h-8 w-8 rounded-full"
            src={post.authorAvatar}
            alt={post.author}
          />
          <div className="text-sm text-neutral-700">{post.author}</div>
        </div>
        <div className="mt-4">
          <Button variant="ghost" className="px-0">
            Đọc bài <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer id="about" className="mt-16 border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-orange-500 text-white grid place-items-center font-bold">
              C
            </div>
            <span className="font-semibold">Cookpad-style Blog</span>
          </div>
          <p className="mt-3 text-sm text-neutral-600">
            Giao diện mẫu truyền cảm hứng từ blog Cookpad. Code single-file, dễ
            thay dữ liệu & tích hợp CMS.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Chuyên mục</div>
          <ul className="space-y-2 text-sm text-neutral-700">
            {CATEGORIES.filter((c) => c !== "Tất cả").map((c) => (
              <li key={c}>
                <a className="hover:underline" href="#cat">
                  {c}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Kết nối</div>
          <div className="flex items-center gap-3 text-neutral-600">
            <a href="#" aria-label="Facebook" className="hover:text-black">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-black">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-black">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-neutral-500">
        © 2025 Demo UI. All rights reserved.
      </div>
    </footer>
  );
}

// ----------------- Main component -----------------------------------
export default function BlogList() {
  const [openNav, setOpenNav] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POSTS.filter(
      (p) =>
        (cat === "Tất cả" || p.category === cat) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q))
    );
  }, [query, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const featured = useMemo(() => {
    return [...POSTS].sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header onToggleNav={() => setOpenNav((v) => !v)} />
      <MobileNav open={openNav} />

      <Featured post={featured} />

      <section
        id="latest"
        className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mt-10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold">
            Bài viết nổi bật & mới nhất
          </h2>
          <div className="flex items-center gap-3">
            <CategoryPills
              current={cat}
              onPick={(c) => {
                setCat(c);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="mt-6 md:hidden">
          <SearchInput value={query} onChange={setQuery} onSubmit={() => {}} />
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <PostCard post={p} />
            </motion.div>
          ))}
          {pageItems.length === 0 && (
            <div className="col-span-full text-center py-16 text-neutral-600">
              Không tìm thấy bài phù hợp. Hãy thử từ khoá khác.
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </Button>
          <div className="px-3 py-1 rounded-full bg-white border border-neutral-200 text-sm">
            Trang {page}/{totalPages}
          </div>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Sau
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
