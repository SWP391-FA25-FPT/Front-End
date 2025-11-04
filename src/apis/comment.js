import { baseUrl, apiUrls } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Get comments by recipe ID
export const getCommentsByRecipeId = async (recipeId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `${baseUrl}/api/recipes/${recipeId}/comments${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy bình luận");
    }

    return data;
  } catch (error) {
    console.error("Get comments error:", error);
    throw error;
  }
};

// Create new comment (requires authentication)
export const createComment = async (recipeId, text) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi tạo bình luận");
    }

    return data;
  } catch (error) {
    console.error("Create comment error:", error);
    throw error;
  }
};

// Delete comment (requires authentication)
export const deleteComment = async (commentId) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi xóa bình luận");
    }

    return data;
  } catch (error) {
    console.error("Delete comment error:", error);
    throw error;
  }
};

