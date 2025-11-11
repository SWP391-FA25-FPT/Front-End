import apiHelper from '../utils/apiHelper';
import { baseUrl } from '../utils/constants';

/**
 * Create a new goal
 */
export const createGoal = async (goalData) => {
  try {
    const response = await apiHelper.post(`${baseUrl}/api/goals`, goalData);
    return response;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

/**
 * Get all goals (optionally filter by status)
 */
export const getGoals = async (status = null) => {
  try {
    const params = status ? { status } : {};
    const response = await apiHelper.get(`${baseUrl}/api/goals`, params);
    return response;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

/**
 * Get active goal
 */
export const getActiveGoal = async () => {
  try {
    const response = await apiHelper.get(`${baseUrl}/api/goals/active`);
    return response;
  } catch (error) {
    console.error('Error fetching active goal:', error);
    throw error;
  }
};

/**
 * Get goal by ID
 */
export const getGoalById = async (goalId) => {
  try {
    const response = await apiHelper.get(`${baseUrl}/api/goals/${goalId}`);
    return response;
  } catch (error) {
    console.error('Error fetching goal:', error);
    throw error;
  }
};

/**
 * Update goal (update weight, status, etc.)
 */
export const updateGoal = async (goalId, updateData) => {
  try {
    const response = await apiHelper.put(`${baseUrl}/api/goals/${goalId}`, updateData);
    return response;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

/**
 * Complete goal
 */
export const completeGoal = async (goalId) => {
  try {
    const response = await apiHelper.put(`${baseUrl}/api/goals/${goalId}/complete`);
    return response;
  } catch (error) {
    console.error('Error completing goal:', error);
    throw error;
  }
};

/**
 * Cancel goal
 */
export const cancelGoal = async (goalId) => {
  try {
    const response = await apiHelper.delete(`${baseUrl}/api/goals/${goalId}`);
    return response;
  } catch (error) {
    console.error('Error cancelling goal:', error);
    throw error;
  }
};

/**
 * Update current weight for a goal
 */
export const updateGoalWeight = async (goalId, weight, note = '') => {
  try {
    const response = await apiHelper.put(`${baseUrl}/api/goals/${goalId}`, {
      currentWeight: weight,
      note
    });
    return response;
  } catch (error) {
    console.error('Error updating goal weight:', error);
    throw error;
  }
};


