import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '../components/QuestionCard';
import DarkModeToggle from '../components/DarkModeToggle';

const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [activeTab, setActiveTab] = useState('aptitude'); // aptitude, coding, technical, hr
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const { data } = await axios.get(`/api/companies/${id}`, { withCredentials: true });
                setCompany(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCompany();
    }, [id]);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/questions?company=${id}&type=${activeTab}`, { withCredentials: true });
                setQuestions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [id, activeTab]);

    if (!company) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-sky-200 dark:bg-sky-800 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'aptitude', label: 'Aptitude' },
        { id: 'coding', label: 'Coding' },
        { id: 'technical', label: 'Technical' },
        { id: 'hr', label: 'HR Interview' }
    ];

    return (
        <div className="min-h-screen transition-colors duration-300 pb-20">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
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

            {/* Hero Section */}
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-900 dark:to-blue-900 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl text-white"
                >
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-4 rounded-2xl shadow-lg shrink-0"
                        >
                            {company.logoUrl
                                ? <img src={company.logoUrl} alt={company.name} className="w-24 h-24 object-contain" />
                                : <div className="w-24 h-24 flex items-center justify-center text-4xl font-bold text-sky-600 bg-sky-50 rounded-xl">{company.name[0]}</div>
                            }
                        </motion.div>

                        <div className="text-center md:text-left">
                            <motion.h1
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
                            >
                                {company.name}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-blue-100 max-w-2xl leading-relaxed"
                            >
                                {company.description}
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar: Hiring Pattern */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-white/5 rounded-2xl p-6 shadow-lg sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-lg text-sky-600 dark:text-sky-400 mr-3">
                                🚀
                            </span>
                            Hiring Rounds
                        </h2>

                        {/* Visual Rounds Timeline */}
                        {company.rounds && company.rounds.length > 0 && (
                            <div className="mb-8 ml-2 relative border-l-2 border-sky-100 dark:border-sky-900 space-y-8">
                                {company.rounds.map((round, idx) => (
                                    <div key={idx} className="relative pl-6 group">
                                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-sky-200 dark:bg-sky-700 group-hover:bg-sky-500 transition-colors"></div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                                {round.name}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {round.description}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <hr className="my-6 border-gray-100 dark:border-gray-700" />

                        <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4">
                            Detailed Pattern
                        </h3>

                        <div className="prose dark:prose-invert prose-sm prose-sky max-w-none text-gray-600 dark:text-gray-300">
                            {company.hiringPattern?.split('\n').filter(line => line.trim() !== '').map((line, i) => {
                                // Header styling
                                if (line.startsWith('##')) {
                                    // Skip headers in markdown if we have visual rounds, mostly to avoid redundancy if title matches, but keeping for completeness
                                    return null;
                                }

                                // Bold text parsing within lines (e.g., "1. **Round:** Desc")
                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                return (
                                    <p key={i} className="mb-2 leading-relaxed">
                                        {parts.map((part, index) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={index} className="text-gray-900 dark:text-white font-semibold">{part.slice(2, -2)}</strong>;
                                            }
                                            return part;
                                        })}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Main Content: Questions */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-1.5 rounded-xl flex space-x-1 mb-8 overflow-x-auto shadow-inner border border-white/20 dark:border-white/5">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative flex-1 py-2.5 px-4 text-sm font-medium rounded-lg capitalize whitespace-nowrap transition-all duration-200
                                    ${activeTab === tab.id
                                        ? 'text-sky-700 dark:text-sky-300 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }
                                `}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg"
                                        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Aptitude CTA Banner */}
                    {activeTab === 'aptitude' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200 dark:border-orange-700/50 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⚡</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100">Ace the First Round!</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Most service companies (TCS, Wipro, etc.) start with an Aptitude Test. Practice with our dedicated module.
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/aptitude"
                                className="whitespace-nowrap px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-sm transition-all text-sm"
                            >
                                Go to Aptitude Zone →
                            </Link>
                        </motion.div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-4 min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-500 dark:text-gray-400 animate-pulse">Fetching questions...</p>
                            </div>
                        ) : questions.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/20 dark:border-white/10"
                            >
                                <div className="text-6xl mb-4">🤔</div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
                                <p className="text-gray-500 dark:text-gray-400">We haven't added any {activeTab} questions for {company.name} yet.</p>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    {questions.map((q, idx) => (
                                        <QuestionCard key={q._id} question={q} index={idx} />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
