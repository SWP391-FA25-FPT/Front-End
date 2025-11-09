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
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
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
import CreateRecipe from "./pages/CreateRecipe";

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
            path="/user"
            element={
              <SurveyCheckRoute>
                <Profile />
              </SurveyCheckRoute>
            }
          />
            <Route
            path="/create-recipe"
            element={
              <SurveyCheckRoute>
                <CreateRecipe />
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
            path="/blog/create"
            element={
              <ProtectedRoute>
                <BlogCreate />
              </ProtectedRoute>
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
            path="/top-meal-plans"
            element={
              <SurveyCheckRoute>
                <TopMealPlans />
              </SurveyCheckRoute>
            }
          />
          <Route
            path="/search"
            element={
              <SurveyCheckRoute>
                <SearchingPage />
              </SurveyCheckRoute>
            }
          />

          {/* Recipe routes */}
          <Route
            path="/recipe/:id"
            element={
              <SurveyCheckRoute>
                <RecipeDetail />
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

          {/* My Recipes routes */}
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

          {/* Subscription route */}
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
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
