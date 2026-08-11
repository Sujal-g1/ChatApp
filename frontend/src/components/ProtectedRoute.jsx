import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authUser, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  if (!authUser) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;