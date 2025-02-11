import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";

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
]);
