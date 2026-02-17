import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const CodingProblemList = () => {
    const { pattern } = useParams();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axios.get(`/api/coding/patterns/${pattern}`, { withCredentials: true });
                setProblems(data);
            } catch (error) {
                console.error("Error fetching problems:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, [pattern]);

    const getDifficultyStyle = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans bg-gray-50 dark:bg-[#0f1115] transition-colors duration-300">
            <div className="flex items-center mb-12">
                <Link to="/coding" className="mr-6 p-3 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-[#252830] text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-all shadow-lg shadow-black/5 dark:shadow-black/20 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 tracking-tight mb-2">
                        {pattern} Problems
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                        Master <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{pattern}</span> with our curated list of hand-picked problems.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : problems.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#1a1d24] rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 shadow-sm">
                    <p className="text-gray-500 text-lg">No problems added for this pattern yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {problems.map((problem, idx) => (
                        <motion.div
                            key={problem._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-[#1a1d24] hover:bg-gray-50 dark:hover:bg-[#1f2229] rounded-2xl p-6 border border-gray-200 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                                            {problem.title}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDifficultyStyle(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {problem.companies && problem.companies.map(company => (
                                            <span key={company._id} className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-black/30 text-gray-600 dark:text-gray-500 border border-gray-200 dark:border-white/5">
                                                {company.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <Link
                                    to={`/coding/problem/${problem.slug}`}
                                    className="px-8 py-3 bg-gray-900 dark:bg-gray-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-gray-100 dark:text-gray-300 hover:text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-indigo-500/25 border border-transparent whitespace-nowrap text-center transform group-hover:scale-105"
                                >
                                    Solve Problem
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CodingProblemList;
