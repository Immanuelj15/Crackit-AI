import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get('/api/companies', { withCredentials: true });
                setCompanies(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Failed to fetch companies:", error);
                setError("Failed to load companies. Please refresh.");
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen transition-colors duration-300">
            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-10">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        Target Companies
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-2 text-gray-600 dark:text-gray-400"
                    >
                        Browser and select your dream company to start preparation.
                    </motion.p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-sky-600 dark:text-sky-400 font-bold text-xl animate-pulse">
                        Loading Companies...
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800 text-center">
                        {error}
                    </div>
                ) : (
                    <motion.main
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {companies.length === 0 ? (
                            <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/10">
                                <p className="text-gray-500 dark:text-gray-400">No companies found yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {companies.map((company) => (
                                    <motion.div key={company._id} variants={itemVariants}>
                                        <Link to={`/company/${company._id}`} className="block h-full group relative">
                                            {/* Hover Gradient Glow Effect */}
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 will-change-transform" />

                                            <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden hover:border-sky-100 dark:hover:border-white/20 transition-all duration-300 h-full flex flex-col shadow-sm hover:shadow-xl dark:shadow-none">
                                                <div className="px-6 py-8 flex-1">
                                                    <div className="flex items-center mb-6">
                                                        <div className="relative">
                                                            {/* Logo Container with subtle glow */}
                                                            <div className="absolute inset-0 bg-sky-200 dark:bg-sky-500 blur-lg opacity-20 rounded-full" />
                                                            {company.logoUrl
                                                                ? <img className="relative h-16 w-16 rounded-xl shadow-sm border border-gray-50 bg-white p-2 object-contain" src={company.logoUrl} alt="" />
                                                                : <div className="relative h-16 w-16 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-inner">{company.name[0]}</div>
                                                            }
                                                        </div>

                                                        <div className="ml-5">
                                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{company.name}</h3>
                                                            <div className="flex items-center mt-1.5 space-x-2">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-700/50">
                                                                    {company.rounds?.length || 0} Rounds
                                                                </span>
                                                                {['Amazon', 'Google', 'Microsoft'].includes(company.name) && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
                                                                        Tier 1
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                                        {company.description}
                                                    </p>
                                                </div>

                                                {/* Footer */}
                                                <div className="px-6 py-4 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex justify-between items-center group-hover:bg-sky-50/50 dark:group-hover:bg-white/5 transition-colors">
                                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-sky-600 dark:group-hover:text-sky-300">Start Preparation</span>
                                                    <div className="h-8 w-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-110 transition-all">
                                                        <span className="text-sky-500 dark:text-gray-200 group-hover:text-sky-600 text-lg">→</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.main>
                )}
            </div>
        </div>
    );
};

export default Companies;
