import React, { useState, useEffect } from "react"; 
import Layout from "../components/layout/SettingLayout";
import ProfileForm from "../components/User/ProfileForm"; 
import { getProfile, updateProfile } from "../apis/user";
import { useTheme } from "../context/ThemeContext";
import "./style/ProfilePage.css"; 

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { themeMode } = useTheme(); // <--- BỔ SUNG

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        if (response) {
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
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await updateProfile(updatedData);
      if (response) {
        setUserProfile(response);
        return { success: true, message: "Profile updated successfully" };
      } else {
        return { success: false, message: "Failed to update profile" };
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, message: "Failed to update profile" };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div 
          className="profile-page-wrapper profile-loading-state"
          // BỔ SUNG: Đảm bảo nền loading đổi màu
          style={{ 
            backgroundColor: 'var(--color-bg-container)',
            color: 'var(--color-text-primary)',
          }} 
        >
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
        <div 
          className="profile-page-wrapper profile-error-state"
          // BỔ SUNG: Đảm bảo nền error đổi màu
          style={{ 
            backgroundColor: 'var(--color-bg-container)',
            color: 'var(--color-text-primary)',
          }} 
        >
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
      <div 
        className="profile-page-wrapper"
        // BỔ SUNG: Áp dụng màu nền/chữ cho wrapper chính của form
        style={{ 
          backgroundColor: 'var(--color-bg-container)', 
          color: 'var(--color-text-primary)', 
        }} 
      >
        <ProfileForm 
          userProfile={userProfile} 
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </Layout>
  );
};

export default ProfilePage;