import React, { useState } from 'react';
import Modal from '../../common/Modal';
import Login from '../Login';
import Register from '../Register';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const switchToRegister = () => setIsLoginView(false);
  const switchToLogin = () => setIsLoginView(true);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLoginView ? (
        <Login onClose={onClose} onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onClose={onClose} onSwitchToLogin={switchToLogin} />
      )}
    </Modal>
  );
};

export default AuthModal;