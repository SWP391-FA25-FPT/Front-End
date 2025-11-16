import { baseUrl, apiUrls } from "../utils/constants";
import { getCookie } from "../utils/cookie";

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.unreadOnly) query.append("unreadOnly", "true");

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

const getAuthHeaders = () => {
  const token = getCookie("token");

  if (!token) {
    throw new Error("Vui lòng đăng nhập để xem thông báo");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getNotifications = async (params = {}) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(
      `${baseUrl}${apiUrls.notifications}${buildQueryString(params)}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi tải thông báo");
    }

    return data;
  } catch (error) {
    console.error("Get notifications error:", error);
    throw error;
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(
      `${baseUrl}${apiUrls.notifications}/${notificationId}/read`,
      {
        method: "PATCH",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật thông báo");
    }

    return data;
  } catch (error) {
    console.error("Mark notification read error:", error);
    throw error;
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${baseUrl}${apiUrls.notificationsMarkAll}`, {
      method: "PATCH",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật thông báo");
    }

    return data;
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    throw error;
  }
};


