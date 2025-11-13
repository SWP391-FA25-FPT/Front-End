import apiHelper from '../utils/apiHelper';

const API_BASE = '/api/paypal';

export const createPayPalOrder = async (amount, planType, planDuration) => {
  return await apiHelper.post(`${API_BASE}/create-order`, { amount, planType, planDuration });
};

export const capturePayPalOrder = async (orderID, planType, planDuration, userId) => {
  return await apiHelper.post(`${API_BASE}/capture-order`, { orderID, planType, planDuration, userId });
};
