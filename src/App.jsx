import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SurveyCheckRoute from "./components/auth/SurveyCheckRoute";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TakeSurvey from "./pages/TakeSurvey";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
import Challenge from "./pages/Challenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AdminPage from "./pages/admin/AdminPage";
import MealPlan from "./pages/MealPlan";
import { useAuth } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Survey route - only for first time users */}
          <Route 
            path="/survey" 
            element={
              <ProtectedRoute>
                <TakeSurvey />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes that require survey completion */}
          <Route 
            path="/" 
            element={
              <SurveyCheckRoute>
                <HomePage />
              </SurveyCheckRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <SurveyCheckRoute>
                <ProfilePage />
              </SurveyCheckRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <SurveyCheckRoute>
                <SupportPage />
              </SurveyCheckRoute>
            } 
          />
          <Route 
            path="/challenge" 
            element={
              <SurveyCheckRoute>
                <Challenge />
              </SurveyCheckRoute>
            } 
          />
          <Route 
            path="/challenge/:id" 
            element={
              <SurveyCheckRoute>
                <ChallengeDetail />
              </SurveyCheckRoute>
            } 
          />
          <Route 
            path="/blog" 
            element={
              <SurveyCheckRoute>
                <Blog />
              </SurveyCheckRoute>
            } 
          />
          <Route 
            path="/blog/:id" 
            element={
              <SurveyCheckRoute>
                <BlogDetail />
              </SurveyCheckRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/meal-plan" 
            element={
              <SurveyCheckRoute>
                <MealPlan />
              </SurveyCheckRoute>
            } 
          />
           
          {/* Redirect to home if route not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
