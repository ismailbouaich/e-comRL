// AuthModal.js
import React, { useContext, useState } from 'react';
import Modal from '../../common/Modal';
import Login from '../Login';
import Register from '../Register';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';


const AuthModal = ({ isOpen, onClose, onAuthSuccess, isProtectedRoute, returnPath }) => {
  const [isLoginView, setIsLoginView] = useState(true);
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


  const switchView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isProtectedRoute} showCloseButton={!isProtectedRoute}>
      {isProtectedRoute && (
        <>
          <h2>Authentication Required</h2>
          <p>Please log in to access this content.</p>
        </>
      )}
      {isLoginView ? (
        <Login 
          onSuccess={handleAuthSuccess} 
          onSwitchToRegister={switchView} 
          onClose={onClose}
        />
      ) : (
        <Register 
          onSuccess={handleAuthSuccess} 
          onSwitchToLogin={switchView}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

export default AuthModal;