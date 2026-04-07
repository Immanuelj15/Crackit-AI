import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiCode, FiBookOpen, FiLogOut, FiPieChart, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <FiPieChart /> },
        { path: '/admin/students', label: 'Students', icon: <FiUsers /> },
        { path: '/admin/coding', label: 'Coding Problems', icon: <FiCode /> },
        { path: '/admin/aptitude', label: 'Aptitude Questions', icon: <FiBookOpen /> },
        { path: '/admin/feedback', label: 'Feedback', icon: <FiMessageSquare /> },
    ];

    return (
        <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-2xl z-50">
            <div className="p-8 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-black">AD</div>
                    <span className="font-black text-lg tracking-tighter uppercase">Admin Panel</span>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-6 px-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-400">
                        {user?.name?.[0]}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-black truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Administrator</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-slate-800 hover:bg-rose-600 transition-colors text-xs font-black uppercase tracking-widest"
                >
                    <FiLogOut /> Sign Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
