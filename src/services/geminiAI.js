import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

/**
 * Send message to AI via Backend API
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Previous conversation (optional)
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToAI(userMessage, conversationHistory = []) {
  try {
    const response = await apiHelper.post(apiUrls.aiChat, {
      message: userMessage,
      conversationHistory: conversationHistory,
    });

    if (response.success) {
      return response.data.message;
    } else {
      throw new Error(response.error || "Lỗi khi gọi AI");
    }
  } catch (error) {
    console.error("Error calling AI:", error);
    throw new Error(error.message || "Không thể kết nối với AI. Vui lòng thử lại sau.");
  }
}

/**
 * Get available AI models (for debugging)
 */
export async function getAvailableModels() {
  try {
    const response = await apiHelper.get(apiUrls.aiModels);
    return response;
  } catch (error) {
    console.error("Error getting models:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Check AI service health
 */
export async function checkAIHealth() {
  try {
    const response = await apiHelper.get(apiUrls.aiHealth);
    return response;
  } catch (error) {
    console.error("Error checking AI health:", error);
    return { success: false, error: error.message };
  }
}

export default {
  sendMessageToAI,
  getAvailableModels,
  checkAIHealth,
};
