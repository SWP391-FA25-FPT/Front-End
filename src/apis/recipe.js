import { baseUrl, apiUrls } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Get all recipes with filters
export const getAllRecipes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `${baseUrl}${apiUrls.getAllRecipes}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy danh sách recipes");
    }

    return data;
  } catch (error) {
    console.error("Get all recipes error:", error);
    throw error;
  }
};

// Get single recipe by ID
export const getRecipeById = async (recipeId) => {
  try {
    // Try to get token from cookie first, fallback to localStorage for backward compatibility
    const token = getCookie("token") || localStorage.getItem("token");
    console.log("getRecipeById - Token found:", token ? "Yes" : "No");
    
    const headers = {
      "Content-Type": "application/json",
    };

    // Include token if available (for checking saved recipes and access to non-public recipes)
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("getRecipeById - Sending with Authorization header");
    } else {
      console.log("getRecipeById - No token, requesting without auth");
    }

    const response = await fetch(`${baseUrl}${apiUrls.getRecipeById}/${recipeId}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("getRecipeById - Response status:", response.status);
      console.error("getRecipeById - Response data:", data);
      throw new Error(data.error || "Lỗi khi lấy recipe");
    }

    return data;
  } catch (error) {
    console.error("Get recipe by ID error:", error);
    throw error;
  }
};

// Create new recipe (requires authentication)
export const createRecipe = async (formData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập để tạo công thức");
    }

    const response = await fetch(`${baseUrl}${apiUrls.createRecipe}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file upload
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Trả về lỗi chi tiết từ backend
      throw new Error(data.error || data.message || "Lỗi khi tạo recipe");
    }

    return data;
  } catch (error) {
    console.error("Create recipe error:", error);
    throw error;
  }
};

// Update recipe (requires authentication)
export const updateRecipe = async (recipeId, formData) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}${apiUrls.updateRecipe}/${recipeId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file upload
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật recipe");
    }

    return data;
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
};

// Delete recipe (requires authentication)
export const deleteRecipe = async (recipeId) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}${apiUrls.deleteRecipe}/${recipeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi xóa recipe");
    }

    return data;
  } catch (error) {
    console.error("Delete recipe error:", error);
    throw error;
  }
};

// Search recipes with filters
export const searchRecipes = async (keyword, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (keyword) queryParams.append('q', keyword);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.minTrustScore) queryParams.append('minTrustScore', params.minTrustScore);

    const url = `${baseUrl}${apiUrls.searchRecipes}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi tìm kiếm recipes");
    }

    return data;
  } catch (error) {
    console.error("Search recipes error:", error);
    throw error;
  }
};

// Add or toggle reaction to recipe
export const addRecipeReaction = async (recipeId, reactionType) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập để phản hồi công thức");
    }

    const response = await fetch(`${baseUrl}${apiUrls.getRecipeById}/${recipeId}/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: reactionType }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật phản hồi");
    }

    return data;
  } catch (error) {
    console.error("Add reaction error:", error);
    throw error;
  }
};

// Publish draft recipe (update status to published)
export const publishRecipeDraft = async (recipeId) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập để lên sóng công thức");
    }

    const response = await fetch(
      `${baseUrl}${apiUrls.updateRecipeStatus}/${recipeId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "published" }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lên sóng công thức");
    }

    return data;
  } catch (error) {
    console.error("Publish recipe error:", error);
    throw error;
  }
};

// Get user's drafts
export const getMyDrafts = async () => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/recipes/my/drafts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy drafts");
    }

    return data;
  } catch (error) {
    console.error("Get my drafts error:", error);
    throw error;
  }
};

// Get user's recipes by status
export const getMyRecipes = async (statusType = 'all', params = {}) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `${baseUrl}/api/recipes/my/${statusType}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy recipes");
    }

    return data;
  } catch (error) {
    console.error("Get my recipes error:", error);
    throw error;
  }
};

// Update recipe status
export const updateRecipeStatus = async (recipeId, status) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật trạng thái");
    }

    return data;
  } catch (error) {
    console.error("Update recipe status error:", error);
    throw error;
  }
};

// Toggle save recipe (add/remove from favorites)
export const toggleSaveRecipe = async (recipeId) => {
  try {
    const token = getCookie("token") || localStorage.getItem("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lưu công thức");
    }

    return data;
  } catch (error) {
    console.error("Toggle save recipe error:", error);
    throw error;
  }
};

// Check if recipe is saved by user
// ==================== ADMIN FUNCTIONS ====================

// Get pending recipes for moderation (Admin only)
export const getPendingRecipesAdmin = async (params = {}) => {
  try {
    const token = getCookie("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);

    const url = `${baseUrl}/api/recipes/admin/pending${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy danh sách recipes chờ duyệt");
    }

    return data;
  } catch (error) {
    console.error("Get pending recipes admin error:", error);
    throw error;
  }
};

// Approve recipe (Admin only)
export const approveRecipeAdmin = async (recipeId) => {
  try {
    const token = getCookie("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/recipes/admin/${recipeId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi duyệt recipe");
    }

    return data;
  } catch (error) {
    console.error("Approve recipe admin error:", error);
    throw error;
  }
};

// Reject recipe (Admin only)
export const rejectRecipeAdmin = async (recipeId, reason = "") => {
  try {
    const token = getCookie("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/recipes/admin/${recipeId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi từ chối recipe");
    }

    return data;
  } catch (error) {
    console.error("Reject recipe admin error:", error);
    throw error;
  }
};

// Get moderation statistics (Admin only)
export const getModerationStatsAdmin = async () => {
  try {
    const token = getCookie("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/recipes/admin/moderation/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thống kê moderation");
    }

    return data;
  } catch (error) {
    console.error("Get moderation stats admin error:", error);
    throw error;
  }
};

export const checkRecipeSaved = async (recipeId) => {
  try {
    const token = getCookie("token") || localStorage.getItem("token");
    if (!token) {
      return { data: { isSaved: false } };
    }

    const response = await fetch(`${baseUrl}/api/recipes/${recipeId}/is-saved`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi kiểm tra trạng thái lưu");
    }

    return data;
  } catch (error) {
    console.error("Check recipe saved error:", error);
    return { data: { isSaved: false } };
  }
};

