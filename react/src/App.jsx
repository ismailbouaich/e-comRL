import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import { Outlet } from 'react-router-dom';


const App = () => {
  return (
    <div>
      
      <Header />
      <Outlet />
      <Footer />
      
    </div>
  );
};

export default App;