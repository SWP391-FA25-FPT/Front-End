import { baseUrl, apiUrls } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Get all blogs with filters
export const getAllBlogs = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.tags) queryParams.append("tags", params.tags);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);

    const url = `${baseUrl}${apiUrls.getAllBlogs}${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    console.log("Fetching from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON, content-type:", contentType);
      const text = await response.text();
      console.error("Response body:", text.substring(0, 200));
      throw new Error(`Server returned non-JSON response: ${contentType}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy danh sách blog");
    }

    return data;
  } catch (error) {
    console.error("Get all blogs error:", error);
    throw error;
  }
};

// Get single blog by ID or slug
export const getBlogById = async (blogId) => {
  try {
    const token = getCookie("token") || localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };

    // Include token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${baseUrl}${apiUrls.getBlogById}/${blogId}`;
    console.log("Fetching blog from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log("Response status:", response.status);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON, content-type:", contentType);
      const text = await response.text();
      console.error("Response body:", text.substring(0, 200));
      throw new Error(`Server returned non-JSON response: ${contentType}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy blog");
    }

    return data;
  } catch (error) {
    console.error("Get blog by ID error:", error);
    throw error;
  }
};

// Create new blog (requires authentication)
export const createBlog = async (formData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập để tạo blog");
    }

    const response = await fetch(`${baseUrl}${apiUrls.createBlog}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file upload
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Lỗi khi tạo blog");
    }

    return data;
  } catch (error) {
    console.error("Create blog error:", error);
    throw error;
  }
};

// Update blog (requires authentication)
export const updateBlog = async (blogId, formData) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}${apiUrls.updateBlog}/${blogId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file upload
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật blog");
    }

    return data;
  } catch (error) {
    console.error("Update blog error:", error);
    throw error;
  }
};

// Delete blog (requires authentication)
export const deleteBlog = async (blogId) => {
  try {
    const token = getCookie("token");

    const response = await fetch(`${baseUrl}${apiUrls.deleteBlog}/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi xóa blog");
    }

    return data;
  } catch (error) {
    console.error("Delete blog error:", error);
    throw error;
  }
};

// Search blogs with filters
export const searchBlogs = async (keyword, params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (keyword) queryParams.append("q", keyword);
    if (params.category) queryParams.append("category", params.category);
    if (params.tags) queryParams.append("tags", params.tags);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);

    const url = `${baseUrl}${apiUrls.searchBlogs}${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi tìm kiếm blog");
    }

    return data;
  } catch (error) {
    console.error("Search blogs error:", error);
    throw error;
  }
};

// Like/Unlike blog
export const toggleBlogLike = async (blogId) => {
  try {
    const token = getCookie("token") || localStorage.getItem("token");
    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/blogs/${blogId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi like blog");
    }

    return data;
  } catch (error) {
    console.error("Toggle blog like error:", error);
    throw error;
  }
};

// Add comment to blog
export const addBlogComment = async (blogId, commentData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/blogs/${blogId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi thêm bình luận");
    }

    return data;
  } catch (error) {
    console.error("Add blog comment error:", error);
    throw error;
  }
};

// Get user's blogs
export const getMyBlogs = async (params = {}) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.published !== undefined)
      queryParams.append("published", params.published);

    const url = `${baseUrl}${apiUrls.getMyBlogs}${
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
      throw new Error(data.error || "Lỗi khi lấy blog");
    }

    return data;
  } catch (error) {
    console.error("Get my blogs error:", error);
    throw error;
  }
};

// Get top blogs by views
export const getTopBlogsByViews = async (limit = 1) => {
  try {
    const url = `${baseUrl}${apiUrls.getTopBlogsByViews}?limit=${limit}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy top blogs");
    }

    return data;
  } catch (error) {
    console.error("Get top blogs by views error:", error);
    throw error;
  }
};
