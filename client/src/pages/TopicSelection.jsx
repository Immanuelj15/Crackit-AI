import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiBarChart2, FiCpu, FiMessageSquare, FiChevronRight, FiCheckCircle, FiFrown, FiTarget, FiTrendingUp, FiActivity, FiZap } from 'react-icons/fi';

const TopicSelection = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [streak, setStreak] = useState(0);

    const categoryConfig = {
        'quant': {
            label: 'Quantitative Aptitude',
            icon: <FiBarChart2 />,
            color: 'from-blue-500 to-cyan-500',
            lightBg: 'bg-blue-50',
            accent: 'text-blue-600',
            desc: 'Master the numbers game.'
        },
        'logical': {
            label: 'Logical Reasoning',
            icon: <FiCpu />,
            color: 'from-violet-500 to-purple-500',
            lightBg: 'bg-violet-50',
            accent: 'text-violet-600',
            desc: 'Think clearly and rationally.'
        },
        'verbal': {
            label: 'Verbal Ability',
            icon: <FiMessageSquare />,
            color: 'from-emerald-500 to-teal-500',
            lightBg: 'bg-emerald-50',
            accent: 'text-emerald-600',
            desc: 'Master the art of language.'
        }
    };

    useEffect(() => {
        if (category) {
            const fetchTopics = async () => {
                setLoading(true);
                try {
                    const { data } = await axios.get(`/api/topics?category=${category}`, { withCredentials: true });
                    setTopics(data);

                    // Fetch Streak
                    const streakRes = await axios.get('/api/user/streak', { withCredentials: true });
                    setStreak(streakRes.data.streak);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTopics();
        }
    }, [category]);

    const handleCategoryChange = (cat) => navigate(`/aptitude/${cat}`);

    // DEFAULT LANDING: Choose Category
    if (!category) {
        return (
            <div className="max-w-6xl mx-auto py-8">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                        Ace Your Aptitude
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Select a domain to begin your practice session.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {Object.entries(categoryConfig).map(([key, config]) => (
                        <Link key={key} to={`/aptitude/${key}`} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center text-center transform group-hover:-translate-y-2 transition-transform duration-300">
                                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-4xl text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {config.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{config.label}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">{config.desc}</p>
                                <span className={`mt-auto px-6 py-2 rounded-full font-bold text-sm bg-gray-50 dark:bg-gray-700 ${config.accent} dark:text-white group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                                    Start Practice
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    const currentConfig = categoryConfig[category];

    // TOPIC DASHBOARD
    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto min-h-[80vh]">

            {/* SIDEBAR */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-6">

                {/* Stats Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 relative z-10">Your Progress</h3>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl">
                            <FiZap />
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{streak}</div>
                            <div className="text-xs font-bold text-gray-500">Day Streak</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Categories</h3>
                    <div className="space-y-1">
                        {Object.entries(categoryConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => handleCategoryChange(key)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all
                                    ${category === key
                                        ? `bg-gradient-to-r ${config.color} text-white shadow-md`
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <span className="text-lg">{config.icon}</span>
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{currentConfig.label}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{currentConfig.desc}</p>
                    </div>
                    <span className="bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                        {topics.length} Topics
                    </span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : topics.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {topics.map((topic, idx) => {
                            const isCompleted = topic.progress?.accuracy > 0;
                            return (
                                <Link
                                    key={topic._id}
                                    to={`/aptitude/${category}/${topic._id}`}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none -z-10"></div>
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-10 h-10 rounded-lg ${currentConfig.lightBg} dark:bg-gray-700 flex items-center justify-center ${currentConfig.accent} dark:text-white text-lg`}>
                                                {currentConfig.icon}
                                            </div>
                                            {isCompleted && (
                                                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1.5 rounded-full">
                                                    <FiCheckCircle />
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{topic.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-1 border-b border-gray-50 dark:border-gray-700/50 pb-4">
                                            {topic.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            {isCompleted ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Accuracy</span>
                                                    <span className={`text-sm font-extrabold ${topic.progress.accuracy >= 80 ? 'text-green-500' : 'text-orange-500'}`}>
                                                        {Math.round(topic.progress.accuracy)}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400">Not Started</span>
                                            )}

                                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <FiChevronRight />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <FiFrown className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No topics found for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicSelection;
