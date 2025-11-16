import React, { useState, useEffect, useCallback } from "react";
import { Select, Button, Tag, Modal, Input, message, Spin, Alert, Pagination, Tabs } from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/ContentModeration.css";
import {
  getAllBlogsAdmin,
  updateBlogAdmin,
  deleteBlogAdmin,
  getBlogStats,
} from "../../apis/blog";
import { baseUrl } from "../../utils/constants";
import { getCookie } from "../../utils/cookie";

const { TextArea } = Input;

export default function BlogModerationModule() {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [modalAction, setModalAction] = useState(null); // "approve", "reject", or null (view only)

  // Filters
  const [filters, setFilters] = useState({
    category: null,
    published: "all",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const blogsPerPage = 10;
  const [activeTab, setActiveTab] = useState("pending"); // "pending", "approved", or "rejected"

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: blogsPerPage,
      };

      // Set published/rejected based on active tab
      if (activeTab === "pending") {
        params.published = false;
        params.rejected = false; // Chưa duyệt và chưa từ chối
      } else if (activeTab === "approved") {
        params.published = true;
        params.rejected = false; // Đã duyệt và không bị từ chối
      } else if (activeTab === "rejected") {
        params.rejected = true; // Bị từ chối
      } else if (filters.published !== "all") {
        params.published = filters.published === "true";
      }

      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.category) {
        params.category = filters.category;
      }

      const response = await getAllBlogsAdmin(params);
      if (response.success) {
        setBlogs(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError("Không thể tải danh sách blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message || "Lỗi khi tải danh sách blogs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, blogsPerPage, activeTab]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getBlogStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleApprove = async (blogId) => {
    try {
      setProcessingId(blogId);
      // Set published = true and reset rejected status
      const response = await updateBlogStatusAdmin(blogId, true, false, "");
      if (response.success) {
        message.success("Đã duyệt blog thành công!");
        await fetchBlogs();
        await fetchStats();
        if (selectedBlog?._id === blogId) {
          setIsModalOpen(false);
          setModalAction(null);
        }
      }
    } catch (err) {
      message.error(err.message || "Lỗi khi duyệt blog");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (blogId) => {
    if (!rejectReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    try {
      setProcessingId(blogId);
      // Set rejected = true and rejectionReason
      const response = await updateBlogStatusAdmin(blogId, false, true, rejectReason);
      if (response.success) {
        message.success("Đã từ chối blog thành công!");
        setRejectReason("");
        await fetchBlogs();
        await fetchStats();
        setIsModalOpen(false);
        setModalAction(null);
      }
    } catch (err) {
      message.error(err.message || "Lỗi khi từ chối blog");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa blog này không?")) {
      return;
    }
    try {
      setProcessingId(blogId);
      const response = await deleteBlogAdmin(blogId);
      if (response.success) {
        message.success("Đã xóa blog thành công!");
        await fetchBlogs();
        await fetchStats();
        if (selectedBlog?._id === blogId) {
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      message.error(err.message || "Lỗi khi xóa blog");
    } finally {
      setProcessingId(null);
    }
  };

  const openModal = (blog, action = null) => {
    setSelectedBlog(blog);
    setRejectReason("");
    setModalAction(action); // "approve", "reject", or null
    setIsModalOpen(true);
  };

  // Helper function to update blog status with JSON (not FormData)
  const updateBlogStatusAdmin = async (blogId, published, rejected = false, rejectionReason = "") => {
    try {
      const token = getCookie("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập");
      }

      const body = {};
      if (published !== undefined) {
        body.published = published;
      }
      if (rejected !== undefined) {
        body.rejected = rejected;
      }
      if (rejectionReason !== undefined) {
        body.rejectionReason = rejectionReason;
      }

      const response = await fetch(`${baseUrl}/api/blogs/admin/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi cập nhật blog");
      }

      return data;
    } catch (error) {
      console.error("Update blog status error:", error);
      throw error;
    }
  };

  // Extract unique categories from blogs
  const categories = [...new Set(blogs.map(b => b.category).filter(Boolean))];

  if (loading && blogs.length === 0) {
    return (
      <div className="text-center py-5">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon />;
  }

  return (
    <div className="admin-module-wrapper">
      {/* Stats */}
      {stats && (
        <div className="mb-4 d-flex gap-3 flex-wrap">
          <Tag color="blue">Tổng: {stats.total || 0}</Tag>
          <Tag color="green">Đã duyệt: {stats.published || 0}</Tag>
          <Tag color="orange">Chưa duyệt: {stats.unpublished || 0}</Tag>
          <Tag color="red">Từ chối: {stats.rejected || 0}</Tag>
          <Tag color="purple">Lượt xem: {stats.totalViews || 0}</Tag>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="admin-filter-bar">
        <Input
          placeholder="Tìm kiếm theo tiêu đề..."
          value={filters.search}
          onChange={(e) => {
            setFilters({ ...filters, search: e.target.value });
            setCurrentPage(1);
          }}
          style={{ maxWidth: 300 }}
          prefix={<Icon icon="mdi:magnify" width="18" />}
          allowClear
        />

        <Select
          placeholder="Danh mục"
          allowClear
          value={filters.category}
          onChange={(value) => {
            setFilters({ ...filters, category: value });
            setCurrentPage(1);
          }}
          style={{ minWidth: 150 }}
          options={categories.map(cat => ({ value: cat, label: cat }))}
        />
      </div>

      {/* TABS FOR APPROVED AND PENDING */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setCurrentPage(1);
        }}
        items={[
          {
            key: "pending",
            label: (
              <span>
                <Icon icon="mdi:clock-outline" width="18" style={{ marginRight: 8 }} />
                Chưa duyệt
                {stats && (
                  <Tag color="orange" style={{ marginLeft: 8 }}>
                    {stats.unpublished || 0}
                  </Tag>
                )}
              </span>
            ),
          },
          {
            key: "approved",
            label: (
              <span>
                <Icon icon="mdi:check-circle-outline" width="18" style={{ marginRight: 8 }} />
                Đã duyệt
                {stats && (
                  <Tag color="green" style={{ marginLeft: 8 }}>
                    {stats.published || 0}
                  </Tag>
                )}
              </span>
            ),
          },
          {
            key: "rejected",
            label: (
              <span>
                <Icon icon="mdi:close-circle-outline" width="18" style={{ marginRight: 8 }} />
                Từ chối
                {stats && (
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    {stats.rejected || 0}
                  </Tag>
                )}
              </span>
            ),
          },
        ]}
        style={{
          background: "#ffffff",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Content will be rendered below */}
      </Tabs>

      {/* CARD LIST */}
      <div className="admin-card-grid" style={{ marginTop: 24 }}>
        {loading && blogs.length === 0 ? (
          <div className="text-center py-5">
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            {activeTab === "pending" 
              ? "Không có blog nào chưa duyệt" 
              : activeTab === "approved"
              ? "Không có blog nào đã duyệt"
              : "Không có blog nào bị từ chối"}
          </div>
        ) : (
          blogs.map((blog) => (
            <div 
              key={blog._id} 
              className={`admin-card-fixed ${
                blog.rejected ? 'card-rejected' : 
                blog.published ? 'card-approved' : 
                'card-pending'
              }`}
            >
              <div>
                <div className="admin-card-tags">
                  {blog.category && <Tag color="purple">{blog.category}</Tag>}
                  {blog.tags && blog.tags.length > 0 && (
                    <Tag color="blue">{blog.tags[0]}</Tag>
                  )}
                </div>

                <h4 className="admin-card-title">{blog.title || "Không có tiêu đề"}</h4>
                <Tag
                  color={blog.rejected ? "red" : blog.published ? "green" : "orange"}
                  style={{ marginBottom: 8 }}
                >
                  {blog.rejected ? "Từ chối" : blog.published ? "Đã duyệt" : "Chưa duyệt"}
                </Tag>
                {blog.rejectionReason && (
                  <p style={{ fontSize: "12px", color: "#ff4d4f", marginTop: 4 }}>
                    <strong>Lý do:</strong> {blog.rejectionReason}
                  </p>
                )}
                <p><strong>Người đăng:</strong> {blog.author || blog.authorId?.name || "Ẩn danh"}</p>
                <p><small>Lượt xem: {blog.views || 0} | Like: {blog.likes?.length || 0}</small></p>
              </div>

              <div className="admin-card-actions">
                <Button
                  type="text"
                  icon={<Icon icon="mdi:eye-outline" width="18" />}
                  onClick={() => openModal(blog)}
                >
                  Xem chi tiết
                </Button>

                {!blog.published && !blog.rejected && (
                  <div className="admin-approve-reject">
                    <Button
                      type="primary"
                      onClick={() => openModal(blog, "approve")}
                      disabled={processingId !== null}
                    >
                      Duyệt
                    </Button>
                    <Button
                      danger
                      onClick={() => openModal(blog, "reject")}
                      disabled={processingId !== null}
                    >
                      Từ chối
                    </Button>
                  </div>
                )}

                {blog.published && !blog.rejected && (
                  <Button
                    danger
                    type="text"
                    icon={<Icon icon="mdi:delete-outline" width="18" />}
                    onClick={() => handleDelete(blog._id)}
                    loading={processingId === blog._id}
                    disabled={processingId !== null}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 text-center">
          <Pagination
            current={currentPage}
            total={totalPages * blogsPerPage}
            pageSize={blogsPerPage}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* MODAL XEM CHI TIẾT */}
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setRejectReason("");
          setModalAction(null);
        }}
        footer={null}
        width={650}
        title={`Xem trước blog — ${selectedBlog?.title || "Không có tiêu đề"}`}
      >
        {selectedBlog && (
          <>
            {selectedBlog.imageUrl && (
              <img
                src={selectedBlog.imageUrl}
                alt={selectedBlog.title}
                style={{ width: "100%", borderRadius: "12px", marginBottom: "16px" }}
              />
            )}

            <p><strong>Người đăng:</strong> {selectedBlog.author || selectedBlog.authorId?.name || "Ẩn danh"}</p>
            <p><strong>Danh mục:</strong> {selectedBlog.category || "Không có"}</p>
            {selectedBlog.excerpt && (
              <p><strong>Mô tả ngắn:</strong> {selectedBlog.excerpt}</p>
            )}
            
            {selectedBlog.content && (
              <>
                <h4>📄 Nội dung:</h4>
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  style={{ 
                    maxHeight: "400px", 
                    overflowY: "auto",
                    border: "1px solid #e8e8e8",
                    padding: "12px",
                    borderRadius: "4px"
                  }}
                />
              </>
            )}

            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Tags:</strong> {selectedBlog.tags.map((tag, idx) => (
                  <Tag key={idx} color="blue">{tag}</Tag>
                ))}
              </div>
            )}

            {selectedBlog.rejected && (
              <div style={{ marginTop: 16, padding: "12px", background: "#fff2f0", border: "1px solid #ffccc7", borderRadius: "8px" }}>
                <p style={{ margin: 0, color: "#ff4d4f", fontWeight: 500 }}>
                  <strong>Lý do từ chối:</strong> {selectedBlog.rejectionReason || "Không có lý do"}
                </p>
                {selectedBlog.rejectedAt && (
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#8c8c8c" }}>
                    Từ chối vào: {new Date(selectedBlog.rejectedAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </div>
            )}

            {!selectedBlog.published && !selectedBlog.rejected && (
              <div style={{ marginTop: 16 }}>
                {/* Chỉ hiển thị TextArea khi action là "reject" */}
                {modalAction === "reject" && (
                  <TextArea
                    placeholder="Nhập lý do từ chối (bắt buộc)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    style={{ marginBottom: 12 }}
                  />
                )}
                <div style={{ textAlign: "right" }}>
                  {/* Chỉ hiển thị nút "Từ chối" khi action là "reject" */}
                  {modalAction === "reject" && (
                    <Button
                      danger
                      onClick={() => handleReject(selectedBlog._id)}
                      loading={processingId === selectedBlog._id}
                      disabled={processingId !== null}
                    >
                      Từ chối
                    </Button>
                  )}
                  {/* Chỉ hiển thị nút "Duyệt" khi action là "approve" */}
                  {modalAction === "approve" && (
                    <Button
                      type="primary"
                      onClick={() => handleApprove(selectedBlog._id)}
                      loading={processingId === selectedBlog._id}
                      disabled={processingId !== null}
                    >
                      Duyệt
                    </Button>
                  )}
                </div>
              </div>
            )}

            {selectedBlog.published && !selectedBlog.rejected && (
              <div style={{ marginTop: 16, textAlign: "right" }}>
                <Button
                  danger
                  onClick={() => handleDelete(selectedBlog._id)}
                  loading={processingId === selectedBlog._id}
                  disabled={processingId !== null}
                >
                  Xóa
                </Button>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

