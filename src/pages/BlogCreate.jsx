import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import SettingLayout from "../components/layout/SettingLayout";
import { createBlog } from "../apis/blog";
import { getAllRecipes } from "../apis/recipe";
import BlogForm from "../components/blog/BlogForm";
import "./style/BlogCreate.css";

const BlogCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // Load available recipes on mount
  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoadingRecipes(true);
        const response = await getAllRecipes({ limit: 100 });
        if (response.success && response.data) {
          setAvailableRecipes(response.data);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoadingRecipes(false);
      }
    };
    fetchRecipes();
  }, []);

  // Submit form
  const handleSubmit = async () => {
    // Validate required fields
    if (!title || !content) {
      message.error("Vui lòng nhập tiêu đề và nội dung");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("category", category);
      formData.append(
        "tags",
        tags
          ? JSON.stringify(tags.split(",").map((t) => t.trim()))
          : JSON.stringify([])
      );
      formData.append("published", published.toString());
      formData.append("relatedRecipes", JSON.stringify(relatedRecipes));

      if (mainImage) {
        formData.append("image", mainImage);
      }

      const response = await createBlog(formData);

      if (response.success) {
        message.success(
          published ? "Đã xuất bản blog thành công!" : "Đã lưu blog thành công!"
        );
        navigate(`/blog/${response.data._id}`);
      } else {
        message.error(response.error || "Lỗi khi tạo blog");
      }
    } catch (error) {
      console.error("Create blog error:", error);
      message.error(error.message || "Lỗi khi tạo blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingLayout hideUserActions>
      <div className="recipe-create-container">
        <div className="recipe-header">
          <h2>Tạo Bài Blog Mới</h2>
        </div>

        <BlogForm
          title={title}
          setTitle={setTitle}
          excerpt={excerpt}
          setExcerpt={setExcerpt}
          content={content}
          setContent={setContent}
          category={category}
          setCategory={setCategory}
          tags={tags}
          setTags={setTags}
          published={published}
          setPublished={setPublished}
          mainImage={mainImage}
          setMainImage={setMainImage}
          mainImagePreview={mainImagePreview}
          setMainImagePreview={setMainImagePreview}
          relatedRecipes={relatedRecipes}
          setRelatedRecipes={setRelatedRecipes}
          availableRecipes={availableRecipes}
          loadingRecipes={loadingRecipes}
        />

        {/* Action Buttons */}
        <div className="form-actions">
          <Button type="default" size="large" onClick={() => navigate("/blog")}>
            Hủy
          </Button>
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSubmit}
          >
            {published ? "Xuất bản" : "Lưu nháp"}
          </Button>
        </div>
      </div>
    </SettingLayout>
  );
};

export default BlogCreate;
