import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

/**
 * Send message to AI via Backend API
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Previous conversation (optional)
 * @param {string=} conversationId - Existing conversation id (optional)
 * @returns {Promise<{message: string, timestamp: string, conversationId?: string}>} AI response payload
 */
export async function sendMessageToAI(userMessage, conversationHistory = [], conversationId) {
  try {
    const response = await apiHelper.post(apiUrls.aiChat, {
      message: userMessage,
      conversationHistory: conversationHistory,
      conversationId,
    });

    if (response.success) {
      return response.data;
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

/**
 * Get list of conversations for current user
 * @returns {Promise<Array>} Array of conversations
 */
export async function getConversations() {
  try {
    const response = await apiHelper.get(apiUrls.aiConversations);
    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.error || "Lỗi khi lấy danh sách hội thoại");
    }
  } catch (error) {
    console.error("Error getting conversations:", error);
    throw new Error(error.message || "Không thể tải danh sách hội thoại");
  }
}

/**
 * Get messages for a specific conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Array>} Array of messages
 */
export async function getConversationHistory(conversationId) {
  try {
    const response = await apiHelper.get(`${apiUrls.aiConversationHistory}/${conversationId}`);
    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.error || "Lỗi khi lấy lịch sử hội thoại");
    }
  } catch (error) {
    console.error("Error getting conversation history:", error);
    throw new Error(error.message || "Không thể tải lịch sử hội thoại");
  }
}

export default {
  sendMessageToAI,
  getAvailableModels,
  checkAIHealth,
  getConversations,
  getConversationHistory,
};
