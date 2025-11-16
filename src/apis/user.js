import apiHelper from "../utils/apiHelper";
import { apiUrls, baseUrl } from "../utils/constants";
import { getCookie } from "../utils/cookie";

const extractSuccessData = (response) => {
  if (response?.success) {
    return response.data;
  }
  if (response?.data?.success) {
    return response.data.data;
  }
  if (response?.data) {
    return response.data;
  }
  return null;
};

const extractErrorMessage = (response) =>
  response?.error || response?.detail || "Đã xảy ra lỗi";

export async function getProfile(userId) {
  const endpoint = userId
    ? `${apiUrls.getProfile}/${userId}`
    : apiUrls.getProfile;
  const response = await apiHelper.get(endpoint);
  const data = extractSuccessData(response);

  if (data) {
    return data;
  }

  throw new Error(extractErrorMessage(response));
}

export async function updateProfile(userId, data) {
  const endpoint = userId
    ? `${apiUrls.updateProfile}/${userId}`
    : apiUrls.updateProfile;

  let response;
  if (data instanceof FormData) {
    response = await apiHelper.putFormData(endpoint, data);
  } else {
    response = await apiHelper.put(endpoint, data);
  }

  const payload = extractSuccessData(response);
  if (payload) {
    return payload;
  }

  throw new Error(extractErrorMessage(response));
}

export async function completeOnboarding() {
  const response = await apiHelper.post(apiUrls.completeOnboarding);
  return response;
}

// ============ ADMIN FUNCTIONS ============

// Get all users (Admin only)
export const getAllUsersAdmin = async (params = {}) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);
    if (params.banned !== undefined) queryParams.append("banned", params.banned);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const url = `${baseUrl}/api/user/admin/all${
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
      throw new Error(data.error || "Lỗi khi lấy danh sách users");
    }

    return data;
  } catch (error) {
    console.error("Get all users admin error:", error);
    throw error;
  }
};

// Get user by ID (Admin only)
export const getUserByIdAdmin = async (userId) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/user/admin/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy user");
    }

    return data;
  } catch (error) {
    console.error("Get user by ID admin error:", error);
    throw error;
  }
};

// Update user (Admin only)
export const updateUserAdmin = async (userId, userData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/user/admin/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật user");
    }

    return data;
  } catch (error) {
    console.error("Update user admin error:", error);
    throw error;
  }
};

// Ban user (Admin only)
export const banUserAdmin = async (userId, reason) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/user/admin/${userId}/ban`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason: reason || "Vi phạm quy tắc cộng đồng" }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi ban user");
    }

    return data;
  } catch (error) {
    console.error("Ban user admin error:", error);
    throw error;
  }
};

// Unban user (Admin only)
export const unbanUserAdmin = async (userId) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/user/admin/${userId}/unban`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi unban user");
    }

    return data;
  } catch (error) {
    console.error("Unban user admin error:", error);
    throw error;
  }
};

// Get user statistics (Admin only)
export const getUserStatsAdmin = async () => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/user/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thống kê users");
    }

    return data;
  } catch (error) {
    console.error("Get user stats admin error:", error);
    throw error;
  }
};