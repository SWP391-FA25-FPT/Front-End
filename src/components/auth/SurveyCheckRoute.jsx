import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const SurveyCheckRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Đang tải...
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated() && user?.isFirstLogin) {
    if (window.location.pathname !== "/survey") {
      return <Navigate to="/survey" replace />;
    }
  }

  return children;
};

export default SurveyCheckRoute;