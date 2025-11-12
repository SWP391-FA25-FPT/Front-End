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

