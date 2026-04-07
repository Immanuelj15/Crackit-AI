import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiCode, FiArrowRight, FiChevronRight, FiEdit2, FiTrash2, FiAward, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminCodingProblems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [diffFilter, setDiffFilter] = useState('All');
    const [patternFilter, setPatternFilter] = useState('All');
    const [actionLoading, setActionLoading] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchProblems();
    }, []);

    const uniquePatterns = ['All', ...new Set(problems.map(p => p.pattern).filter(Boolean))];

    const fetchProblems = async () => {
        try {
            const { data } = await axios.get('/api/admin/coding-problems', { withCredentials: true });
            setProblems(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching coding problems:', error);
            setLoading(false);
        }
    };

    const handleSetDaily = async (id) => {
        setActionLoading(id);
        try {
            await axios.post('/api/admin/set-daily-challenge', { id }, { withCredentials: true });
            // Update local state
            setProblems(problems.map(p => {
                if (p._id === id) return { ...p, dailyChallengeDate: today };
                if (p.dailyChallengeDate === today) return { ...p, dailyChallengeDate: null };
                return p;
            }));
            alert('Daily challenge updated successfully!');
        } catch (error) {
            alert('Failed to set daily challenge');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredProblems = (Array.isArray(problems) ? problems : []).filter(p => {
        const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || 
                             p.pattern?.toLowerCase().includes(search.toLowerCase());
        const matchesDiff = diffFilter === 'All' || p.difficulty === diffFilter;
        const matchesPattern = patternFilter === 'All' || p.pattern === patternFilter;
        return matchesSearch && matchesDiff && matchesPattern;
    });

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">Coding Lab</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage algorithmic challenges and test cases</p>
                </div>
                <Link 
                    to="/admin/coding/add"
                    className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-indigo-600/20"
                >
                    <FiPlus className="text-lg" />
                    New Coding Challenge
                </Link>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-white/5 space-y-6 bg-slate-50/50 dark:bg-black/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative w-full max-w-md">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Find a problem by name or category..."
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 pl-14 pr-6 py-4 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-colors font-bold dark:text-white shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                                {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDiffFilter(d)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${diffFilter === d ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-500'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                            <select 
                                value={patternFilter}
                                onChange={(e) => setPatternFilter(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none focus:border-indigo-500 shadow-sm"
                            >
                                {uniquePatterns.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            Showing {filteredProblems.length} of {problems.length} Challenges
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center text-indigo-500 font-black animate-pulse uppercase tracking-[3px]">Loading Knowledge Base...</div>
                    ) : filteredProblems.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="px-8 py-5">Challenge</th>
                                    <th className="px-8 py-5">Pattern</th>
                                    <th className="px-8 py-5">Difficulty</th>
                                    <th className="px-8 py-5">Today's Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                {filteredProblems.map((p) => {
                                    const isDaily = p.dailyChallengeDate === today;
                                    return (
                                        <tr key={p._id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isDaily ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                                        <FiCode />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.title}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">slug: {p.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">{p.pattern}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${p.difficulty === 'Easy' ? 'text-emerald-500' : p.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'}`}>
                                                    {p.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {isDaily ? (
                                                    <div className="flex items-center gap-2 text-indigo-500 font-black text-[9px] uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
                                                        <FiAward /> Daily Challenge
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-300">Available</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!isDaily && (
                                                        <button 
                                                            disabled={actionLoading === p._id}
                                                            onClick={() => handleSetDaily(p._id)}
                                                            className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                                                        >
                                                            {actionLoading === p._id ? '...' : <><FiCheck /> Set Daily</>}
                                                        </button>
                                                    )}
                                                    <button className="p-2.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-xl transition-all">
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-32 text-center text-slate-300 flex flex-col items-center">
                            <FiCode size={60} className="opacity-20 mb-6" />
                            <h3 className="font-black uppercase tracking-widest">Knowledge Pipeline Empty</h3>
                            <p className="text-xs font-bold opacity-50 uppercase tracking-tighter">No problems found matching your search</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCodingProblems;
