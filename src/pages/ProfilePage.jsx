import React, { useState, useEffect } from "react";
import Layout from "../components/layout/SettingLayout";
import ProfileForm from "../components/User/ProfileForm"; 
import { userAPI } from "../../services/userAPI";
import "./style/ProfilePage.css"; 

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        if (response.success) {
          setUserProfile(response.data);
        } else {
          setError(response.error || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await userAPI.updateProfile(updatedData);
      if (response.success) {
        setUserProfile(response.data);
        return { success: true, message: 'Profile updated successfully' };
      } else {
        return { success: false, message: response.error || 'Failed to update profile' };
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      return { success: false, message: 'Failed to update profile' };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            backgroundColor: "#f8f9fa",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #fbbf24',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#6b7280' }}>Loading profile...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            backgroundColor: "#f8f9fa",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <div style={{ 
            background: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Error Loading Profile</h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1rem',
                background: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
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
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
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
