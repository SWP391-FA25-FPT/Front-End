import apiHelper from '../utils/apiHelper';
import { baseUrl } from '../utils/constants';

/**
 * Add progress record for a day
 */
export const addProgressRecord = async (progressData) => {
  try {
    const response = await apiHelper.post(`${baseUrl}/api/progress`, progressData);
    return response;
  } catch (error) {
    console.error('Error adding progress record:', error);
    throw error;
  }
};

/**
 * Get progress history (optionally filter by date range and goal)
 */
export const getProgressHistory = async ({ startDate = null, endDate = null, goalId = null, limit = 30 } = {}) => {
  try {
    const params = { limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (goalId) params.goalId = goalId;
    
    const response = await apiHelper.get(`${baseUrl}/api/progress`, params);
    return response;
  } catch (error) {
    console.error('Error fetching progress history:', error);
    throw error;
  }
};

/**
 * Get progress statistics
 */
export const getProgressStats = async ({ startDate = null, endDate = null, goalId = null } = {}) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (goalId) params.goalId = goalId;
    
    const response = await apiHelper.get(`${baseUrl}/api/progress/stats`, params);
    return response;
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    throw error;
  }
};

/**
 * Get today's progress record
 */
export const getTodayProgress = async () => {
  try {
    const response = await apiHelper.get(`${baseUrl}/api/progress/today`);
    return response;
  } catch (error) {
    console.error('Error fetching today\'s progress:', error);
    throw error;
  }
};

/**
 * Update progress record
 */
export const updateProgressRecord = async (recordId, updateData) => {
  try {
    const response = await apiHelper.put(`${baseUrl}/api/progress/${recordId}`, updateData);
    return response;
  } catch (error) {
    console.error('Error updating progress record:', error);
    throw error;
  }
};

/**
 * Delete progress record
 */
export const deleteProgressRecord = async (recordId) => {
  try {
    const response = await apiHelper.delete(`${baseUrl}/api/progress/${recordId}`);
    return response;
  } catch (error) {
    console.error('Error deleting progress record:', error);
    throw error;
  }
};



