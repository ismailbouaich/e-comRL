import React, { useState, useCallback ,useEffect} from 'react';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTransitionEnded, setIsTransitionEnded] = useState(false);


    const toggleMenu = useCallback(() => {
        setIsOpen(!isOpen);
        // Reset transition state when menu is opened/closed
        setIsTransitionEnded(false);
    }, [isOpen]);

    // Function to handle transition end event
    const handleTransitionEnd = useCallback(() => {
        setIsTransitionEnded(true);
    }, []);


    // Reset transition state when menu is closed
    useEffect(() => {
        if (!isOpen) {
            setIsTransitionEnded(false);
        }
    }, [isOpen]);
    return (
        <header className='w-full sm:h-20 lg:h-24 relative z-20'>
            <div className='h-16flex items-center justify-center mx-auto max-w-[1920px] h-full w-full'>
            <nav className="relative p-5 px-4 py-4 flex justify-between items-center bg-white">
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
                    <li><a href="#" className="text-gray-900 hover:text-gray-700">Home</a></li>
                    <li><a href="#" className="text-gray-900 hover:text-gray-700">About Us</a></li>
                    <li><a href="#" className="text-gray-900 hover:text-gray-700">Services</a></li>
                    <li><a href="#" className="text-gray-900 hover:text-gray-700">Pricing</a></li>
                    <li><a href="#" className="text-gray-900 hover:text-gray-700">Contact</a></li>
                </ul>
                <a className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200" href="#">Sign In</a>
                <a className="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200" href="#">Sign up</a>
            </nav>
            </div>
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
                            <a className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold bg-gray-50 hover:bg-gray-100 rounded-xl" href="#">Sign in</a>
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
