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
    const response = await fetch(`${baseUrl}${apiUrls.getRecipeById}/${recipeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
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

    const response = await fetch(`${baseUrl}${apiUrls.createRecipe}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file upload
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi tạo recipe");
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

