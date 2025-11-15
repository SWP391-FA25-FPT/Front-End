import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tabs, Tag, Spin, message, Pagination } from "antd";
import { Icon } from "@iconify/react";
import SettingLayout from "../components/layout/SettingLayout";
import PostGrid from "../components/blog/PostGrid";
import { getMyBlogs } from "../apis/blog";
import "../pages/style/blog.css";

function formatDate(iso) {
  if (!iso) return "N/A";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error, iso);
    return "N/A";
  }
}

const MyBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all", "published", "pending", "rejected"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const blogsPerPage = 12;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: blogsPerPage,
      };

      // Filter based on active tab
      if (activeTab === "published") {
        params.published = true;
      } else if (activeTab === "pending") {
        params.published = false;
      }

      const response = await getMyBlogs(params);

      if (response.success) {
        let filteredBlogs = response.data || [];

        // Filter rejected blogs if needed
        if (activeTab === "rejected") {
          filteredBlogs = filteredBlogs.filter((blog) => blog.rejected === true);
        } else if (activeTab !== "all") {
          // Exclude rejected blogs from other tabs
          filteredBlogs = filteredBlogs.filter(
            (blog) => !blog.rejected || blog.rejected === false
          );
        }

        setBlogs(filteredBlogs);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError("Không thể tải danh sách blog");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message || "Lỗi khi tải danh sách blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeTab, currentPage]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const getStatusTag = (blog) => {
    if (blog.rejected) {
      return <Tag color="red">Từ chối</Tag>;
    } else if (blog.published) {
      return <Tag color="green">Đã duyệt</Tag>;
    } else {
      return <Tag color="orange">Chờ duyệt</Tag>;
    }
  };

  // Add status tags to blogs for display
  const blogsWithStatus = blogs.map((blog) => ({
    ...blog,
    statusTag: getStatusTag(blog),
  }));

  const tabItems = [
    {
      key: "all",
      label: (
        <span>
          <Icon icon="mdi:format-list-bulleted" width="18" style={{ marginRight: 8 }} />
          Tất cả
        </span>
      ),
    },
    {
      key: "published",
      label: (
        <span>
          <Icon icon="mdi:check-circle-outline" width="18" style={{ marginRight: 8 }} />
          Đã duyệt
        </span>
      ),
    },
    {
      key: "pending",
      label: (
        <span>
          <Icon icon="mdi:clock-outline" width="18" style={{ marginRight: 8 }} />
          Chờ duyệt
        </span>
      ),
    },
    {
      key: "rejected",
      label: (
        <span>
          <Icon icon="mdi:close-circle-outline" width="18" style={{ marginRight: 8 }} />
          Từ chối
        </span>
      ),
    },
  ];

  if (loading && blogs.length === 0) {
    return (
      <SettingLayout>
        <div className="py-5 blog-container">
          <div className="text-center">
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        </div>
      </SettingLayout>
    );
  }

  if (error) {
    return (
      <SettingLayout>
        <div className="py-5 blog-container">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchBlogs} style={{ marginTop: 16 }}>
              Thử lại
            </Button>
          </div>
        </div>
      </SettingLayout>
    );
  }

  return (
    <SettingLayout>
      <div className="py-5 blog-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>
            Blog Của Tôi
          </h1>
          <Button
            type="primary"
            size="large"
            icon={<Icon icon="mdi:plus" width="20" />}
            onClick={() => navigate("/blog/create")}
          >
            Tạo Blog Mới
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          style={{ marginBottom: 24 }}
        />

        {blogs.length === 0 ? (
          <div className="text-center py-5">
            <Icon
              icon="mdi:file-document-outline"
              width="64"
              style={{ color: "#ccc", marginBottom: 16 }}
            />
            <p style={{ fontSize: "16px", color: "#666", marginBottom: 16 }}>
              {activeTab === "all"
                ? "Bạn chưa có blog nào"
                : activeTab === "published"
                ? "Bạn chưa có blog nào đã được duyệt"
                : activeTab === "pending"
                ? "Bạn chưa có blog nào đang chờ duyệt"
                : "Bạn chưa có blog nào bị từ chối"}
            </p>
            {activeTab === "all" && (
              <Button
                type="primary"
                onClick={() => navigate("/blog/create")}
                icon={<Icon icon="mdi:plus" width="20" />}
              >
                Tạo Blog Đầu Tiên
              </Button>
            )}
          </div>
        ) : (
          <>
            <PostGrid posts={blogsWithStatus} formatDate={formatDate} />
            {totalPages > 1 && (
              <div className="text-center mt-4">
                <Pagination
                  current={currentPage}
                  total={totalPages * blogsPerPage}
                  pageSize={blogsPerPage}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </SettingLayout>
  );
};

export default MyBlogs;

