import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/userActions';
import ShoppingCart from './ShoppingCart';
import { FaSearch, FaUser, FaChevronDown, FaHome, FaBars } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


const Nav = ({ openAuthModal }) => {
  const { t, i18n } = useTranslation(); // Initialize translation

  const links = [
    { name: t('Home'), path: "/" },
    { name: t('Store'), path: "/store" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTransitionEnded, setIsTransitionEnded] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);



  
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
    
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const buttons = isLoggedIn ? (
    <Link className="text-gray-600 hover:text-gray-800" to="/login" onClick={handleLogout}>
      {t('Logout')}
    </Link>
  ) : (
    <button onClick={openAuthModal}>Sign In / Register</button>
  );

  const profile = isLoggedIn ? (
    <>
    <Link className="text-gray-600 hover:text-gray-800" to="/profile">
      {t('Profile')}
    </Link>
    <Link className="text-gray-600 hover:text-gray-800" onClick={handleLogout}>
      {t('Logout')}
    </Link>
    </>
  ) : (
    <button onClick={openAuthModal}>Sign In / Register</button>
  );

  const changeLanguage = (lng) => {
    console.log('Changing language to:', lng);
    i18n.changeLanguage(lng);
    console.log('Current language:', i18n.language);
    setIsLangDropdownOpen(false);
  };

  return (
    <header className='w-full sm:h-20 lg:h-24 relative z-20'>
      <nav className="bg-white shadow-md">
      
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">Ismail Bouaichi</Link>

          <div className="hidden lg:flex space-x-6">
           
            <div 
              className="relative cursor-pointer"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="flex items-center">
                {t('Men Wear')}
                <FaChevronDown className="ml-1 text-xs" />
              </span>
            </div>
            <div 
              className="relative cursor-pointer"
            >
              <span className="flex items-center">
                {t('Women Wear')}
                <FaChevronDown className="ml-1 text-xs" />
              </span>
            </div>
            <Link to="/store" className="text-gray-600 hover:text-gray-800">{t('Store')}</Link>
            <div className="relative cursor-pointer">
              <span className="flex items-center">
                {t('Pages')}
                <FaChevronDown className="ml-1 text-xs" />
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <span className="mr-2">{i18n.language === 'en' ? 'English' : 'French'}
                  
                </span>
                <FaChevronDown className="text-xs" />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('fr')}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    French
                  </button>
                </div>
              )}
            </div>
            {profile}
           
            <div className="xxs:hidden">
              <ShoppingCart />
            </div>
          </div>

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
                <CategoryColumn title={t("Top Wear")} items={[t('T-Shirt'), t('Casual Shirts'), t('Formal Shirts'), t('Blazers & Coats'), t('Suits'), t('Jackets')]} />
                <CategoryColumn title={t("Western Wear")} items={[t('Dresses'), t('Jumpsuits'), t('Tops, T-Shirts & Shirts'), t('Shorts & Skirts'), t('Shrugs'), t('Blazers')]} />
                <CategoryColumn title={t("Footwear")} items={[t('Flats'), t('Casual Shoes'), t('Heels'), t('Boots')]} />
                <CategoryColumn title={t("Lingerie & Sleepwear")} items={[t('Bra'), t('Briefs'), t('Sleepwear')]} />
                <CategoryColumn title={t("Gadgets")} items={[t('Smart Wearables'), t('Headphones')]} />
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
              {links.map((link, index) => (
                <li key={index} className="mb-1">
                  <Link to={link.path} className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto">
            <div className="pt-6">
              <Link to="/login" className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold  bg-gray-50 hover:bg-gray-100 rounded-xl">
                {t('Sign In')}
              </Link>
              <Link to="/register" className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl">
                {t('Sign Up')}
              </Link>
            </div>
            <p className="my-4 text-xs text-center text-gray-400">
              <span>Copyright © 2023</span>
            </p>
          </div>
        </nav>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-40">
        <button onClick={toggleMenu}><FaBars size={20} /></button>
        <Link to="/search"><FaSearch size={20} /></Link>
        <Link to="/"><FaHome size={20} /></Link>
        <ShoppingCart />
        <Link to="/profile"><FaUser size={20} /></Link>
      </div>
    </header>
  );
};

const CategoryColumn = ({ title, items }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600 hover:text-gray-800">{item}</li>
      ))}
    </ul>
  </div>
);

export default Nav;
