import { baseUrl } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Get system statistics (Admin only)
export const getSystemStats = async () => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thống kê hệ thống");
    }

    return data;
  } catch (error) {
    console.error("Get system stats error:", error);
    throw error;
  }
};

// Get system settings (Admin only)
export const getSystemSettings = async () => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/admin/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy cài đặt hệ thống");
    }

    return data;
  } catch (error) {
    console.error("Get system settings error:", error);
    throw error;
  }
};

// Update system settings (Admin only)
export const updateSystemSettings = async (settingsData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/admin/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settingsData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật cài đặt hệ thống");
    }

    return data;
  } catch (error) {
    console.error("Update system settings error:", error);
    throw error;
  }
};

