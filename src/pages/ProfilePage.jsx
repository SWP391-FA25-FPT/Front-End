import React, { useState, useEffect, useCallback } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import Layout from "../components/layout/SettingLayout";
import ProfileForm from "../components/User/ProfileForm"; 
import { getProfile, updateProfile } from "../apis/user";
import "./style/ProfilePage.css"; 
import { useAuth } from "../context/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);

      const targetId = userId || user?._id;

      if (!targetId) {
        setError("Không xác định được người dùng");
        return;
      }

      if (user && userId && user._id !== userId) {
        message.error("Bạn không có quyền chỉnh sửa hồ sơ này");
        navigate(`/user/${userId}`, { replace: true });
        return;
      }

      if (!userId && targetId) {
        navigate(`/user/${targetId}/edit`, { replace: true });
        return;
      }

      const response = await getProfile(targetId);
      if (response?.user) {
        setUserProfile(response.user);
      } else if (response) {
        setUserProfile(response);
      } else {
        setError("Failed to fetch profile");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  }, [navigate, user, userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await updateProfile(userId, updatedData);
      if (response?.user) {
        setUserProfile(response.user);
        return { success: true, message: "Profile updated successfully" };
      }
      if (response?.success) {
        await fetchUserProfile();
        return { success: true, message: "Profile updated successfully" };
      }
      return { success: false, message: "Failed to update profile" };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, message: "Failed to update profile" };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="profile-page-wrapper profile-loading-state">
          <div className="profile-loading-box">
            <div className="profile-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="profile-page-wrapper profile-error-state">
          <div className="profile-error-box">
            <div className="profile-error-emoji">⚠️</div>
            <h3 className="profile-error-title">Error Loading Profile</h3>
            <p className="profile-error-message">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="profile-retry-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page-wrapper">
        <ProfileForm 
          userProfile={userProfile} 
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </Layout>
  );
};

export default ProfilePage;