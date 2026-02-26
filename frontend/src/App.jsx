import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider from "./pages/AuthProvider";
import ProtectedRoute from "./pages/ProtectedRoute";
import PublicOnlyRoute from "./pages/PublicOnlyRoute";
import Profile from "./pages/Profile";
import TrendingNow from "./components/TrendingNow";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout />
            }>
            <Route
              index
              element={
                <TrendingNow />
              } />
            <Route
              path="/anime/:id/:name/"
              element={
                <AnimeDetailPage />
              } />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            <Route
              path="login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              } />
            <Route
              path="register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              } />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;