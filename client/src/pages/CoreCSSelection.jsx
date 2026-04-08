import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    FiBox, FiCpu, FiDatabase, FiWifi,
    FiChevronRight, FiBookOpen, FiCheckCircle, FiLoader
} from 'react-icons/fi';

const subjectMeta = {
    'Object Oriented Programming (OOPS)': {
        icon: <FiBox />,
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-500/25',
        bg: 'bg-violet-500/10',
        text: 'text-violet-500',
        tag: 'OOPS',
    },
    'Operating Systems (OS)': {
        icon: <FiCpu />,
        gradient: 'from-sky-500 to-cyan-600',
        shadow: 'shadow-sky-500/25',
        bg: 'bg-sky-500/10',
        text: 'text-sky-500',
        tag: 'OS',
    },
    'Database Management Systems (DBMS)': {
        icon: <FiDatabase />,
        gradient: 'from-amber-500 to-orange-600',
        shadow: 'shadow-amber-500/25',
        bg: 'bg-amber-500/10',
        text: 'text-amber-500',
        tag: 'DBMS',
    },
    'Computer Networks (CN)': {
        icon: <FiWifi />,
        gradient: 'from-emerald-500 to-teal-600',
        shadow: 'shadow-emerald-500/25',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        tag: 'CN',
    },
};

const CoreCSSelection = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const { data } = await axios.get('/api/topics?category=core-cs', { withCredentials: true });
                setTopics(data);
            } catch (error) {
                console.error('Failed to fetch core CS topics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                    <FiLoader className="animate-spin text-indigo-500 w-8 h-8" />
                </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                            <FiBookOpen className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            CS Fundamentals
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-[52px]">
                        Master the core Computer Science subjects asked in every tech interview.
                    </p>
                </motion.div>

                {/* Subject Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {topics.map((topic, index) => {
                        const meta = subjectMeta[topic.name] || {
                            icon: <FiBookOpen />,
                            gradient: 'from-slate-500 to-slate-600',
                            shadow: 'shadow-slate-500/25',
                            bg: 'bg-slate-500/10',
                            text: 'text-slate-500',
                            tag: 'CS',
                        };

                        return (
                            <motion.div
                                key={topic._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                <Link
                                    to={`/core-cs/${topic._id}`}
                                    className="block group"
                                >
                                    <div className={`relative overflow-hidden bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/5 rounded-3xl p-7 transition-all duration-300 hover:border-transparent hover:shadow-2xl ${meta.shadow} hover:-translate-y-1`}>
                                        {/* Background Glow */}
                                        <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${meta.gradient} rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`} />

                                        {/* Tag */}
                                        <div className="flex items-center justify-between mb-5">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${meta.bg} ${meta.text}`}>
                                                {meta.tag}
                                            </span>
                                            {topic.progress?.completed && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                                                    <FiCheckCircle className="w-3 h-3" /> Studied
                                                </span>
                                            )}
                                        </div>

                                        {/* Icon & Title */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white text-2xl shadow-lg ${meta.shadow} group-hover:scale-110 transition-transform duration-300`}>
                                                {meta.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                                    {topic.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium line-clamp-2">
                                                    {topic.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                {topic.examples?.length || 0} Examples
                                            </span>
                                            <div className={`flex items-center gap-1 text-xs font-bold ${meta.text} group-hover:gap-2 transition-all`}>
                                                Study Now <FiChevronRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {topics.length === 0 && !loading && (
                    <div className="text-center py-20 text-slate-400">
                        <FiBookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="font-bold">No Core CS topics found.</p>
                        <p className="text-sm mt-1">Please run the seed script first.</p>
                    </div>
                )}
            </div>
    );
};

export default CoreCSSelection;
