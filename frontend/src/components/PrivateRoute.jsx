import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader size="lg" text="Checking authentication..." />;
  }

  // ❌ Guest user → Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ Admin should NOT access user-only routes like Orders
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Normal logged user allowed
  return children;
};

export default PrivateRoute;
