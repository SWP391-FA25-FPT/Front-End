import { baseUrl, apiUrls } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Get ratings by recipe ID
export const getRatingsByRecipeId = async (recipeId) => {
  try {
    const token = getCookie("token");
    
    const headers = {
      "Content-Type": "application/json",
    };
    
    // Add token if user is authenticated
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/ratings`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy đánh giá");
    }

    return data;
  } catch (error) {
    console.error("Get ratings error:", error);
    throw error;
  }
};

// Create or update rating (requires authentication)
export const createOrUpdateRating = async (recipeId, rating) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi tạo/cập nhật đánh giá");
    }

    return data;
  } catch (error) {
    console.error("Create/Update rating error:", error);
    throw error;
  }
};

// Delete user's rating for a recipe (requires authentication)
export const deleteUserRating = async (recipeId) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/ratings`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi xóa đánh giá");
    }

    return data;
  } catch (error) {
    console.error("Delete rating error:", error);
    throw error;
  }
};

// Delete rating by ID (requires authentication)
export const deleteRating = async (ratingId) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}/api/ratings/${ratingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi xóa đánh giá");
    }

    return data;
  } catch (error) {
    console.error("Delete rating error:", error);
    throw error;
  }
};

