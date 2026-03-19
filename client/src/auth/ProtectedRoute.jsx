import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import LoadingView from "../components/ui/LoadingView";

export default function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingView label="Checking your session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
