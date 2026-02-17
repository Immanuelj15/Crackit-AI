import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const PATTERN_DESCRIPTIONS = {
    'Two Pointers': 'Master array manipulation with two reference points.',
    'Sliding Window': 'Efficiently solve subarray operational problems.',
    'Binary Search': 'Search in sorted arrays in logarithmic time.',
    'Prefix Sum': 'Solve range sum queries instantly.',
    'Hashing': 'Utilize hash maps for O(1) lookups.',
    'Stack & Queue': 'LIFO and FIFO data structure applications.',
    'Linked List': 'Node manipulation and pointer management.',
    'Trees': 'Hierarchical data structures and traversals.',
    'Graphs': 'Nodes, edges, BFS, DFS, and shortest paths.',
    'Dynamic Programming': 'Optimize recursion with memoization.',
    'Greedy': 'Locally optimal choices for global solutions.',
    'Backtracking': 'Explore all possible solutions recursively.'
};

const CodingPractice = () => {
    // Initialize with default patterns immediately so it's never empty
    const [patterns, setPatterns] = useState(() =>
        Object.keys(PATTERN_DESCRIPTIONS).map(p => ({
            _id: p,
            count: 0
        }))
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatternCounts = async () => {
            try {
                // Try fetching real counts
                const { data } = await axios.get('/api/coding/patterns', { withCredentials: true });
                if (data && data.length > 0) {
                    setPatterns(prevPatterns => prevPatterns.map(p => {
                        const found = data.find(d => d._id === p._id);
                        return found ? { ...p, count: found.count } : p;
                    }));
                }
            } catch (error) {
                console.error("Error fetching pattern counts:", error);
                // No need to reset, we already have defaults
            } finally {
                setLoading(false);
            }
        };
        fetchPatternCounts();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0f1115] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>
            <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-40 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest"
                    >
                        Pattern Recognition
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6"
                    >
                        Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Patterns</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Don't memorize solutions. Recognize the underlying patterns that solve thousands of problems.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {patterns.map((pattern) => (
                        <motion.div key={pattern._id} variants={item}>
                            <Link
                                to={`/coding/${pattern._id}`}
                                className="group block h-full relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative h-full p-8 rounded-3xl bg-[#1a1d24]/80 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 group-hover:-translate-y-2 overflow-hidden">
                                    {/* Card Content */}
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                                {['🚀', '🔍', '🪟', '#️⃣', '🥞', '🔗', '🌲', '🕸️', '⚡', '🔙'][Math.floor(Math.random() * 10)]}
                                            </div>
                                            <span className="px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-xs font-mono text-gray-400 group-hover:text-emerald-400 transition-colors">
                                                {pattern.count} Problems
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                                            {pattern._id}
                                        </h3>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 group-hover:text-gray-400 transition-colors">
                                            {PATTERN_DESCRIPTIONS[pattern._id] || 'Master this fundamental coding pattern.'}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                            Start Practicing
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Decorative Overlay */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};


export default CodingPractice;
