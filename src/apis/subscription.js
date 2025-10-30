import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

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


