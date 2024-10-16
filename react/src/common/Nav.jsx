import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/userActions';
import ShoppingCart from './ShoppingCart';
import { FaSearch, FaUser, FaChevronDown, FaHome, FaBars } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Custom hook for dropdown logic
const useDropdown = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const timeoutRef = useRef(null);

  const open = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      timeoutRef.current = null;
    }, 100); // Delay in milliseconds
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [isOpen, open, close];
};

const DropdownMenu = React.memo(({ items, openDropdown, closeDropdown }) => (
  <div
    className="absolute top-full mt-2 w-40 bg-white border rounded shadow-lg"
    onMouseEnter={openDropdown}
    onMouseLeave={closeDropdown}
  >
    <ul>
      {items.map((item, index) => (
        <li
          key={index}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
));

const Nav = ({ openAuthModal }) => {
  const { t, i18n } = useTranslation();

  const ROUTES = {
    HOME: '/',
    STORE: '/store',
    PROFILE: '/profile',
  };

  const links = [
    { name: t('Home'), path: ROUTES.HOME },
    { name: t('Store'), path: ROUTES.STORE },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isWomenDropdownOpen, openWomenDropdown, closeWomenDropdown] = useDropdown();
  const [isMenDropdownOpen, openMenDropdown, closeMenDropdown] = useDropdown();
  const [isPagesDropdownOpen, openPagesDropdown, closePagesDropdown] = useDropdown();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isTransitionEnded, setIsTransitionEnded] = useState(false);

  const navRef = useRef();

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

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  }, [i18n]);

  const isLoggedIn = !!localStorage.getItem('token');

  const profile = isLoggedIn ? (
    <>
      <Link className="text-gray-600 hover:text-gray-800" to={ROUTES.PROFILE}>
        {t('Profile')}
      </Link>
      <Link className="text-gray-600 hover:text-gray-800" onClick={handleLogout}>
        {t('Logout')}
      </Link>
    </>
  ) : (
    <button onClick={openAuthModal}>{t('Sign In / Register')}</button>
  );

  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState({
    men: false,
    women: false,
    pages: false,
  });

  const toggleMobileDropdown = (dropdown) => {
    setIsMobileDropdownOpen((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown],
    }));
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-white shadow-md" ref={navRef}>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-0 max-650:py-4 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="text-2xl font-bold">Ismail Bouaichi</Link>

          <div className="hidden lg:flex space-x-6">
            <div 
              className="relative cursor-pointer p-4"
              onMouseEnter={openMenDropdown}
              onMouseLeave={closeMenDropdown}
            >
              <span className="flex items-center z-50">
                {t('Men Wear')}
                <FaChevronDown className="ml-1 text-xs" />
              </span>
              {isMenDropdownOpen && (
                <DropdownMenu
                  items={[
                    t('T-Shirt'), t('Casual Shirts'), t('Formal Shirts'),
                    t('Blazers & Coats'), t('Suits'), t('Jackets')
                  ]}
                />
              )}
            </div>

            <div 
              className="relative cursor-pointer p-4"
              onMouseEnter={openWomenDropdown}
              onMouseLeave={closeWomenDropdown}
            >
              <span className="flex items-center">
                {t('Women Wear')}
                <FaChevronDown className="ml-1 text-xs" />
              </span>
              {isWomenDropdownOpen && (
                <DropdownMenu
                  items={[
                    t('Dresses'), t('Jumpsuits'), t('Tops, T-Shirts & Shirts'),
                    t('Shorts & Skirts'), t('Shrugs'), t('Blazers')
                  ]}
                />
              )}
            </div>

            <div 
              className="relative cursor-pointer p-4"
              onMouseEnter={openPagesDropdown}
              onMouseLeave={closePagesDropdown}
            > 
              <span className="flex items-center">
                {t('Pages')}
                <FaChevronDown className="ml-1 text-xs" />
              </span>
              {isPagesDropdownOpen && (
                <DropdownMenu
                  items={[
                    t('About Us'), t('Contact Us'), t('FAQs'),
                  ]}
                />
              )}
            </div>

            <Link to={ROUTES.STORE} className="text-gray-600 hover:text-gray-800 p-4">
              {t('Store')}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <span className="mr-2">{i18n.language === 'en' ? 'English' : 'French'}</span>
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
      </nav>

      <div 
        className={`navbar-menu transition-transform duration-500 ease-in-out fixed top-0 left-0 bottom-0 flex flex-col w-full py-6 px-6 overflow-y-auto z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`} 
        onTransitionEnd={handleTransitionEnd}
      >
        <div 
          className={`navbar-backdrop fixed inset-0 ${
            isTransitionEnded && isOpen ? 'backdrop-blur-lg' : ''
          } ${isOpen ? 'block' : 'hidden'}`} 
          onClick={toggleMenu}
        ></div>
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
                <Link
                  to={link.path}
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  onClick={toggleMenu}
                >
                  {link.name}
                </Link>
              </li>
            ))}

        {/* Men Wear Dropdown */}
        <li className="mb-2">
        <button
            onClick={() => toggleMobileDropdown('men')}
            className="flex items-center justify-between w-full p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
          >
            <span>{t('Men Wear')}</span>
            <FaChevronDown
              className={`ml-2 transform transition-transform ${
                isMobileDropdownOpen.men ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isMobileDropdownOpen.men && (
            <ul className="mt-2">
              {[
                { name: t('T-Shirt'), path: '/category/men/t-shirts' },
                { name: t('Casual Shirts'), path: '/category/men/casual-shirts' },
                { name: t('Formal Shirts'), path: '/category/men/formal-shirts' },
                { name: t('Blazers & Coats'), path: '/category/men/blazers-coats' },
                { name: t('Suits'), path: '/category/men/suits' },
                { name: t('Jackets'), path: '/category/men/jackets' },
              ].map((item, index) => (
                <li key={index} className="mb-1">
                  <Link
                    to={item.path}
                    className="block pl-8 p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

          {/* Women Wear Dropdown */}
          <li className="mb-2">
          <button
              onClick={() => toggleMobileDropdown('women')}
              className="flex items-center justify-between w-full p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
            >
              <span>{t('Women Wear')}</span>
              <FaChevronDown
                className={`ml-2 transform transition-transform ${
                  isMobileDropdownOpen.women ? 'rotate-180' : ''
                }`}
              />
            </button>
          
            {isMobileDropdownOpen.women && (
              <ul className="mt-2">
                {[
                  { name: t('Dresses'), path: '/category/women/dresses' },
                  { name: t('Jumpsuits'), path: '/category/women/jumpsuits' },
                  { name: t('Tops, T-Shirts & Shirts'), path: '/category/women/tops-tshirts-shirts' },
                  { name: t('Shorts & Skirts'), path: '/category/women/shorts-skirts' },
                  { name: t('Shrugs'), path: '/category/women/shrugs' },
                  { name: t('Blazers'), path: '/category/women/blazers' },
                ].map((item, index) => (
                  <li key={index} className="mb-1">
                    <Link
                      to={item.path}
                      className="block pl-8 p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                      onClick={toggleMenu}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

  {/* Pages Dropdown */}
        <li className="mb-2">
        <button
            onClick={() => toggleMobileDropdown('pages')}
            className="flex items-center justify-between w-full p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
          >
            <span>{t('Pages')}</span>
            <FaChevronDown
              className={`ml-2 transform transition-transform ${
                isMobileDropdownOpen.pages ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isMobileDropdownOpen.pages && (
            <ul className="mt-2">
              {[
                { name: t('About Us'), path: '/about' },
                { name: t('Contact Us'), path: '/contact' },
                { name: t('FAQs'), path: '/faqs' },
              ].map((item, index) => (
                <li key={index} className="mb-1">
                  <Link
                    to={item.path}
                    className="block pl-8 p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
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
        <Link to={ROUTES.HOME}><FaHome size={20} /></Link>
        <ShoppingCart />
        <Link to={ROUTES.PROFILE}><FaUser size={20} /></Link>
      </div>
    </header>
  );
};

export default React.memo(Nav);