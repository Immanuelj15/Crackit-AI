import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import ChatBot from '../components/ChatBot';
import DarkModeToggle from '../components/DarkModeToggle';
import { FaRocket, FaBuilding, FaCode, FaChartLine } from 'react-icons/fa';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const features = [
        {
            icon: <FaRocket className="text-4xl text-sky-500 dark:text-sky-400" />,
            title: "AI Mock Interviews",
            description: "Practice with our intelligent AI interviewer that adapts to your responses and provides real-time feedback."
        },
        {
            icon: <FaBuilding className="text-4xl text-blue-500 dark:text-blue-400" />,
            title: "Company Archives",
            description: "Access curated interview questions from top tech giants like Google, Amazon, and Microsoft."
        },
        {
            icon: <FaCode className="text-4xl text-green-500 dark:text-green-400" />,
            title: "Technical & Aptitude",
            description: "Master both coding challenges and aptitude tests with our comprehensive question bank."
        },
        {
            icon: <FaChartLine className="text-4xl text-purple-500 dark:text-purple-400" />,
            title: "Performance Analytics",
            description: "Track your progress and identify areas for improvement with detailed performance analytics."
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-2xl font-bold text-sky-600 dark:text-white tracking-wider">CrackIt AI</div>
                <div className="flex items-center space-x-4">
                    <DarkModeToggle />
                    <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-white transition-colors font-medium">Log in</Link>
                    <Link to="/register" className="bg-sky-500 dark:bg-sky-600 text-white px-6 py-2 rounded-full font-bold hover:bg-sky-600 dark:hover:bg-sky-700 transition-colors shadow-lg">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 leading-tight"
                    >
                        Master Your Next <br /> Tech Interview
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        Your personal AI-powered interview coach. Practice real questions from top companies and get instant, personalized feedback.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex justify-center gap-4"
                    >
                        <Link to="/register" className="bg-sky-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-sky-600 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                            Start Practicing Now
                        </Link>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 * index + 0.6 }}
                            className="bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 p-8 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 shadow-lg dark:shadow-none"
                        >
                            <div className="mb-6">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            <ChatBot />
        </div>
    );
};

export default LandingPage;
