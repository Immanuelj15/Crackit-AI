import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionCard = ({ question, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 pr-4">
                    <span className="text-sky-500 mr-2">Q{index + 1}.</span>
                    {question.questionText}
                </h3>
                {question.difficulty && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)} capitalize shrink-0`}>
                        {question.difficulty}
                    </span>
                )}
            </div>

            {question.options && question.options.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {question.options.map((opt, i) => (
                        <li key={i} className="bg-white/50 dark:bg-black/20 px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5">
                            {opt}
                        </li>
                    ))}
                </ul>
            )}

            <div className="pt-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center transition-colors focus:outline-none"
                >
                    {isOpen ? 'Hide Answer' : 'Show Answer'}
                    <svg
                        className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-3 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800/50">
                                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                    <span className="font-semibold block mb-1 text-sky-700 dark:text-sky-300">Answer:</span>
                                    {question.correctAnswer}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default QuestionCard;
