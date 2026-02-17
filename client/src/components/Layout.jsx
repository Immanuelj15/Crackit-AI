import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiBarChart2, FiCpu, FiUser, FiMenu, FiX, FiLogOut, FiMoon, FiSun, FiBriefcase, FiCode } from 'react-icons/fi';
import DarkModeToggle from './DarkModeToggle';
import Chatbot from './ChatBot';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
        { path: '/aptitude', label: 'Aptitude', icon: <FiCpu /> },
        { path: '/coding', label: 'Coding', icon: <FiCode /> },
        { path: '/mock-interview', label: 'Mock Interview', icon: <FiUser /> },
        { path: '/companies', label: 'Companies', icon: <FiBriefcase /> },
        { path: '/profile', label: 'Profile', icon: <FiUser /> },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                CA
                            </div>
                            <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                                CrackIt AI
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">
                            {menuItems.map((item) => {
                                const isActive = location.pathname.startsWith(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                                            ${isActive
                                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white'
                                            }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                            <DarkModeToggle />

                            <div className="relative group">
                                <button className="flex items-center gap-2 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                        {user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                </button>

                                {/* Dropdown for Logout */}
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50 flex items-center gap-2"
                                    >
                                        <FiUser /> Your Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <FiLogOut /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-3">
                            <DarkModeToggle />
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                            ${location.pathname.startsWith(item.path)
                                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                        <FiLogOut className="text-xl" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="pt-20 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
            <Chatbot />
        </div>
    );
};

export default Layout;
