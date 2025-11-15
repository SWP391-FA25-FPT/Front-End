import { baseUrl } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Create feedback
export const createFeedback = async (feedbackData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi gửi feedback");
    }

    return data;
  } catch (error) {
    console.error("Create feedback error:", error);
    throw error;
  }
};

// Get all feedbacks (Admin only)
export const getAllFeedbacksAdmin = async (params = {}) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.type) queryParams.append("type", params.type);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const url = `${baseUrl}/api/feedback/admin/all${
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
      throw new Error(data.error || "Lỗi khi lấy danh sách feedback");
    }

    return data;
  } catch (error) {
    console.error("Get all feedbacks admin error:", error);
    throw error;
  }
};

// Reply to feedback (Admin only)
export const replyToFeedback = async (feedbackId, message) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(
      `${baseUrl}/api/feedback/admin/${feedbackId}/reply`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi phản hồi feedback");
    }

    return data;
  } catch (error) {
    console.error("Reply to feedback error:", error);
    throw error;
  }
};

// Update feedback status (Admin only)
export const updateFeedbackStatus = async (feedbackId, status) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(
      `${baseUrl}/api/feedback/admin/${feedbackId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật status feedback");
    }

    return data;
  } catch (error) {
    console.error("Update feedback status error:", error);
    throw error;
  }
};

// Get feedback statistics (Admin only)
export const getFeedbackStats = async () => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/feedback/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thống kê feedback");
    }

    return data;
  } catch (error) {
    console.error("Get feedback stats error:", error);
    throw error;
  }
};

