export const baseUrl = "http://localhost:5000";
// export const baseUrl = "https://toan215-Meta-Meal.hf.space";

export const apiUrls = {
  // Auth endpoints
  login: "/api/auth/login",
  register: "/api/auth/register",
  getMe: "/api/auth/me",
  
  // User endpoints
  getProfile: "/api/user/profile",
  updateProfile: "/api/user/profile",
  completeOnboarding: "/api/user/complete-onboarding",
  
  // Recipe endpoints
  getAllRecipes: "/api/recipes",
  getRecipeById: "/api/recipes",
  createRecipe: "/api/recipes",
  updateRecipe: "/api/recipes",
  deleteRecipe: "/api/recipes",
  searchRecipes: "/api/recipes/search",
  
  // Comment endpoints
  getCommentsByRecipeId: "/api/recipes/:recipeId/comments",
  createComment: "/api/recipes/:recipeId/comments",
  deleteComment: "/api/comments/:id",
  
  // Rating endpoints
  getRatingsByRecipeId: "/api/recipes/:recipeId/ratings",
  createOrUpdateRating: "/api/recipes/:recipeId/ratings",
  deleteUserRating: "/api/recipes/:recipeId/ratings",
  deleteRating: "/api/ratings/:id",
  
  // Analytics endpoints
  trackSearch: "/api/analytics/search",
  getTrendingTags: "/api/analytics/trending-tags",
  getSearchStats: "/api/analytics/search-stats",
  
  // User History endpoints
  addViewHistory: "/api/user/history/view",
  getRecentViewed: "/api/user/history/recent",
  clearViewHistory: "/api/user/history/clear",
  getHistoryStats: "/api/user/history/stats",
  
  // Subscription endpoints
  subscriptionPlans: "/api/subscriptions/plans",
  createSubscription: "/api/subscriptions/create",
  confirmPayment: "/api/subscriptions/confirm-payment",
  mySubscription: "/api/subscriptions/my-subscription",
  cancelSubscription: "/api/subscriptions/cancel/:subscriptionId",
  subscriptionHistory: "/api/subscriptions/history",
  transactionHistory: "/api/subscriptions/transactions",
  
  // AI endpoints
  aiChat: "/api/ai/chat",
  aiModels: "/api/ai/models",
  aiHealth: "/api/ai/health",
};