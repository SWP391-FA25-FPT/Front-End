import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Empty, Button, Spin, message, Modal, Badge } from "antd";
import { Icon } from "@iconify/react";
import { getMyRecipes, deleteRecipe, updateRecipeStatus } from "../../apis/recipe";
import blank4x3 from "../../assets/blank4x3.png";

const RecipeList = ({ statusFilter, emptyDescription, emptyButtonText, emptyButtonAction }) => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, [statusFilter]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await getMyRecipes(statusFilter);
      setRecipes(response.data || []);
    } catch (error) {
      console.error("Fetch recipes error:", error);
      message.error(error.message || "Lỗi khi tải danh sách công thức");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recipeId) => {
    navigate(`/recipe/${recipeId}/edit`);
  };

  const handleDelete = (recipeId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa công thức này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteRecipe(recipeId);
          message.success("Đã xóa công thức");
          fetchRecipes();
        } catch (error) {
          message.error(error.message || "Lỗi khi xóa công thức");
        }
      },
    });
  };

  const handleChangeStatus = (recipeId, newStatus) => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: `Bạn có muốn chuyển công thức sang trạng thái "${getStatusLabel(newStatus)}"?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await updateRecipeStatus(recipeId, newStatus);
          message.success("Đã cập nhật trạng thái");
          fetchRecipes();
        } catch (error) {
          message.error(error.message || "Lỗi khi cập nhật trạng thái");
        }
      },
    });
  };

  const handleView = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "draft":
        return "Nháp";
      case "private":
        return "Riêng tư";
      case "published":
        return "Đã chia sẻ";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "default";
      case "private":
        return "blue";
      case "published":
        return "green";
      default:
        return "default";
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Vừa xong";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const RecipeCard = ({ recipe }) => (
    <Card
      hoverable
      className="recipe-card"
      cover={
        <div className="recipe-card-cover">
          <img 
            alt={recipe.name} 
            src={recipe.image || blank4x3}
            onError={(e) => {
              e.target.src = blank4x3;
            }}
          />
          <Badge
            status={getStatusColor(recipe.status)}
            text={getStatusLabel(recipe.status)}
            className="recipe-status-badge"
          />
        </div>
      }
      actions={[
        <Button
          type="text"
          icon={<Icon icon="mdi:pencil" />}
          onClick={() => handleEdit(recipe._id)}
        >
          Sửa
        </Button>,
        <Button
          type="text"
          icon={<Icon icon="mdi:eye" />}
          onClick={() => handleView(recipe._id)}
        >
          Xem
        </Button>,
        <Button
          type="text"
          danger
          icon={<Icon icon="mdi:delete" />}
          onClick={() => handleDelete(recipe._id)}
        >
          Xóa
        </Button>,
      ]}
    >
      <Card.Meta
        title={recipe.name || "Món mới"}
        description={
          <div className="recipe-card-meta">
            <div className="recipe-description">
              {recipe.description || "Chưa có mô tả"}
            </div>
            <div className="recipe-info">
              <span>
                <Icon icon="mdi:clock-outline" /> {recipe.totalTime || "N/A"}
              </span>
              <span>
                <Icon icon="mdi:account-outline" /> {recipe.servings || 0} người
              </span>
            </div>
            <div className="recipe-updated">
              Cập nhật: {getTimeAgo(recipe.updatedAt)}
            </div>
          </div>
        }
      />
      {recipe.status !== "published" && (
        <div className="recipe-card-actions">
          {recipe.status === "draft" && (
            <Button
              size="small"
              onClick={() => handleChangeStatus(recipe._id, "published")}
            >
              Lên sóng
            </Button>
          )}
          {recipe.status === "private" && (
            <>
              <Button
                size="small"
                onClick={() => handleChangeStatus(recipe._id, "published")}
              >
                Chia sẻ
              </Button>
              <Button
                size="small"
                onClick={() => handleChangeStatus(recipe._id, "draft")}
              >
                Chuyển về nháp
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <Empty
        description={emptyDescription}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        {emptyButtonText && emptyButtonAction && (
          <Button type="primary" onClick={emptyButtonAction}>
            {emptyButtonText}
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <div className="recipes-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;

