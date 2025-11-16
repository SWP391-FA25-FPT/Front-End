import React from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import SurveyCheckRoute from "../components/auth/SurveyCheckRoute.jsx";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute.jsx";
import { Navigate } from "react-router-dom";

// Imports Pages
import HomePage from "../pages/HomePage.jsx";
import Login from "../pages/Login.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import OTPVerification from "../pages/OTPVerification.jsx";
import TakeSurvey from "../pages/TakeSurvey.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import SupportPage from "../pages/SupportPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import PinAndRecoveryPage from "../pages/PinAndRecoveryPage.jsx";
import ChangePasswordPage from "../pages/ChangePasswordPage.jsx";
import Profile from "../pages/Profile.jsx";
import BlogCreate from "../pages/BlogCreate.jsx";
import MyBlogs from "../pages/MyBlogs.jsx";
import MealPlan from "../pages/MealPlan.jsx";
import AIConsultation from "../pages/AIConsultation.jsx";
import NutritionalAnalysis from "../pages/NutritionalAnalysis.jsx";
import ProgressTracking from "../pages/ProgressTracking.jsx";
import TopRecipes from "../pages/TopRecipes.jsx";
import SearchingPage from "../pages/SearchingPage.jsx";
import RecipeDetail from "../pages/RecipeDetail.jsx";
import RecipeCreate from "../pages/RecipeCreate.jsx";
import RecipeUpdate from "../pages/RecipeUpdate.jsx";
import MyRecipes from "../pages/MyRecipes.jsx";
import AllRecipes from "../pages/AllRecipes.jsx";
import DraftRecipes from "../pages/DraftRecipes.jsx";
import PrivateRecipes from "../pages/PrivateRecipes.jsx";
import PublishedRecipes from "../pages/PublishedRecipes.jsx";
import SavedRecipes from "../pages/SavedRecipes.jsx";
import Subscription from "../pages/Subscription.jsx";
import NotificationPage from "../pages/NotificationPage.jsx";
import FeedbackPage from "../pages/FeedbackPage.jsx";
import Challenge from "../pages/Challenge.jsx";
import ChallengeDetail from "../pages/ChallengeDetail.jsx";
import Blog from "../pages/Blog.jsx";
import BlogDetail from "../pages/BlogDetail.jsx";
import MessagesPage from "../pages/MessagesPage.jsx"; // Import mới từ file của bạn

// Imports Admin Components
import PaymentModule from "../components/admin/PaymentModule.jsx";
import FeedbackModule from "../components/admin/FeedbackModule.jsx";
import RecipeModerationModule from "../components/admin/RecipeModerationModule.jsx";
import BlogModerationModule from "../components/admin/BlogModerationModule.jsx";
import UserManagementModule from "../components/admin/UserManagementModule.jsx";
import StatisticsModule from "../components/admin/StatisticsModule.jsx";
import DashboardModule from "../components/admin/DashboardModule.jsx";
import SystemSettingsModule from "../components/admin/SystemSettingsModule.jsx";
import ChallengeManagementModule from "../components/admin/ChallengeManagementModule.jsx";
import AdminChallengeDetail from "../components/admin/AdminChallengeDetail.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";

// Imports Support Pages
import GettingStarted from "../pages/support/GettingStarted.jsx";
import NutritionTracking from "../pages/support/NutritionTracking.jsx";
import MealPlanner from "../pages/support/MealPlanner.jsx";
import AccountBilling from "../pages/support/AccountBilling.jsx";
import ChallengesCommunity from "../pages/support/ChallengesCommunity.jsx";
import PrivacySecurity from "../pages/support/PrivacySecurity.jsx";

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
  // Route tin nhắn mới từ file của bạn
  {
    path: "/messages",
    element: (
      <SurveyCheckRoute>
        <MessagesPage />
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
