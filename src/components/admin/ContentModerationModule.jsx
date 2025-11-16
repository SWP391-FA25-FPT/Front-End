import React, { useState, useEffect, useCallback } from "react";
import { Select, Button, Tag, Modal, Input, message, Spin, Alert, Pagination } from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/ContentModeration.css";
import {
  getPendingRecipesAdmin,
  approveRecipeAdmin,
  rejectRecipeAdmin,
} from "../../apis/recipe";

const { TextArea } = Input;

export default function ContentModerationModule() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({ category: null });
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

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleApprove = async (recipeId) => {
    try {
      setProcessingId(recipeId);
      const response = await approveRecipeAdmin(recipeId);
      if (response.success) {
        message.success("Đã duyệt recipe thành công!");
        await fetchRecipes();
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
  const categories = [...new Set(recipes.map(r => r.category).filter(Boolean))];

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
      {/* FILTER BAR */}
      <div className="admin-filter-bar">
        <Select
          placeholder="Loại món ăn"
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

      {/* CARD LIST */}
      <div className="admin-card-grid">
        {recipes.length === 0 ? (
          <div className="text-center py-5 text-muted">
            Không có recipe nào chờ duyệt
          </div>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe._id} className="admin-card-fixed">
              <div>
                <div className="admin-card-tags">
                  {recipe.category && <Tag color="purple">{recipe.category}</Tag>}
                </div>

                <h4 className="admin-card-title">{recipe.title || "Không có tiêu đề"}</h4>
                <Tag
                  color={recipe.published ? "green" : "orange"}
                  style={{ marginBottom: 8 }}
                >
                  {recipe.published ? "Đã duyệt" : "Chưa duyệt"}
                </Tag>
                <p><strong>Người đăng:</strong> {recipe.author || recipe.authorId?.name || "Ẩn danh"}</p>
                <p><small>Lượt xem: {recipe.views || 0} | Like: {recipe.likes?.length || 0}</small></p>
              </div>

              <div className="admin-card-actions">
                <Button
                  type="text"
                  icon={<Icon icon="mdi:eye-outline" width="18" />}
                  onClick={() => openModal(recipe)}
                >
                  Xem chi tiết
                </Button>

                {!recipe.published && (
                  <div className="admin-approve-reject">
                    <Button
                      type="primary"
                      onClick={() => handleApprove(recipe._id)}
                      loading={processingId === recipe._id}
                      disabled={processingId !== null}
                    >
                      Duyệt
                    </Button>
                    <Button
                      danger
                      onClick={() => {
                        setSelectedRecipe(recipe);
                        setRejectReason("");
                        setIsModalOpen(true);
                      }}
                      disabled={processingId !== null}
                    >
                      Từ chối
                    </Button>
                  </div>
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
        title={`Xem trước công thức — ${selectedRecipe?.title || "Không có tiêu đề"}`}
      >
        {selectedRecipe && (
          <>
            {selectedRecipe.imageUrl && (
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                style={{ width: "100%", borderRadius: "12px", marginBottom: "16px" }}
              />
            )}

            <p><strong>Người đăng:</strong> {selectedRecipe.author || selectedRecipe.authorId?.name || "Ẩn danh"}</p>
            <p><strong>Danh mục:</strong> {selectedRecipe.category || "Không có"}</p>

            {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
              <>
                <h4>📌 Nguyên liệu:</h4>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedRecipe.steps && selectedRecipe.steps.length > 0 && (
              <>
                <h4>👩‍🍳 Các bước thực hiện:</h4>
                <ol>
                  {selectedRecipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </>
            )}

            {selectedRecipe.content && (
              <>
                <h4>📄 Nội dung:</h4>
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedRecipe.content }}
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

            {!selectedRecipe.published && (
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
