import { baseUrl } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Create report
export const createReport = async (reportData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi gửi report");
    }

    return data;
  } catch (error) {
    console.error("Create report error:", error);
    throw error;
  }
};

// Get all reports (Admin only)
export const getAllReportsAdmin = async (params = {}) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.type) queryParams.append("type", params.type);
    if (params.severity) queryParams.append("severity", params.severity);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const url = `${baseUrl}/api/report/admin/all${
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
      throw new Error(data.error || "Lỗi khi lấy danh sách reports");
    }

    return data;
  } catch (error) {
    console.error("Get all reports admin error:", error);
    throw error;
  }
};

// Update report status (Admin only)
export const updateReportStatus = async (reportId, status, resolution) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(
      `${baseUrl}/api/report/admin/${reportId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, resolution }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật status report");
    }

    return data;
  } catch (error) {
    console.error("Update report status error:", error);
    throw error;
  }
};

// Get report statistics (Admin only)
export const getReportStats = async () => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/report/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thống kê reports");
    }

    return data;
  } catch (error) {
    console.error("Get report stats error:", error);
    throw error;
  }
};

