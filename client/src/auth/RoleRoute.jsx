import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import LoadingView from "../components/ui/LoadingView";

export default function RoleRoute({ role, children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingView label="Checking role access..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
