import { baseUrl, apiUrls } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Track search keyword (public)
export const trackSearch = async (keyword) => {
  try {
    const response = await fetch(`${baseUrl}${apiUrls.trackSearch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lưu thông tin tìm kiếm");
    }

    return data;
  } catch (error) {
    console.error("Track search error:", error);
    // Don't throw error for tracking - fail silently
    return null;
  }
};

// Get trending tags (public)
export const getTrendingTags = async (limit = 8) => {
  try {
    const response = await fetch(`${baseUrl}${apiUrls.getTrendingTags}?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy trending tags");
    }

    return data;
  } catch (error) {
    console.error("Get trending tags error:", error);
    throw error;
  }
};

// Get search statistics (public)
export const getSearchStats = async () => {
  try {
    const response = await fetch(`${baseUrl}${apiUrls.getSearchStats}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thống kê tìm kiếm");
    }

    return data;
  } catch (error) {
    console.error("Get search stats error:", error);
    throw error;
  }
};

// Add recipe to view history (requires authentication)
export const addViewHistory = async (recipeId, device = 'desktop') => {
  try {
    const token = getCookie("token");
    
    if (!token) {
      // User not logged in, don't track
      return null;
    }

    const response = await fetch(`${baseUrl}${apiUrls.addViewHistory}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipeId, device }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lưu lịch sử xem");
    }

    return data;
  } catch (error) {
    console.error("Add view history error:", error);
    // Don't throw error for tracking - fail silently
    return null;
  }
};

// Get recently viewed recipes (requires authentication)
export const getRecentlyViewed = async (limit = 20) => {
  try {
    const token = getCookie("token");
    
    if (!token) {
      return { success: false, data: [] };
    }

    const response = await fetch(`${baseUrl}${apiUrls.getRecentViewed}?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy lịch sử xem");
    }

    return data;
  } catch (error) {
    console.error("Get recently viewed error:", error);
    return { success: false, data: [] };
  }
};

// Clear view history (requires authentication)
export const clearViewHistory = async () => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}${apiUrls.clearViewHistory}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi xóa lịch sử xem");
    }

    return data;
  } catch (error) {
    console.error("Clear view history error:", error);
    throw error;
  }
};

// Get history statistics (requires authentication)
export const getHistoryStats = async () => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}${apiUrls.getHistoryStats}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thống kê lịch sử");
    }

    return data;
  } catch (error) {
    console.error("Get history stats error:", error);
    throw error;
  }
};

