import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Profile from "./pages/Profile";
import TrendingNow from "./components/TrendingNow";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TrendingNow />,
      },
      {
        path: "anime/:id/:name",
        element: <AnimeDetailPage />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);