import apiHelper from "../utils/apiHelper";
import { apiUrls, baseUrl } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Lấy danh sách gói subscription
export const getSubscriptionPlans = async () => {
  try {
    const response = await apiHelper.get(apiUrls.subscriptionPlans);
    return response;
  } catch (error) {
    console.error("Get subscription plans error:", error);
    return { success: false, error: error.message };
  }
};

// Tạo subscription mới
export const createSubscription = async (data) => {
  try {
    const response = await apiHelper.post(apiUrls.createSubscription, data);
    return response;
  } catch (error) {
    console.error("Create subscription error:", error);
    return { success: false, error: error.message };
  }
};

// Xác nhận thanh toán
export const confirmPayment = async (data) => {
  try {
    const response = await apiHelper.post(apiUrls.confirmPayment, data);
    return response;
  } catch (error) {
    console.error("Confirm payment error:", error);
    return { success: false, error: error.message };
  }
};

// Lấy subscription hiện tại
export const getMySubscription = async () => {
  try {
    const response = await apiHelper.get(apiUrls.mySubscription);
    return response;
  } catch (error) {
    console.error("Get my subscription error:", error);
    return { success: false, error: error.message };
  }
};

// Hủy subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await apiHelper.put(
      apiUrls.cancelSubscription.replace(":subscriptionId", subscriptionId)
    );
    return response;
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return { success: false, error: error.message };
  }
};

// Lấy lịch sử subscription
export const getSubscriptionHistory = async () => {
  try {
    const response = await apiHelper.get(apiUrls.subscriptionHistory);
    return response;
  } catch (error) {
    console.error("Get subscription history error:", error);
    return { success: false, error: error.message };
  }
};

// Lấy lịch sử giao dịch
export const getTransactionHistory = async () => {
  try {
    const response = await apiHelper.get(apiUrls.transactionHistory);
    return response;
  } catch (error) {
    console.error("Get transaction history error:", error);
    return { success: false, error: error.message };
  }
};

// ============ ADMIN FUNCTIONS ============

// Get all subscriptions (Admin only)
export const getAllSubscriptionsAdmin = async (params = {}) => {
  try {
    const token = getCookie("token") || localStorage.getItem("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.planType) queryParams.append("planType", params.planType);

    const url = `${baseUrl}/api/subscriptions/all${
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
      throw new Error(data.error || "Lỗi khi lấy danh sách subscriptions");
    }

    return data;
  } catch (error) {
    console.error("Get all subscriptions admin error:", error);
    throw error;
  }
};

// Check expired subscriptions (Admin only)
export const checkExpiredSubscriptions = async () => {
  try {
    const token = getCookie("token") || localStorage.getItem("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}/api/subscriptions/check-expired`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi kiểm tra subscriptions hết hạn");
    }

    return data;
  } catch (error) {
    console.error("Check expired subscriptions error:", error);
    throw error;
  }
};
