import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllBlogsAdmin,
  deleteBlogAdmin,
  updateBlogAdmin,
  getBlogStats,
} from "../../apis/blog";
import { Eye, Trash2, Edit, EyeOff, Eye as EyeIcon, Search, Filter } from "lucide-react";

export default function BlogManagementModule() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState("all"); // all, true, false
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const blogsPerPage = 10;

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: blogsPerPage,
        sortBy: "createdAt",
      };

      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (filterPublished !== "all") {
        params.published = filterPublished === "true";
      }

      const response = await getAllBlogsAdmin(params);
      if (response.success) {
        setBlogs(response.data || []);
        setPagination(response.pagination || {});
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
  }, [currentPage, filterPublished, searchTerm, blogsPerPage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await getBlogStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStatsData();
  }, []);


  const handleDelete = async (blogId) => {
    try {
      setDeletingId(blogId);
      await deleteBlogAdmin(blogId);
      fetchBlogs();
      // Refresh stats
      const statsResponse = await getBlogStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      setShowDeleteConfirm(false);
      setSelectedBlog(null);
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(err.message || "Lỗi khi xóa blog");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      const formData = new FormData();
      formData.append("published", !blog.published);
      formData.append("title", blog.title);
      formData.append("content", blog.content);
      formData.append("excerpt", blog.excerpt || "");
      formData.append("category", blog.category || "");
      if (blog.tags && blog.tags.length > 0) {
        formData.append("tags", JSON.stringify(blog.tags));
      }
      if (blog.relatedRecipes && blog.relatedRecipes.length > 0) {
        formData.append("relatedRecipes", JSON.stringify(blog.relatedRecipes));
      }

      await updateBlogAdmin(blog._id, formData);
      fetchBlogs();
      // Refresh stats
      const statsResponse = await getBlogStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      alert(err.message || "Lỗi khi cập nhật blog");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (published) => {
    return published ? (
      <span className="badge bg-success">Published</span>
    ) : (
      <span className="badge bg-secondary">Draft</span>
    );
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4">Blog Management</h4>

      {/* Stats Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="p-3 rounded shadow-sm text-center" style={{ borderLeft: "4px solid #0d6efd", background: "#e7f1ff" }}>
              <h6 className="text-muted mb-1">Total Blogs</h6>
              <h3 className="fw-bold text-primary">{stats.totalBlogs || 0}</h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3 rounded shadow-sm text-center" style={{ borderLeft: "4px solid #198754", background: "#d1e7dd" }}>
              <h6 className="text-muted mb-1">Published</h6>
              <h3 className="fw-bold text-success">{stats.publishedBlogs || 0}</h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3 rounded shadow-sm text-center" style={{ borderLeft: "4px solid #6c757d", background: "#e9ecef" }}>
              <h6 className="text-muted mb-1">Drafts</h6>
              <h3 className="fw-bold text-secondary">{stats.unpublishedBlogs || 0}</h3>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3 rounded shadow-sm text-center" style={{ borderLeft: "4px solid #ffc107", background: "#fff3cd" }}>
              <h6 className="text-muted mb-1">Total Views</h6>
              <h3 className="fw-bold text-warning">{stats.totalViews || 0}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm blog..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (currentPage !== 1) {
                  setCurrentPage(1);
                }
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterPublished}
            onChange={(e) => {
              setFilterPublished(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <div className="col-md-3 text-end">
          <button
            className="btn btn-primary"
            onClick={async () => {
              fetchBlogs();
              try {
                const statsResponse = await getBlogStats();
                if (statsResponse.success) {
                  setStats(statsResponse.data);
                }
              } catch (err) {
                console.error("Error fetching stats:", err);
              }
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Blogs Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm rounded overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Created</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  Không có blog nào
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {blog.imageUrl && (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="me-2"
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      )}
                      <div>
                        <strong>{blog.title}</strong>
                        {blog.excerpt && (
                          <p className="mb-0 text-muted small" style={{ fontSize: "0.85rem" }}>
                            {blog.excerpt.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      {blog.authorAvatar && (
                        <img
                          src={blog.authorAvatar}
                          alt={blog.author}
                          className="me-2 rounded-circle"
                          style={{ width: "30px", height: "30px", objectFit: "cover" }}
                        />
                      )}
                      <span>{blog.author}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-info">{blog.category || "N/A"}</span>
                  </td>
                  <td>{getStatusBadge(blog.published)}</td>
                  <td>
                    <span className="d-flex align-items-center">
                      <EyeIcon size={16} className="me-1" />
                      {blog.views || 0}
                    </span>
                  </td>
                  <td>{blog.likes?.length || 0}</td>
                  <td>{formatDate(blog.createdAt)}</td>
                  <td className="text-end">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleTogglePublish(blog)}
                        title={blog.published ? "Unpublish" : "Publish"}
                      >
                        {blog.published ? <EyeOff size={16} /> : <EyeIcon size={16} />}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setSelectedBlog(blog);
                          setShowDeleteConfirm(true);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Blog pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedBlog && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => {
            setShowDeleteConfirm(false);
            setSelectedBlog(null);
          }}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedBlog(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa blog "{selectedBlog.title}"?</p>
                <p className="text-danger small">Hành động này không thể hoàn tác!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedBlog(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedBlog._id)}
                  disabled={deletingId === selectedBlog._id}
                >
                  {deletingId === selectedBlog._id ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

