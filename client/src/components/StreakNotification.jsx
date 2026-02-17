import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiX } from 'react-icons/fi';
import { useEffect } from 'react';

const StreakNotification = ({ isOpen, onClose, streak, message }) => {

    // Auto close after 3 seconds
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border-4 border-orange-500 pointer-events-auto relative overflow-hidden max-w-sm w-full text-center"
                    >
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 z-0"></div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"
                        ></motion.div>

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.1, type: "spring" }}
                                className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center text-4xl text-white mx-auto mb-4 shadow-lg transform rotate-3"
                            >
                                <FiZap />
                            </motion.div>

                            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                                Streak Updated!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">
                                {message || "You're on fire! Keep it up."}
                            </p>

                            <div className="bg-orange-50 dark:bg-orange-900/30 py-3 rounded-xl border border-orange-100 dark:border-orange-800">
                                <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest block mb-1">Current Streak</span>
                                <span className="text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-2">
                                    {streak} <span className="text-2xl">🔥</span>
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StreakNotification;
