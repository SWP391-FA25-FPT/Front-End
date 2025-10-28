import React, { useState, useEffect } from "react";
import { Button, Space, message, Modal } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { deleteRecipe, toggleSaveRecipe, checkRecipeSaved } from "../../apis/recipe";
import "./Recipe.css";

const { confirm } = Modal;

const RecipeActions = ({ recipe, onUpdate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  const isOwner = user && recipe.authorId === user._id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOwner || isAdmin;

  // Check if recipe is saved on component mount
  useEffect(() => {
    const checkSaved = async () => {
      if (user && recipe._id) {
        try {
          const response = await checkRecipeSaved(recipe._id);
          setIsSaved(response.data?.isSaved || false);
        } catch (error) {
          console.error('Check saved error:', error);
        }
      }
    };
    checkSaved();
  }, [recipe._id, user]);

  const handleEdit = () => {
    navigate(`/recipe/${recipe._id}/edit`);
  };

  const handleDelete = () => {
    confirm({
      title: 'Xác nhận xóa công thức',
      content: 'Bạn có chắc chắn muốn xóa công thức này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteRecipe(recipe._id);
          message.success('Xóa công thức thành công');
          navigate('/');
        } catch (error) {
          message.error(error.message || 'Lỗi khi xóa công thức');
        }
      },
    });
  };

  const handleSave = async () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để lưu công thức');
      navigate('/login');
      return;
    }

    try {
      setSavingLoading(true);
      const response = await toggleSaveRecipe(recipe._id);
      setIsSaved(response.data?.isSaved || false);
      message.success(response.message || (response.data?.isSaved ? 'Đã lưu công thức' : 'Đã bỏ lưu công thức'));
      
      // Update recipe saves count if needed
      if (onUpdate && response.data?.savesCount !== undefined) {
        onUpdate({ ...recipe, saves: response.data.savesCount });
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi lưu công thức');
    } finally {
      setSavingLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.name,
          text: recipe.description,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        message.success('Đã copy link vào clipboard');
      }
    } catch (error) {
      console.error('Share error:', error);
      message.error('Lỗi khi chia sẻ');
    }
  };

  return (
    <div className="recipe-actions" style={{ marginBottom: "24px" }}>
      <Space size="small" wrap>
        {canEdit && (
          <>
            <Button 
              type="primary" 
              icon={<Icon icon="mdi:pencil" width="18" />}
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
            <Button 
              danger 
              icon={<Icon icon="mdi:delete" width="18" />}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </>
        )}
        
        <Button 
          size="large"
          icon={<Icon icon={isSaved ? "mdi:bookmark" : "mdi:bookmark-outline"} width="20" />}
          onClick={handleSave}
          loading={savingLoading}
          className="btn-save-recipe"
          style={{
            height: "40px",
            padding: "0 20px",
            fontSize: "15px",
            fontWeight: "500",
            borderColor: "#ff9500",
            color: "#ff9500",
            backgroundColor: isSaved ? "#fff5e6" : "transparent",
          }}
        >
          {isSaved ? "Đã lưu" : "Lưu"}
        </Button>
        
        <Button 
          size="large"
          icon={<Icon icon="mdi:share-variant" width="20" />}
          onClick={handleShare}
          style={{
            height: "40px",
            padding: "0 20px",
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          Chia sẻ
        </Button>
      </Space>
    </div>
  );
};

export default RecipeActions;

