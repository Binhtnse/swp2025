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
import AdminBlogScreen from "../screens/AdminBlogScreen";
import AdminMentalHealthDocumentScreen from "../screens/AdminMentalHealthDocumentScreen";
import AdminPsychologistScreen from "../screens/AdminPsychologistScreen";
import AdminSurveyListScreen from "../screens/AdminSurveyListScreen";
import AdminSupportProgramScreen from "../screens/AdminSupportProgramScreen";
import AdminUserListScreen from "../screens/AdminUserListScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";

const Layout = lazy(() => import("../components/MainLayout"));
const ProtectedRoute = lazy(() => import("../utils/ProtectedRoutes"));
const AdminLayout = lazy(() => import("../components/AdminLayout"));

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
    path: "/admin/dashboard",
    element: (
      <AdminLayout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <AdminDashboardScreen />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminLayout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <AdminUserListScreen />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/admin/psychologists",
    element: (
      <AdminLayout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <AdminPsychologistScreen />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/admin/surveys",
    element: (
      <AdminLayout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <AdminSurveyListScreen />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/admin/support-programs",
    element: (
      <AdminLayout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <AdminSupportProgramScreen />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/admin/resources/blogs",
    element: (
      <AdminLayout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <AdminBlogScreen />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/admin/resources/documents",
    element: (
      <AdminLayout>
        <ProtectedRoute allowedRoles={["GUEST"]}>
          <AdminMentalHealthDocumentScreen />
        </ProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
]);
