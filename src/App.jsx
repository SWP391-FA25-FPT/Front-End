import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
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
import AIConsultation from "./pages/AIConsultation";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/survey" 
            element={
              <ProtectedRoute>
                <TakeSurvey />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenge" 
            element={
              <ProtectedRoute>
                <Challenge />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenge/:id" 
            element={
              <ProtectedRoute>
                <ChallengeDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blog" 
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blog/:id" 
            element={
              <ProtectedRoute>
                <BlogDetail />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <MealPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-consultation" 
            element={
              <ProtectedRoute>
                <AIConsultation />
              </ProtectedRoute>
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
