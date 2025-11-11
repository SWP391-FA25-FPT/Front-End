import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import SupportPage from "./pages/SupportPage"; // Trang support chính
import SettingsPage from "./pages/SettingsPage";

import GettingStarted from "./pages/support/GettingStarted";
import NutritionTracking from "./pages/support/NutritionTracking";
import MealPlanner from "./pages/support/MealPlanner";
import AccountBilling from "./pages/support/AccountBilling";
import ChallengesCommunity from "./pages/support/ChallengesCommunity";
import PrivacySecurity from "./pages/support/PrivacySecurity";

import Challenge from "./pages/Challenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import BlogCreate from "./pages/BlogCreate";
import AdminPage from "./pages/admin/AdminPage";
import MealPlan from "./pages/MealPlan";
import AIConsultation from "./pages/AIConsultation";
import NutritionalAnalysis from "./pages/NutritionalAnalysis";
import ProgressTracking from "./pages/ProgressTracking";
import TopMealPlans from "./pages/TopMealPlans";
import SearchingPage from "./pages/SearchingPage";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeCreate from "./pages/RecipeCreate";
import RecipeUpdate from "./pages/RecipeUpdate";
import MyRecipes from "./pages/MyRecipes";
import AllRecipes from "./pages/AllRecipes";
import DraftRecipes from "./pages/DraftRecipes";
import PrivateRecipes from "./pages/PrivateRecipes";
import PublishedRecipes from "./pages/PublishedRecipes";
import SavedRecipes from "./pages/SavedRecipes";
import Subscription from "./pages/Subscription";
import NotificationPage from "./pages/NotificationPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/support/getting-started" element={<GettingStarted />} />
          <Route
            path="/support/nutrition-tracking"
            element={<NutritionTracking />}
          />
          <Route path="/support/meal-planner" element={<MealPlanner />} />
          <Route path="/support/account-billing" element={<AccountBilling />} />
          <Route
            path="/support/challenges-community"
            element={<ChallengesCommunity />}
          />
          <Route
            path="/support/privacy-security"
            element={<PrivacySecurity />}
          />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/challenge/:id" element={<ChallengeDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/top-meal-plans" element={<TopMealPlans />} />
          <Route path="/search" element={<SearchingPage />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
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
              <SurveyCheckRoute>
                <ProfilePage />
              </SurveyCheckRoute>
            }
          />
          <Route
            path="/blog/create"
            element={
              <ProtectedRoute>
                <BlogCreate />
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
              <SurveyCheckRoute>
                <MealPlan />
              </SurveyCheckRoute>
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
          <Route
            path="/nutritional-analysis"
            element={
              <ProtectedRoute>
                <NutritionalAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress-tracking"
            element={
              <SurveyCheckRoute>
                <ProgressTracking />
              </SurveyCheckRoute>
            }
          />
          <Route
            path="/recipe/create"
            element={
              <ProtectedRoute>
                <RecipeCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipe/create/:draftId"
            element={
              <ProtectedRoute>
                <RecipeCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipe/:id/edit"
            element={
              <ProtectedRoute>
                <RecipeUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-recipes"
            element={
              <ProtectedRoute>
                <MyRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-recipes/all"
            element={
              <ProtectedRoute>
                <AllRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-recipes/drafts"
            element={
              <ProtectedRoute>
                <DraftRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-recipes/private"
            element={
              <ProtectedRoute>
                <PrivateRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-recipes/published"
            element={
              <ProtectedRoute>
                <PublishedRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-recipes/saved"
            element={
              <ProtectedRoute>
                <SavedRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <SurveyCheckRoute>
                <NotificationPage />
              </SurveyCheckRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <SurveyCheckRoute>
                <SettingsPage />
              </SurveyCheckRoute>
            }
          />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;