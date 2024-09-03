import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import AuthModal from './AuthModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingSpinner/>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <AuthModal isOpen={true} />;
  }

  return children;
};

export default ProtectedRoute;