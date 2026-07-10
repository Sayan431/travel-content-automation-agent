import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ContentReview from "./pages/ContentReview";
import BrandSettings from "./pages/BrandSettings";
import Blogs from "./pages/Blogs";
import AdminUsers from "./pages/AdminUsers";
import AdminFeeds from "./pages/AdminFeeds";
import AdminPosts from "./pages/AdminPosts";
import AdminItinerary from "./pages/AdminItinerary";

function Private({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <Private>
            <Layout />
          </Private>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="content" element={<ContentReview />} />
        <Route path="brand" element={<BrandSettings />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="feeds" element={<AdminFeeds />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="itinerary" element={<AdminItinerary />} />
      </Route>

      <Route path="*" element={<h1 className="center">404 Not Found</h1>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}