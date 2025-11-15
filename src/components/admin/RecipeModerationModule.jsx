import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  Button,
  Tag,
  Modal,
  Input,
  message,
  Spin,
  Alert,
  Pagination,
} from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/ContentModeration.css";
import {
  getPendingRecipesAdmin,
  approveRecipeAdmin,
  rejectRecipeAdmin,
  getModerationStatsAdmin,
} from "../../apis/recipe";

const { TextArea } = Input;

export default function RecipeModerationModule() {
  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    category: null,
    status: null,
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recipesPerPage = 10;

  // Fetch recipes
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: recipesPerPage,
      };

      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.category) {
        params.category = filters.category;
      }

      const response = await getPendingRecipesAdmin(params);
      if (response.success) {
        setRecipes(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError("Không thể tải danh sách recipes");
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err.message || "Lỗi khi tải danh sách recipes");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, recipesPerPage]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getModerationStatsAdmin();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleApprove = async (recipeId) => {
    try {
      setProcessingId(recipeId);
      const response = await approveRecipeAdmin(recipeId);
      if (response.success) {
        message.success("Đã duyệt recipe thành công!");
        await fetchRecipes();
        await fetchStats();
        if (selectedRecipe?._id === recipeId) {
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      message.error(err.message || "Lỗi khi duyệt recipe");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (recipeId) => {
    if (!rejectReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    try {
      setProcessingId(recipeId);
      const response = await rejectRecipeAdmin(recipeId, rejectReason);
      if (response.success) {
        message.success("Đã từ chối recipe thành công!");
        setRejectReason("");
        await fetchRecipes();
        await fetchStats();
        setIsModalOpen(false);
      }
    } catch (err) {
      message.error(err.message || "Lỗi khi từ chối recipe");
    } finally {
      setProcessingId(null);
    }
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setRejectReason("");
    setIsModalOpen(true);
  };

  // Extract unique categories from recipes
  const categories = [...new Set(recipes.flatMap((r) => r.tags || []))].filter(
    Boolean
  );

  if (loading && recipes.length === 0) {
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
          <Tag color="blue">Chờ duyệt: {stats.pending || 0}</Tag>
          <Tag color="green">Đã duyệt: {stats.published || 0}</Tag>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="admin-filter-bar">
        <Input
          placeholder="Tìm kiếm theo tên..."
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
          placeholder="Loại món ăn"
          allowClear
          value={filters.category}
          onChange={(value) => {
            setFilters({ ...filters, category: value });
            setCurrentPage(1);
          }}
          style={{ minWidth: 150 }}
          options={categories.map((cat) => ({ value: cat, label: cat }))}
        />

        <Select
          placeholder="Trạng thái"
          allowClear
          value={filters.status}
          onChange={(value) => {
            setFilters({ ...filters, status: value });
            setCurrentPage(1);
          }}
          style={{ minWidth: 150 }}
          options={[
            { value: "published", label: "Chờ duyệt" },
            { value: "private", label: "Đã duyệt" },
          ]}
        />
      </div>

      {/* CARD LIST */}
      <div className="admin-card-grid">
        {recipes.length === 0 ? (
          <div className="text-center py-5 text-muted">
            Không có recipe nào cần duyệt
          </div>
        ) : (
          recipes.map((recipe) => {
            const mainTag = recipe.tags?.[0] || "Không có";

            return (
              <div key={recipe._id} className="admin-card-fixed">
                <div>
                  <div className="admin-card-tags">
                    <Tag color="purple">{mainTag}</Tag>
                  </div>

                  <h4 className="admin-card-title">
                    {recipe.name || "Không có tên"}
                  </h4>
                  <Tag
                    color={recipe.status === "published" ? "green" : "orange"}
                    style={{ marginBottom: 8 }}
                  >
                    {recipe.status === "published" ? "Đã duyệt" : "Chờ duyệt"}
                  </Tag>
                  <p>
                    <strong>Người đăng:</strong>{" "}
                    {recipe.author || recipe.authorId?.name || "Ẩn danh"}
                  </p>
                  {recipe.views !== undefined && (
                    <p>
                      <small>Lượt xem: {recipe.views || 0}</small>
                    </p>
                  )}
                </div>

                <div className="admin-card-actions">
                  <Button
                    type="primary"
                    icon={<Icon icon="mdi:eye-outline" width="18" />}
                    onClick={() => openModal(recipe)}
                    block
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 text-center">
          <Pagination
            current={currentPage}
            total={totalPages * recipesPerPage}
            pageSize={recipesPerPage}
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
        }}
        footer={null}
        width={650}
        title={`Xem trước công thức — ${
          selectedRecipe?.name || "Không có tên"
        }`}
      >
        {selectedRecipe && (
          <>
            {selectedRecipe.image && (
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "16px",
                }}
              />
            )}

            <p>
              <strong>Người đăng:</strong>{" "}
              {selectedRecipe.author ||
                selectedRecipe.authorId?.name ||
                "Ẩn danh"}
            </p>
            <p>
              <strong>Mô tả:</strong>{" "}
              {selectedRecipe.description || "Không có mô tả"}
            </p>

            {selectedRecipe.ingredients &&
              selectedRecipe.ingredients.length > 0 && (
                <>
                  <h4>📌 Nguyên liệu:</h4>
                  <ul>
                    {selectedRecipe.ingredients.map((ing, index) => (
                      <li key={index}>
                        {typeof ing === "object"
                          ? `${ing.name}: ${ing.amount}`
                          : ing}
                      </li>
                    ))}
                  </ul>
                </>
              )}

            {selectedRecipe.steps && selectedRecipe.steps.length > 0 && (
              <>
                <h4>👩‍🍳 Các bước thực hiện:</h4>
                <ol>
                  {selectedRecipe.steps.map((step, index) => (
                    <li key={index}>
                      {typeof step === "object" ? step.description : step}
                    </li>
                  ))}
                </ol>
              </>
            )}

            {selectedRecipe.status !== "published" && (
              <div style={{ marginTop: 16 }}>
                <TextArea
                  placeholder="Nhập lý do từ chối (nếu có)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  style={{ marginBottom: 12 }}
                />
                <div style={{ textAlign: "right" }}>
                  <Button
                    danger
                    onClick={() => handleReject(selectedRecipe._id)}
                    loading={processingId === selectedRecipe._id}
                    disabled={processingId !== null}
                  >
                    Từ chối
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handleApprove(selectedRecipe._id)}
                    loading={processingId === selectedRecipe._id}
                    disabled={processingId !== null}
                    style={{ marginLeft: 8 }}
                  >
                    Duyệt
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
