import React from 'react';
import { Navigate } from 'react-router-dom';

// PublicRoute Component
export const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');

  // If token is found, user is considered authenticated, and is redirected away from public route
  if (token) {
    return <Navigate to="/feed" replace />;
  }

  // If no token, render the intended public component
  return children;
};