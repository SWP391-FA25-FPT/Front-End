import apiHelper from '../utils/apiHelper';
import { baseUrl } from '../utils/constants';

/**
 * Get meal plans by date or date range
 * @param {Object} params - Query parameters
 * @param {string} params.date - Single date (YYYY-MM-DD)
 * @param {string} params.startDate - Start date for range (YYYY-MM-DD)
 * @param {string} params.endDate - End date for range (YYYY-MM-DD)
 * @returns {Promise<Object>} - Meal plans data
 */
export const getMealPlans = async (params = {}) => {
  try {
    const response = await apiHelper.get(`${baseUrl}/api/mealplans`, params);
    return response;
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
};

/**
 * Generate a meal plan for a specific date
 * @param {string} date - Date for meal plan (YYYY-MM-DD)
 * @returns {Promise<Object>} - Generated meal plan
 */
export const generateMealPlan = async (date, useGoalCalories = false, goalId = null) => {
  try {
    const response = await apiHelper.post(`${baseUrl}/api/mealplans/generate`, { date, useGoalCalories, goalId });
    return response;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

/**
 * Regenerate an existing meal plan for a specific date
 * @param {string} date - Date for meal plan (YYYY-MM-DD)
 * @returns {Promise<Object>} - Regenerated meal plan
 */
export const regenerateMealPlan = async (date, useGoalCalories = false, goalId = null) => {
  try {
    const response = await apiHelper.post(`${baseUrl}/api/mealplans/regenerate`, { date, useGoalCalories, goalId });
    return response;
  } catch (error) {
    console.error('Error regenerating meal plan:', error);
    throw error;
  }
};

/**
 * Generate a weekly meal plan (7 days)
 * @param {string} startDate - Start date for weekly plan (YYYY-MM-DD)
 * @returns {Promise<Object>} - Weekly meal plans
 */
export const generateWeeklyMealPlan = async (startDate) => {
  try {
    const response = await apiHelper.post(`${baseUrl}/api/mealplans/weekly`, { startDate });
    return response;
  } catch (error) {
    console.error('Error generating weekly meal plan:', error);
    throw error;
  }
};

/**
 * Delete a meal plan
 * @param {string} mealPlanId - ID of the meal plan to delete
 * @returns {Promise<Object>} - Success message
 */
export const deleteMealPlan = async (mealPlanId) => {
  try {
    const response = await apiHelper.delete(`${baseUrl}/api/mealplans/${mealPlanId}`);
    return response;
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    throw error;
  }
};

/**
 * Update a specific meal in a meal plan
 * @param {string} mealPlanId - ID of the meal plan
 * @param {number} mealIndex - Index of the meal to update
 * @param {string} recipeId - ID of the new recipe
 * @returns {Promise<Object>} - Updated meal plan
 */
export const updateMealInPlan = async (mealPlanId, mealIndex, recipeId) => {
  try {
    const response = await apiHelper.put(`${baseUrl}/api/mealplans/${mealPlanId}/meals/${mealIndex}`, { recipeId });
    return response;
  } catch (error) {
    console.error('Error updating meal in plan:', error);
    throw error;
  }
};

/**
 * Get today's meal plan
 * @returns {Promise<Object>} - Today's meal plan
 */
export const getTodayMealPlan = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    return await getMealPlans({ date: today });
  } catch (error) {
    console.error('Error fetching today\'s meal plan:', error);
    throw error;
  }
};

/**
 * Get this week's meal plans
 * @returns {Promise<Object>} - This week's meal plans
 */
export const getWeekMealPlans = async () => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
    
    return await getMealPlans({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error fetching week meal plans:', error);
    throw error;
  }
};

/**
 * Delete all user meal plans (used when canceling goal)
 * @param {Object} params - Optional query parameters
 * @param {string} params.startDate - Start date to filter deletion (YYYY-MM-DD)
 * @param {string} params.endDate - End date to filter deletion (YYYY-MM-DD)
 * @returns {Promise<Object>} - Success message with deleted count
 */
export const deleteAllUserMealPlans = async (params = {}) => {
  try {
    const response = await apiHelper.delete(`${baseUrl}/api/mealplans/user/all`, params);
    return response;
  } catch (error) {
    console.error('Error deleting all user meal plans:', error);
    throw error;
  }
};

