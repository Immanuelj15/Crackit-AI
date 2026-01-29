import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DarkModeToggle from '../components/DarkModeToggle';

const AptitudePractice = () => {
    const categories = [
        {
            id: 'quant',
            title: 'Quantitative Aptitude',
            description: 'Test your numerical ability, mathematical thinking, and problem-solving speed.',
            icon: '📊',
            color: 'from-orange-400 to-pink-500'
        },
        {
            id: 'logical',
            title: 'Logical Reasoning',
            description: 'Enhance your ability to analyze patterns, sequences, and relationships.',
            icon: '🧩',
            color: 'from-blue-400 to-indigo-500'
        },
        {
            id: 'verbal',
            title: 'Verbal Ability',
            description: 'Improve your English grammar, vocabulary, and comprehension skills.',
            icon: '🗣️',
            color: 'from-emerald-400 to-teal-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/dashboard" className="flex items-center text-sky-600 dark:text-sky-400 font-medium hover:text-sky-700 dark:hover:text-sky-300 transition-colors group">
                            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4"
                    >
                        Aptitude Practice Zone
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Master the essential skills required for placement exams. Select a category to start a timed practice test.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
                        >
                            <div className={`h-2 w-full bg-gradient-to-r ${cat.color}`}></div>
                            <div className="p-8 flex-1 flex flex-col items-center text-center">
                                <div className="text-6xl mb-6">{cat.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{cat.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 flex-1">
                                    {cat.description}
                                </p>
                                <Link
                                    to={`/aptitude/${cat.id}`}
                                    className={`w-full py-3 px-6 rounded-xl text-white font-medium bg-gradient-to-r ${cat.color} hover:shadow-lg transform transition-all duration-200 active:scale-95`}
                                >
                                    Start Learning
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AptitudePractice;
