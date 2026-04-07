import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiBarChart2, FiCpu, FiUser, FiMenu, FiX, FiLogOut, FiMoon, FiSun, FiBriefcase, FiCode, FiLayout, FiChevronLeft, FiChevronRight, FiMessageCircle } from 'react-icons/fi';
import DarkModeToggle from './DarkModeToggle';
import Chatbot from './ChatBot';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
        { path: '/aptitude', label: 'Aptitude', icon: <FiCpu /> },
        { path: '/coding', label: 'Coding', icon: <FiCode /> },
        { path: '/mock-interview', label: 'Mock Interview', icon: <FiUser /> },
        { path: '/system-design', label: 'System Design', icon: <FiLayout /> },
        { path: '/companies', label: 'Companies', icon: <FiBriefcase /> },
        { path: '/profile', label: 'Profile', icon: <FiUser /> },
        { path: '/feedback', label: 'Feedback', icon: <FiMessageCircle /> },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300 font-sans">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="fixed hidden md:flex flex-col h-screen bg-white dark:bg-[#1a1d24] border-r border-slate-200 dark:border-white/5 z-50 shadow-2xl overflow-hidden transition-colors"
            >
                {/* Sidebar Header / Logo */}
                <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5 h-20">
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                key="logo-full"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-3 cursor-pointer overflow-hidden whitespace-nowrap"
                                onClick={() => navigate('/dashboard')}
                            >
                                <div className="w-9 h-9 min-w-[36px] rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                                    CA
                                </div>
                                <span className="font-black text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400 tracking-tighter">
                                    CrackIt AI
                                </span>
                            </motion.div>
                        )}
                        {isCollapsed && (
                            <motion.div
                                key="logo-collapsed"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mx-auto cursor-pointer"
                                onClick={() => navigate('/dashboard')}
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                    CA
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative group flex items-center gap-4 p-3.5 rounded-2xl text-sm font-bold transition-all duration-300 
                                    ${isActive
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                                    }`}
                            >
                                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="whitespace-nowrap uppercase tracking-widest text-[11px] font-black"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl whitespace-nowrap z-[60]">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-2">
                    {user && !isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-2xl border border-yellow-500/10 flex items-center justify-between mb-2 shadow-inner"
                        >
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg shadow-yellow-500/20 font-black">
                                $
                            </div>
                            <span className="text-[11px] font-black text-yellow-700 dark:text-yellow-500 tracking-tighter uppercase">
                                {user.coins || 0} Credits
                            </span>
                        </motion.div>
                    )}

                    <div className={`flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
                        <div className="flex items-center gap-2">
                            <DarkModeToggle />
                            {!isCollapsed && <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Theme</span>}
                        </div>

                        <div className="relative group w-full">
                            <button className={`w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-white dark:from-indigo-900/50 dark:to-transparent flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black border border-indigo-200 dark:border-white/5 shadow-sm">
                                    {user?.name?.[0] || 'U'}
                                </div>
                                {!isCollapsed && (
                                    <div className="text-left overflow-hidden whitespace-nowrap">
                                        <p className="text-xs font-black text-slate-900 dark:text-white truncate tracking-tight uppercase">{user?.name?.split(' ')[0] || 'User'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold dark:text-slate-500 truncate leading-none">View Profile</p>
                                    </div>
                                )}
                            </button>

                            {/* Hover Dropdown */}
                            <div className={`absolute bottom-full mb-2 w-48 bg-white dark:bg-[#1f232b] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-bottom-left z-[70] ${isCollapsed ? 'left-4' : 'left-0'}`}>
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <FiUser className="text-sm" /> Your Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                                    <FiLogOut className="text-sm" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Collapse Button */}
                    <button
                        onClick={toggleSidebar}
                        className="w-full mt-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-500 dark:hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-indigo-500/20"
                    >
                        {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full h-16 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 z-[100] px-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2" onClick={() => navigate('/dashboard')}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black">
                        CA
                    </div>
                    <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white uppercase">CrackIt AI</span>
                </div>
                <div className="flex items-center gap-4">
                    <DarkModeToggle />
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                    >
                        {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMobileMenu}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#1a1d24] z-[120] md:hidden shadow-2xl flex flex-col pt-20"
                        >
                            <div className="flex-1 px-4 py-6 space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={toggleMobileMenu}
                                        className={`flex items-center gap-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all
                                            ${location.pathname.startsWith(item.path)
                                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        {item.icon} {item.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="p-6 border-t border-slate-200 dark:border-white/5 space-y-4 mb-4">
                                <Link to="/profile" onClick={toggleMobileMenu} className="flex items-center gap-3 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                                    <FiUser /> Profile
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-3 text-[11px] font-black uppercase text-rose-500">
                                    <FiLogOut /> Sign Out
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <motion.main
                animate={{
                    paddingLeft: isCollapsed ? 80 : 280,
                }}
                className="flex-1 min-h-screen pt-16 md:pt-0 transition-all duration-300"
            >
                <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 min-h-full flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="flex-1"
                    >
                        {children}
                    </motion.div>
                </div>
            </motion.main>

            <Chatbot />
        </div>
    );
};

export default Layout;
