// AuthModal.js
import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../common/Modal';
import Login from '../Login';
import Register from '../Register';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import LoadingSpinner from '../../components/LoadingSpinner';



const VIEW_STATES = {
  LOGIN: 'login',
  REGISTER: 'register',
};

const AuthModal = ({ isOpen, onClose, onAuthSuccess, isProtectedRoute, returnPath }) => {
  const [currentView, setCurrentView] = useState(VIEW_STATES.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    onAuthSuccess();
    onClose();
    if (returnPath) {
      navigate(returnPath);
    }
  };

  const handleAuthAttempt = async (authFunction) => {
    setIsLoading(true);
    setError(null);
    try {
      await authFunction();
      handleAuthSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = () => {
    setCurrentView(currentView === VIEW_STATES.LOGIN ? VIEW_STATES.REGISTER : VIEW_STATES.LOGIN);
    setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isProtectedRoute} showCloseButton={!isProtectedRoute}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <LoadingSpinner />
      ) : currentView === VIEW_STATES.LOGIN ? (
        <Login 
          onSuccess={(loginFunction) => handleAuthAttempt(loginFunction)} 
          onSwitchToRegister={switchView} 
          onClose={onClose}
        />
      ) : (
        <Register 
          onSuccess={(registerFunction) => handleAuthAttempt(registerFunction)} 
          onSwitchToLogin={switchView}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

export default AuthModal;