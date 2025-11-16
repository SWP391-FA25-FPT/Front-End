/**
 * Check if user has active subscription (basic or premium)
 * Both basic and premium plans have access to premium features
 * @param {Object} user - User object from AuthContext
 * @returns {boolean} - True if user has active subscription (basic or premium)
 */
export const isPremium = (user) => {
  if (!user || !user.subscription) {
    return false;
  }
  
  const status = user.subscription.status;
  
  // Both basic and premium plans have access to premium features
  // Status can be: 'sub', 'active', 'premium', 'basic' (all mean user has paid subscription)
  // Only 'free' means no subscription
  return status && status !== 'free';
};

/**
 * Get subscription status message
 * @param {Object} user - User object from AuthContext
 * @returns {string} - Status message
 */
export const getSubscriptionStatus = (user) => {
  if (!user || !user.subscription) {
    return 'free';
  }
  return user.subscription.status || 'free';
};

