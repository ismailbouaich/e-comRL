import React, { useState, useCallback } from 'react';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
       <header>
            <nav className="relative px-4 py-4 flex justify-between items-center bg-white">
                <a className="text-3xl font-bold leading-none" href="#">
                    Logo
                </a>
                <div className="lg:hidden">
                    <button className="navbar-burger flex items-center text-blue-600 p-3" onClick={toggleMenu}>
                        <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Mobile menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                        </svg>
                    </button>
                </div>
                <ul className="hidden lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
                    {/* Add your navigation items here */}
                    <li>d</li>
                    <li>d</li>

                    <li>d</li>

                    <li>d</li>


<li>d</li>

                </ul>
                <a className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200" href="#">Sign In</a>
                <a className="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200" href="#">Sign up</a>
            </nav>
            
            <div className={`navbar-menu transition-transform duration-500 ease-in-out fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>  
                    <div className="navbar-backdrop fixed  inset-0 bg-gray-800 bg-opacity-25"  onClick={toggleMenu}></div>
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
                            <li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">Home</a>
					</li>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">About Us</a>
					</li>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">Services</a>
					</li>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">Pricing</a>
					</li>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">Contact</a>
					</li>
                            </ul>
                        </div>
                        <div className="mt-auto">
                            <div className="pt-6">
                                <a className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl" href="#">Sign in</a>
                                <a className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl" href="#">Sign Up</a>
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

export default Nav;
