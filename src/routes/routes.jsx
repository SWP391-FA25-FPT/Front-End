import React from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import SurveyCheckRoute from "../components/auth/SurveyCheckRoute";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";
import { Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import AdminLogin from "../pages/AdminLogin";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import OTPVerification from "../pages/OTPVerification";
import TakeSurvey from "../pages/TakeSurvey";
import ProfilePage from "../pages/ProfilePage";
import SupportPage from "../pages/SupportPage";
import SettingsPage from "../pages/SettingsPage";
import PinAndRecoveryPage from "../pages/PinAndRecoveryPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import Profile from "../pages/Profile";

import GettingStarted from "../pages/support/GettingStarted";
import NutritionTracking from "../pages/support/NutritionTracking";
import MealPlanner from "../pages/support/MealPlanner";
import AccountBilling from "../pages/support/AccountBilling";
import ChallengesCommunity from "../pages/support/ChallengesCommunity";
import PrivacySecurity from "../pages/support/PrivacySecurity";

import Challenge from "../pages/Challenge";
import ChallengeDetail from "../pages/ChallengeDetail";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import BlogCreate from "../pages/BlogCreate";
import MyBlogs from "../pages/MyBlogs";
import MealPlan from "../pages/MealPlan";
import AIConsultation from "../pages/AIConsultation";
import NutritionalAnalysis from "../pages/NutritionalAnalysis";
import ProgressTracking from "../pages/ProgressTracking";
import TopRecipes from "../pages/TopRecipes";
import SearchingPage from "../pages/SearchingPage";
import RecipeDetail from "../pages/RecipeDetail";
import RecipeCreate from "../pages/RecipeCreate";
import RecipeUpdate from "../pages/RecipeUpdate";
import MyRecipes from "../pages/MyRecipes";
import AllRecipes from "../pages/AllRecipes";
import DraftRecipes from "../pages/DraftRecipes";
import PrivateRecipes from "../pages/PrivateRecipes";
import PublishedRecipes from "../pages/PublishedRecipes";
import SavedRecipes from "../pages/SavedRecipes";
import Subscription from "../pages/Subscription";
import NotificationPage from "../pages/NotificationPage";
import FeedbackPage from "../pages/FeedbackPage";
import PaymentModule from "../components/admin/PaymentModule";
import FeedbackModule from "../components/admin/FeedbackModule";
import ReportModule from "../components/admin/ReportModule";
import RecipeModerationModule from "../components/admin/RecipeModerationModule";
import BlogModerationModule from "../components/admin/BlogModerationModule";
import UserManagementModule from "../components/admin/UserManagementModule";
import StatisticsModule from "../components/admin/StatisticsModule";
import DashboardModule from "../components/admin/DashboardModule";
import SystemSettingsModule from "../components/admin/SystemSettingsModule";
import ChallengeManagementModule from "../components/admin/ChallengeManagementModule";
import AdminChallengeDetail from "../components/admin/AdminChallengeDetail";
import AdminLayout from "../components/admin/AdminLayout";

const appRoutes = [
  {
    path: "/",
    element: (
      <SurveyCheckRoute>
        <HomePage />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/verify-otp",
    element: <OTPVerification />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/support",
    element: <SupportPage />,
  },
  {
    path: "/support/getting-started",
    element: <GettingStarted />,
  },
  {
    path: "/support/nutrition-tracking",
    element: <NutritionTracking />,
  },
  {
    path: "/support/meal-planner",
    element: <MealPlanner />,
  },
  {
    path: "/support/account-billing",
    element: <AccountBilling />,
  },
  {
    path: "/support/challenges-community",
    element: <ChallengesCommunity />,
  },
  {
    path: "/support/privacy-security",
    element: <PrivacySecurity />,
  },
  {
    path: "/challenge",
    element: <Challenge />,
  },
  {
    path: "/challenge/:id",
    element: <ChallengeDetail />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:id",
    element: <BlogDetail />,
  },
  {
    path: "/recipes/top",
    element: <TopRecipes />,
  },
  {
    path: "/search",
    element: <SearchingPage />,
  },
  {
    path: "/recipe/:id",
    element: <RecipeDetail />,
  },
  {
    path: "/survey",
    element: (
      <ProtectedRoute>
        <TakeSurvey />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/:userId/edit",
    element: (
      <SurveyCheckRoute>
        <ProfilePage />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "/user/:userId",
    element: (
      <SurveyCheckRoute>
        <Profile />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "/blog/create",
    element: (
      <ProtectedRoute>
        <BlogCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-blogs",
    element: (
      <ProtectedRoute>
        <MyBlogs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <DashboardModule />,
      },
      {
        path: "dashboard",
        element: <DashboardModule />,
      },
      {
        path: "content-moderation",
        element: <RecipeModerationModule />,
      },
      {
        path: "content-moderation/recipes",
        element: <RecipeModerationModule />,
      },
      {
        path: "content-moderation/blogs",
        element: <BlogModerationModule />,
      },
      {
        path: "payment",
        element: <PaymentModule />,
      },
      {
        path: "statistics",
        element: <StatisticsModule />,
      },
      {
        path: "report",
        element: <ReportModule />,
      },
      {
        path: "feedback",
        element: <FeedbackModule />,
      },
      {
        path: "users",
        element: <UserManagementModule />,
      },
      {
        path: "challenges",
        element: <ChallengeManagementModule />,
      },
      {
        path: "challenges/:id",
        element: <AdminChallengeDetail />,
      },
      {
        path: "system-settings",
        element: <SystemSettingsModule />,
      },
    ],
  },
  {
    path: "/meal-plan",
    element: (
      <SurveyCheckRoute>
        <MealPlan />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "/ai-consultation",
    element: (
      <ProtectedRoute>
        <AIConsultation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/nutritional-analysis",
    element: (
      <ProtectedRoute>
        <NutritionalAnalysis />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progress-tracking",
    element: (
      <SurveyCheckRoute>
        <ProgressTracking />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "/recipe/create",
    element: (
      <ProtectedRoute>
        <RecipeCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recipe/create/:draftId",
    element: (
      <ProtectedRoute>
        <RecipeCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recipe/:id/edit",
    element: (
      <ProtectedRoute>
        <RecipeUpdate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-recipes",
    element: (
      <ProtectedRoute>
        <MyRecipes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-recipes/all",
    element: (
      <ProtectedRoute>
        <AllRecipes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-recipes/drafts",
    element: (
      <ProtectedRoute>
        <DraftRecipes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-recipes/private",
    element: (
      <ProtectedRoute>
        <PrivateRecipes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-recipes/published",
    element: (
      <ProtectedRoute>
        <PublishedRecipes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-recipes/saved",
    element: (
      <ProtectedRoute>
        <SavedRecipes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/subscription",
    element: (
      <ProtectedRoute>
        <Subscription />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <SurveyCheckRoute>
        <NotificationPage />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "/feedback",
    element: (
      <ProtectedRoute>
        <FeedbackPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <SurveyCheckRoute>
        <SettingsPage />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "/settings/security/pin-recovery",
    element: (
      <SurveyCheckRoute>
        <PinAndRecoveryPage />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "/settings/security/change-password",
    element: (
      <SurveyCheckRoute>
        <ChangePasswordPage />
      </SurveyCheckRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default appRoutes;

