import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBarChart2, FiCpu, FiMessageSquare, FiHome, FiCheckCircle } from 'react-icons/fi';

const AptitudeLayout = ({ children }) => {
    const location = useLocation();

    // Categories for the sidebar
    const categories = [
        {
            id: 'quant',
            label: 'Quantitative',
            icon: <FiBarChart2 />,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            id: 'logical',
            label: 'Logical Reasoning',
            icon: <FiCpu />,
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            id: 'verbal',
            label: 'Verbal Ability',
            icon: <FiMessageSquare />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        }
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)] gap-8 animate-in fade-in duration-500">
            {/* Aptitude Module Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                    {/* Navigation Panel */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                            <h2 className="font-extrabold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                <span className="text-xl text-indigo-500"><FiCpu /></span> Learning Path
                            </h2>
                        </div>
                        <nav className="p-3 space-y-2">
                            <NavLink
                                to="/aptitude"
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-105'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                <span className="text-lg"><FiHome /></span> Home
                            </NavLink>

                            <div className="pt-4 pb-2 px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Modules
                            </div>

                            {categories.map((cat) => (
                                <NavLink
                                    key={cat.id}
                                    to={`/aptitude/${cat.id}`}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive || location.pathname.includes(`/aptitude/${cat.id}`)
                                            ? `${cat.bg} dark:bg-opacity-10 ${cat.color} shadow-sm transform translate-x-1 border border-transparent dark:border-${cat.color.split('-')[1]}-500/20`
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                        }`
                                    }
                                >
                                    <span className="text-lg">{cat.icon}</span>
                                    {cat.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* Progress / Daily Streak Widget */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform"><FiCheckCircle /></div>
                        <h3 className="font-bold text-lg mb-1 relative z-10">Daily Streak</h3>
                        <p className="text-indigo-100 text-xs mb-4 relative z-10">Keep your momentum going!</p>

                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <span className="text-3xl font-extrabold">3</span>
                            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full border border-white/10">Days</span>
                        </div>

                        <button className="w-full py-2 bg-white text-indigo-700 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all relative z-10">
                            Continue Learning
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    // Removed background/border from container to let content cards breathe on the gray background (Dashboard style)
                    className="min-h-full"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default AptitudeLayout;
