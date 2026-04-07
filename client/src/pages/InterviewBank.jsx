import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiBriefcase, FiZap, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import DarkModeToggle from '../components/DarkModeToggle';

const InterviewBank = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/interviews?search=${searchTerm}&category=${category === 'All' ? '' : category}`);
                setQuestions(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [searchTerm, category]);

    const categories = ['All', 'Technical', 'Behavioral', 'System Design', 'HR'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                            <FiBriefcase size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Interview Bank</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Real company questions</p>
                        </div>
                    </div>
                    <DarkModeToggle />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-10">
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by question, topic or tag..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${category === c
                                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question List */}
                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800"></div>
                        ))
                    ) : questions.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No questions found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        questions.map((q, idx) => (
                            <motion.div
                                key={q._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1.5 overflow-hidden">
                                            {q.company?.logoUrl
                                                ? <img src={q.company.logoUrl} alt="" className="w-full h-full object-contain" />
                                                : <FiZap className="text-slate-400" />
                                            }
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-sky-600 tracking-widest">{q.category}</span>
                                            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400">{q.company?.name || 'Top Company'}</h4>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                                            q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                                                'bg-rose-100 text-rose-600 dark:bg-rose-900/30'
                                        }`}>
                                        {q.difficulty}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-sky-600 transition-colors">
                                    {q.question}
                                </h3>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex gap-2">
                                        {q.tags?.map(t => (
                                            <span key={t} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">#{t}</span>
                                        ))}
                                    </div>
                                    <button className="flex items-center gap-1 text-xs font-black text-sky-600 uppercase tracking-tighter group/btn">
                                        View Solution <FiChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewBank;
