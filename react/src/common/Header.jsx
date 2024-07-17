import  {  useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './Nav'
import Home from '../component/home/Home';
import Login from '../component/Login';
import Register from '../component/Register';
import Profile from '../component/Profile';
import Forgot from '../component/Forgot';
import Store from '../component/Store';
import Product from '../component/Product';



import { ThemeContext } from '../theme/ThemeContext';
import Success from '../component/Success';
import Confirmed  from '../component/Confirmed';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../redux/actions/userActions';
import Checkout from '../component/checkout/Checkout';







const Header = () => {
  const { darkMode } = useContext(ThemeContext); // Access darkMode from ThemeContext

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);


 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserData());
    }
  }, [dispatch]);
  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={user ? <Profile /> : <Login />} />
      <Route path="/forget" element={<Forgot />} />
      <Route path="/store" element={<Store />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/success" element={<Success />} />
      <Route path="/confirmed" element={<Confirmed />} />
      <Route path='/checkout' element={<Checkout/>} />
    </Routes>
  </div>
  );
};



export default Header;