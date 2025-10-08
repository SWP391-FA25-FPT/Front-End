import api from './api.js';

// User Profile API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  completeOnboarding: async () => {
    const response = await api.post('/user/complete-onboarding');
    return response.data;
  },
};

export default userAPI;
