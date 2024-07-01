import  { useState, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav'
import Home from '../component/home/Home';
import Login from '../component/Login';
import Register from '../component/Register';
import Profile from '../component/Profile';
import Forgot from '../component/Forgot';
import Store from '../component/Store';
import Product from '../component/Product';
import Cart from '../component/Cart';


import { ThemeContext } from '../theme/ThemeContext';
import Success from '../component/Success';
import Confirmed  from '../component/Confirmed';








const Header = () => {
  const { darkMode } = useContext(ThemeContext); // Access darkMode from ThemeContext

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user');
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen header ${darkMode ? 'dark' : 'light'}`}>
      <Nav user={user} setUser={setUser} />
      
      {user && ( // Conditionally render routes only if user data is available
     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/forget" element={<Forgot />} />
          <Route path="/store" element={<Store user={user} />} />
          {/* <Route path="/edit/user/:id" element={<EditUser />} /> */}
          <Route path="/product/:id" element={<Product user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/success/:session_id" element={<Success />} />
          <Route path="/confirmed" element={<Confirmed />} />

        </Routes>
        
      )}
    </div>
  );
};



export default Header;