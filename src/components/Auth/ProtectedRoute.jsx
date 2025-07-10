// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../Common/Spinner';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show spinner while auth state is initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner />
      </div>
    );
  }

  // If not logged in or not email-verified, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, enforce role-based access
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized — render children
  return <>{children}</>;
}