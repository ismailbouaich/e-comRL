import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/userActions';
import ShoppingCart from './ShoppingCart';
import { FaSearch, FaUser, FaChevronDown } from 'react-icons/fa';

const links = [
  { name: "Home", path: "/" },
  { name: "Store", path: "/store" },
];

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTransitionEnded, setIsTransitionEnded] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
    setIsTransitionEnded(false);
  }, [isOpen]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitionEnded(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsTransitionEnded(false);
    }
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const buttons = isLoggedIn ? (
    <Link className="text-gray-600 hover:text-gray-800" to="/login" onClick={handleLogout}>
      Logout
    </Link>
  ) : (
    <Link className="text-gray-600 hover:text-gray-800" to="/login">
      Sign In
    </Link>
  );

  const profile = isLoggedIn ? (
    <Link className="text-gray-600 hover:text-gray-800" to="/profile">
      Profile
    </Link>
  ) : (
    <Link className="text-gray-600 hover:text-gray-800" to="/register">
      Sign Up
    </Link>
  );

  return (
    <header className='w-full sm:h-20 lg:h-24 relative z-20'>
      <nav className="bg-white shadow-md">
        {/* Top row */}
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">CHAWK BAZAR</Link>

          {/* Main menu items */}
          <div className="hidden lg:flex space-x-6">
            {links.map((link, index) => (
              <Link key={index} to={link.path} className="text-gray-600 hover:text-gray-800">
                {link.name}
              </Link>
            ))}
            <div 
              className="relative cursor-pointer"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="flex items-center">
                Men Wear
                <FaChevronDown className="ml-1 text-xs" />
              </span>
            </div>
            <div 
              className="relative cursor-pointer"
            >
              <span className="flex items-center">
                Women Wear
                <FaChevronDown className="ml-1 text-xs" />
              </span>
            </div>
            <Link to="/search" className="text-gray-600 hover:text-gray-800">Search</Link>
            <Link to="/shops" className="text-gray-600 hover:text-gray-800">Shops</Link>
            <div className="relative cursor-pointer">
              <span className="flex items-center">
                Pages
                <FaChevronDown className="ml-1 text-xs" />
              </span>
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="mr-2" />
              <span>English</span>
              <FaChevronDown className="ml-1 text-xs" />
            </div>
            <FaSearch className="text-gray-600 text-xl" />
            {buttons}
            {profile}
            <div className="xxs:hidden">
              <ShoppingCart />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button className="navbar-burger flex items-center text-blue-600 p-3" onClick={toggleMenu}>
              <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Mobile menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="border-t">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-5 gap-8">
                <CategoryColumn title="Top Wear" items={['T-Shirt', 'Casual Shirts', 'Formal Shirts', 'Blazwers & Coats', 'Suits', 'Jackets']} />
                <CategoryColumn title="Western Wear" items={['Dresses', 'Jumpsuits', 'Tops, T-Shirts & Shirts', 'Shorts & Skirts', 'Shurgs', 'Blazers']} />
                <CategoryColumn title="Footwear" items={['Flats', 'Casual Shoes', 'Heels', 'Boots']} />
                <CategoryColumn title="Lingerie & Sleepwear" items={['Bra', 'Briefs', 'Sleepwear']} />
                <CategoryColumn title="Gadgets" items={['Smart Wearables', 'Headphones']} />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
     
<div className={`navbar-menu transition-transform duration-500 ease-in-out fixed top-0 left-0 bottom-0 flex flex-col w-full py-6 px-6 overflow-y-auto z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} onTransitionEnd={handleTransitionEnd}>
<div className={`navbar-backdrop fixed inset-0  ${isTransitionEnded && isOpen ? 'backdrop-blur-lg' : ''} ${isOpen ? 'block' : 'hidden'}`} onClick={toggleMenu}></div>
    <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
        <div className="flex items-center mb-8">
            <a className="mr-auto text-3xl font-bold leading-none" href="#">
                LOGO
            </a>
            <button className="navbar-close" onClick={toggleMenu}>
                <svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div>

            <ul>
            {links.map((link,index)=>{
return(
    <li className="mb-1" key={index}>
    <Link to={link.path} className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
        {link.name}
    </Link>
  </li>
)
})}
              
            </ul>
        </div>
        <div className="mt-auto">
            <div className="pt-6 gap-4">

            {buttons}
            {profile}
                
            </div>

            <p className="my-4 text-xs text-center text-gray-400">
                <span>Copyright © 2021</span>
            </p>
        </div>
    </nav>
</div>
    </header>
  );
};

const CategoryColumn = ({ title, items }) => (
  <div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600 hover:text-gray-800">{item}</li>
      ))}
    </ul>
  </div>
);

export default Nav;












