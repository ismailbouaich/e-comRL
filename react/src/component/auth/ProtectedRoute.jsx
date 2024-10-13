import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import AuthModal from './AuthModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from './AuthProvider';
import { useToast } from '../../hooks/use-toast';
import { ToastAction } from "../../components/ui/toast";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { toast } = useToast();  // Use the ShadCN toast

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this content.",
        variant: "destructive",
        action: <button onClick={() => alert("Log in")}>Log in</button>,
      });
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return <LoadingSpinner />; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <AuthModal 
        isOpen={true} 
        onClose={() => setIsAuthModalOpen(false)} // Pass the onClose prop to AuthModal
        onAuthSuccess={() => setIsAuthModalOpen(false)} 
        isProtectedRoute={true}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
