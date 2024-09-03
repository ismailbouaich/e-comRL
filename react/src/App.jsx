import React, { useState } from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import { Outlet } from 'react-router-dom';
import AuthModal from './component/auth/AuthModal';
import { AuthProvider } from './component/auth/AuthProvider';



const App = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div>
        <AuthProvider>
      <Header openAuthModal={() => setIsAuthModalOpen(true)} />
      <AuthModal
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={() => {
          setIsAuthModalOpen(false);
          // Update any other necessary state or fetch user data
        }}
        isProtectedRoute={false}
      />
      <Outlet />
      <Footer />
      </AuthProvider>
    </div>
  );
};

export default App;