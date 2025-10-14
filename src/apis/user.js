import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

export async function getProfile() {
  const response = await apiHelper.get(apiUrls.getProfile);
  return response.data;
}

export async function updateProfile(data) {
  const response = await apiHelper.put(apiUrls.updateProfile, data);
  return response.data;
}

export async function completeOnboarding() {
  const response = await apiHelper.post(apiUrls.completeOnboarding);
  return response;
}