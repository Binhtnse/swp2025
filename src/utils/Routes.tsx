import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import PsychologistListScreen from "../screens/PsychologistListScreen";
import BlogScreen from "../screens/BlogScreen";

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
    path: "/login",
    element: <LoginScreen />,
  },
]);
