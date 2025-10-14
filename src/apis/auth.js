import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";

export async function loginApi(data) {
  // Remove current token
  removeCookie("token");
  // Send login request
  const response = await apiHelper.post(apiUrls.login, data);
  // Handle response
  if (response.success && response?.data?.token) {
    // Set cookies
    setCookie("token", response.data.token);
    // Set token to apiHelper
    apiHelper.addToken(response.data.token);
  }
  return response;
}

export async function registerApi({ username, email, password, onFail, onSuccess }) {
  // Remove current token
  removeCookie("token");
  // Send register request
  const response = await apiHelper.post(apiUrls.register, {
    username,
    email,
    password,
  });
  // Handle response
  if (response.success) {
    console.log(response.message);
    if (response?.data?.token) {
      // Set cookies
      setCookie("token", response.data.token);
      // Set token to apiHelper
      apiHelper.addToken(response.data.token);
      // Call onSuccess callback
      onSuccess();
    } else {
      // Call onFail callback
      onFail("No token received");
    }
  } else {
    // Call onFail callback
    onFail(response.error);
  }
}

export async function getMeApi({ user, onFail, onSuccess }) {
  if (user) {
    onSuccess(user);
    return;
  }
  // Get token from cookie storage
  const token = getCookie("token");
  // If no token found, call onFail callback
  if (!token) {
    onFail("No login token found");
    return;
  }
  // Send getMe request
  const response = await apiHelper.get(apiUrls.getMe);
  // Handle response
  if (response.success) {
    console.log("User data retrieved");
    onSuccess(response.data);
  } else {
    onFail(response.error);
  }
}

export async function logoutApi({ onFail, onSuccess }) {
  // Remove token from cookie storage
  removeCookie("token");
  // Send logout request
  const response = await apiHelper.post(apiUrls.logout);
  // Handle response
  if (response.success) {
    console.log("Logout successful");
    onSuccess();
    window.location.reload();
  } else {
    onFail(response.error);
  }
}
