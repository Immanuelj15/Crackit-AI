import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiCpu, FiMessageSquare, FiCheck, FiArrowRight } from 'react-icons/fi';

const TopicSelection = () => {
    const { category } = useParams(); // Optional: 'quant', 'logical', 'verbal'
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);

    const categoryConfig = {
        'quant': {
            label: 'Quantitative Aptitude',
            icon: <FiBarChart2 />,
            color: 'from-blue-500 to-cyan-400',
            bg: 'bg-blue-50',
            borderColor: 'border-blue-100',
            description: 'Master numbers, arithmetic, and data interpretation.'
        },
        'logical': {
            label: 'Logical Reasoning',
            icon: <FiCpu />,
            color: 'from-purple-500 to-indigo-400',
            bg: 'bg-purple-50',
            borderColor: 'border-purple-100',
            description: 'Enhance your critical thinking and problem-solving skills.'
        },
        'verbal': {
            label: 'Verbal Ability',
            icon: <FiMessageSquare />,
            color: 'from-emerald-500 to-teal-400',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
            description: 'Improve your vocabulary and grammar proficiency.'
        }
    };

    // Animation Config
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        if (category) {
            const fetchTopics = async () => {
                setLoading(true);
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
        }
    }, [category]);

    // VIEW 1: All Categories (Aptitude Home)
    if (!category) {
        return (
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Start Your Journey</h1>
                    <p className="text-gray-500 text-lg">Select a learning path to begin practicing.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(categoryConfig).map(([key, config]) => (
                        <Link key={key} to={`/aptitude/${key}`} className="group h-full">
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="h-full bg-white rounded-3xl p-1 shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden relative"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                <div className="p-8 h-full flex flex-col items-center text-center relative z-10">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-4xl text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {config.icon}
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">
                                        {config.label}
                                    </h3>

                                    <p className="text-gray-500 mb-8 leading-relaxed">
                                        {config.description}
                                    </p>

                                    <div className="mt-auto">
                                        <div className={`px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r ${config.color} text-white shadow-md transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300`}>
                                            Start Learning
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // VIEW 2: Specific Topics Grid (Modern Card Style)
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{categoryConfig[category]?.label}</h1>
                    <p className="text-gray-500">Choose a topic to master.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-500 shadow-sm">
                        {topics.length} Topics
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-sky-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {topics.map((topic, idx) => {
                        const isCompleted = topic.progress?.accuracy > 0;
                        return (
                            <motion.div
                                key={topic._id}
                                variants={itemVariants}
                                className="group relative"
                            >
                                <Link to={`/aptitude/${category}/${topic._id}`} className="block h-full">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full shadow-sm hover:shadow-xl hover:border-sky-100 transition-all duration-300 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-xl ${categoryConfig[category].bg} text-2xl text-gray-700`}>
                                                {categoryConfig[category].icon}
                                            </div>
                                            {isCompleted ? (
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                    <FiCheck /> DONE
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors flex items-center gap-1">
                                                    START <FiArrowRight />
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-1">
                                            {topic.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
                                            {topic.description}
                                        </p>

                                        {/* Progress Bar or Action */}
                                        <div className="mt-auto">
                                            {isCompleted ? (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs font-bold text-gray-400">
                                                        <span>Proficiency</span>
                                                        <span className="text-gray-800">{Math.round(topic.progress.accuracy)}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                                            style={{ width: `${topic.progress.accuracy}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full py-2.5 rounded-lg border-2 border-gray-100 text-center font-bold text-sm text-gray-400 group-hover:border-sky-500 group-hover:text-sky-600 group-hover:bg-sky-50 transition-all">
                                                    Practice Now
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {!loading && topics.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <div className="text-4xl mb-4 text-gray-400"><FiCpu /></div>
                    <p>No topics found in this section yet.</p>
                </div>
            )}
        </div>
    );
};

export default TopicSelection;
