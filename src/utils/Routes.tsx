import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import PsychologistListScreen from "../screens/PsychologistListScreen";
import BlogScreen from "../screens/BlogScreen";
import SupportProgramScreens from "../screens/SupportProgramScreens";
import MentalHealthDocumentScreen from "../screens/MentalHealthDocumentScreen";
import BlogDetailScreen from "../screens/BlogDetailScreen";
import SurveyScreen from "../screens/SurveyScreen";
import SurveyDetailScreen from "../screens/SurveyDetailScreen";
import SupportProgramDetailScreen from "../screens/SupportProgramDetailScreen";

const Layout = lazy(() => import("../components/MainLayout"));
const ProtectedRoute = lazy(() => import("../utils/ProtectedRoutes"));

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <HomeScreen />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/surveys",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <SurveyScreen />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/surveys/:surveyId",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <SurveyDetailScreen />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/psychologist-list",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <PsychologistListScreen />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/support-program-list",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <SupportProgramScreens />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/support-programs/details/:programId",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <SupportProgramDetailScreen />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/resources/blog",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <BlogScreen />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/resources/documents",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <MentalHealthDocumentScreen />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/resources/blog/1",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <BlogDetailScreen />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
]);
