import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("mentorToken");
  const userType = localStorage.getItem("userType")?.toLowerCase();

  const isAuthenticated = !!token;
  const hasRequiredRole = allowedRoles.includes(userType);

  // No token → redirect to access-denied
  if (!isAuthenticated) {
    return <Navigate to="/access-denied" replace />;
  }

  // Logged in but wrong role → redirect to access-denied
  if (!hasRequiredRole) {
    return <Navigate to="/access-denied" replace />;
  }

  // Logged in + correct role → render page
  return children;
};

export default PrivateRoute;
