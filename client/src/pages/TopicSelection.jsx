import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import DarkModeToggle from '../components/DarkModeToggle';

const TopicSelection = () => {
    const { category } = useParams(); // 'quant', 'logical', 'verbal'
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryNames = {
        'quant': 'Quantitative Aptitude',
        'logical': 'Logical Reasoning',
        'verbal': 'Verbal Ability'
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const { data } = await axios.get(`/api/topics?category=${category}`, { withCredentials: true });
                setTopics(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, [category]);

    return (
        <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-gray-900 dark:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/aptitude" className="flex items-center text-sky-600 dark:text-sky-400 font-medium hover:text-sky-700 dark:hover:text-sky-300 transition-colors group">
                                <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                                Back to Categories
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <header className="mb-12 text-center md:text-left">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
                    >
                        {categoryNames[category]}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl"
                    >
                        Master each topic with detailed study notes, examples, and practice sets.
                    </motion.p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {topics.map((topic, idx) => (
                            <motion.div
                                key={topic._id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="group relative"
                            >
                                <Link to={`/aptitude/${category}/${topic._id}`} className="block h-full">
                                    {/* Glow Effect */}
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${topic.progress ? 'from-green-400 to-emerald-600' : 'from-sky-400 to-indigo-600'} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 will-change-transform`} />

                                    <div className="relative bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl p-6 sm:p-8 h-full flex flex-col shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300">
                                        <div className="mb-6 flex items-start justify-between">
                                            <div className={`p-3 rounded-xl ${topic.progress ? 'bg-green-50 dark:bg-green-900/30' : 'bg-sky-50 dark:bg-sky-900/30'}`}>
                                                <span className="text-3xl">
                                                    {category === 'quant' ? '📊' : category === 'logical' ? '🧩' : '🗣️'}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md ${topic.progress ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500'}`}>
                                                {topic.progress ? 'Completed' : `Topic ${idx + 1}`}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                            {topic.name}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-400 text-sm flex-1 leading-relaxed mb-6 line-clamp-3">
                                            {topic.description}
                                        </p>

                                        {topic.progress ? (
                                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400">Best Score</span>
                                                    <span className="font-bold text-green-600 dark:text-green-400">{Math.round(topic.progress.accuracy)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${topic.progress.accuracy}%` }}></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-1 transition-transform mt-auto text-sm">
                                                Start Learning
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TopicSelection;
