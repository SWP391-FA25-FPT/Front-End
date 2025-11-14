import { baseUrl, apiUrls } from "../utils/constants";
import { getCookie } from "../utils/cookie";

// Get all challenges with filters
export const getAllChallenges = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.status && params.status !== "all")
      queryParams.append("status", params.status);
    if (params.category && params.category !== "all")
      queryParams.append("category", params.category);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const url = `${baseUrl}${apiUrls.getAllChallenges}${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy danh sách thử thách");
    }

    return data;
  } catch (error) {
    console.error("Get all challenges error:", error);
    throw error;
  }
};

// Get challenge by ID
export const getChallengeById = async (challengeId) => {
  try {
    const token = getCookie("token") || localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };

    // Include token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${baseUrl}${apiUrls.getChallengeById}/${challengeId}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thử thách");
    }

    return data;
  } catch (error) {
    console.error("Get challenge by ID error:", error);
    throw error;
  }
};

// Create new challenge (Admin only)
export const createChallenge = async (formData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(`${baseUrl}${apiUrls.createChallenge}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file upload
    });

    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      throw new Error(
        `Lỗi khi xử lý phản hồi từ server: ${response.status} ${response.statusText}`
      );
    }

    if (!response.ok) {
      const errorMessage =
        data.error ||
        data.message ||
        data.details ||
        `Lỗi ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Create challenge error:", error);
    throw error;
  }
};

// Update challenge (Admin only)
export const updateChallenge = async (challengeId, formData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(
      `${baseUrl}${apiUrls.updateChallenge}/${challengeId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData for file upload
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi cập nhật thử thách");
    }

    return data;
  } catch (error) {
    console.error("Update challenge error:", error);
    throw error;
  }
};

// Delete challenge (Admin only)
export const deleteChallenge = async (challengeId) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(
      `${baseUrl}${apiUrls.deleteChallenge}/${challengeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi xóa thử thách");
    }

    return data;
  } catch (error) {
    console.error("Delete challenge error:", error);
    throw error;
  }
};

// Join challenge
export const joinChallenge = async (challengeId) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập để tham gia thử thách");
    }

    const response = await fetch(
      `${baseUrl}${apiUrls.joinChallenge}/${challengeId}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi tham gia thử thách");
    }

    return data;
  } catch (error) {
    console.error("Join challenge error:", error);
    throw error;
  }
};

// Submit entry to challenge
export const submitEntry = async (challengeId, formData) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập để nộp bài");
    }

    const response = await fetch(
      `${baseUrl}${apiUrls.submitEntry}/${challengeId}/entries`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: formData, // FormData for file upload
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi nộp bài");
    }

    return data;
  } catch (error) {
    console.error("Submit entry error:", error);
    throw error;
  }
};

// Award prize to entry (Admin only)
export const awardPrize = async (challengeId, entryId) => {
  try {
    const token = getCookie("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(
      `${baseUrl}${apiUrls.submitEntry}/${challengeId}/award`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entryId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi trao giải");
    }

    return data;
  } catch (error) {
    console.error("Award prize error:", error);
    throw error;
  }
};

// Get challenge statistics
export const getChallengeStats = async () => {
  try {
    const url = `${baseUrl}${apiUrls.getChallengeStats}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi lấy thống kê thử thách");
    }

    return data;
  } catch (error) {
    console.error("Get challenge stats error:", error);
    throw error;
  }
};

// Like/Unlike an entry
export const likeEntry = async (challengeId, entryId) => {
  try {
    const token = getCookie("token") || localStorage.getItem("token");

    if (!token) {
      throw new Error("Vui lòng đăng nhập");
    }

    const response = await fetch(
      `${baseUrl}${apiUrls.likeEntry}/${challengeId}/entries/${entryId}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi khi like bài nộp");
    }

    return data;
  } catch (error) {
    console.error("Like entry error:", error);
    throw error;
  }
};

