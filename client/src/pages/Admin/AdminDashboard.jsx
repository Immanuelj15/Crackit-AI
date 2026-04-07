import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUsers, FiCode, FiBookOpen, FiActivity, FiArrowUpRight, FiClock } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/admin/stats', { withCredentials: true });
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    const cards = [
        { label: 'Total Students', value: stats?.studentCount || 0, icon: <FiUsers />, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Coding Problems', value: stats?.codingCount || 0, icon: <FiCode />, color: 'bg-emerald-500', trend: '+5%' },
        { label: 'Aptitude Questions', value: stats?.aptitudeCount || 0, icon: <FiBookOpen />, color: 'bg-orange-500', trend: '+8%' },
    ];

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Workbench</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Overview of your platform's health</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <FiClock className="text-indigo-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500"
                    >
                        <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                            {card.icon}
                        </div>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.label}</h3>
                                <div className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</div>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                                <FiArrowUpRight /> {card.trend}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm h-80 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <FiActivity size={32} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-400 uppercase text-xs tracking-[3px] mb-2">Platform Activity</h4>
                        <p className="text-slate-300 italic text-sm">Activity visualization coming soon...</p>
                    </div>
                </div>
                
                <div className="bg-indigo-600 p-10 rounded-[40px] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                        <FiBookOpen size={160} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Ready to expand<br/>the curriculum?</h2>
                        <p className="text-indigo-100 text-sm font-medium max-w-xs leading-relaxed">
                            Add new coding challenges or aptitude questions to keep the students engaged and updated with industry standards.
                        </p>
                        <button 
                            onClick={() => window.location.href = '/admin/coding/add'}
                            className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-lg"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
