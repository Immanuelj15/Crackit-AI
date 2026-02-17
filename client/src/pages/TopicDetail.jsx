import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiChevronRight, FiChevronLeft, FiAlertCircle, FiAward, FiHelpCircle, FiPenTool, FiClock, FiCheckCircle, FiXCircle, FiTarget, FiPause, FiPlay, FiZap, FiBarChart2, FiCpu, FiMessageSquare } from 'react-icons/fi';
import Whiteboard from '../components/Whiteboard';
import StreakNotification from '../components/StreakNotification';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const TopicDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const topicId = params.topicId || params.id;
    const category = params.category;
    const [topic, setTopic] = useState(null);
    const [activeTab, setActiveTab] = useState('study'); // study, practice, test
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(0);
    const [showStreakModal, setShowStreakModal] = useState(false);
    const [streakMessage, setStreakMessage] = useState('');

    const categoryConfig = {
        'quant': { label: 'Quantitative Aptitude', icon: <FiBarChart2 />, color: 'from-blue-500 to-cyan-500' },
        'logical': { label: 'Logical Reasoning', icon: <FiCpu />, color: 'from-violet-500 to-purple-500' },
        'verbal': { label: 'Verbal Ability', icon: <FiMessageSquare />, color: 'from-emerald-500 to-teal-500' }
    };

    const handleCategoryChange = (cat) => navigate(`/aptitude/${cat}`);

    // Practice State
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
    const [showSolution, setShowSolution] = useState(false);
    const [practiceAnswers, setPracticeAnswers] = useState({});
    const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [practiceTimer, setPracticeTimer] = useState(0);
    const [isTimerPaused, setIsTimerPaused] = useState(false);

    // Timer Logic for Practice Mode
    useEffect(() => {
        let interval;
        if (activeTab === 'practice' && !isTimerPaused) {
            interval = setInterval(() => {
                setPracticeTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTab, isTimerPaused]);

    // Test State
    const [testConfig, setTestConfig] = useState({ count: 10, time: 20 });
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [testQuestions, setTestQuestions] = useState([]);
    const [testAnswers, setTestAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [testSubmitted, setTestSubmitted] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const timerRef = useRef(null);

    const tabs = [
        { id: 'study', label: 'Study', icon: '📖' },
        { id: 'practice', label: 'Practice', icon: '📝' },
        { id: 'test', label: 'Test', icon: '⚡' }
    ];

    useEffect(() => {
        const fetchTopicAndStreak = async () => {
            try {
                const { data } = await axios.get(`/api/topics/${topicId}`, { withCredentials: true });
                setTopic(data);

                const qRes = await axios.get(`/api/questions?category=${category}`, { withCredentials: true });
                const allQs = qRes.data.filter(q => q.topic === topicId);
                setPracticeQuestions(allQs);
                setPracticeAnswers({});

                // Fetch Streak
                const streakRes = await axios.get('/api/user/streak', { withCredentials: true });
                setStreak(streakRes.data.streak);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopicAndStreak();
    }, [topicId, category]);

    const handleStreakUpdate = async () => {
        try {
            const { data } = await axios.post('/api/user/streak', {}, { withCredentials: true });
            if (data.updated) {
                setStreak(data.streak);
                setStreakMessage(data.message);
                setShowStreakModal(true);
            }
        } catch (error) {
            console.error("Streak update error", error);
        }
    };

    const startTest = () => {
        const shuffled = [...practiceQuestions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, testConfig.count);
        setTestQuestions(selected);
        setTimeLeft(testConfig.time * 60);
        setIsTestStarted(true);
        setTestSubmitted(false);
        setTestResult(null);
        setTestAnswers({});

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    submitTest(selected, {});
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const submitTest = async (questions = testQuestions, answers = testAnswers) => {
        clearInterval(timerRef.current);

        const total = questions.length;
        let correct = 0;
        questions.forEach(q => { if (answers[q._id] === q.correctAnswer) correct++; });
        const wrong = total - correct;
        const timeTaken = (testConfig.time * 60) - timeLeft;

        // Set local result IMMEDIATELY to prevent null crash during async wait
        const localResult = {
            score: correct,
            totalQuestions: total,
            correctAnswers: correct,
            wrongAnswers: wrong,
            timeTaken: timeTaken,
            accuracy: (correct / total) * 100,
            averageTimePerQuestion: timeTaken / total,
            aiFeedback: "Generating AI analysis..."
        };
        setTestResult(localResult);
        setTestSubmitted(true);

        try {
            const resultData = { topicId, category, ...localResult, answers };
            const { data } = await axios.post('/api/topics/result', resultData, { withCredentials: true });
            setTestResult(data);
            // Update Streak on completion
            handleStreakUpdate();
        } catch (error) { console.error("Result save failed", error); }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!topic) return <div>Topic not found</div>;

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

            {/* MAIN CONTENT */}
            <div className="flex-1">
                <div className="space-y-8">
                    {/* Header Area */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                <Link to="/aptitude" className="hover:text-sky-600">Aptitude</Link>
                                <FiChevronRight className="text-xs" />
                                <Link to={`/aptitude/${category}`} className="capitalize hover:text-sky-600">{category}</Link>
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900">{topic.name}</h1>
                            <p className="text-gray-500 mt-1">{topic.description}</p>
                        </div>
                    </div>

                    {/* Modern Pill Tabs */}
                    <div className="flex p-1 space-x-1 bg-gray-100/80 rounded-xl w-full md:w-fit font-bold text-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                            relative flex items-center gap-2 py-2.5 px-6 rounded-lg transition-all duration-300
                            ${activeTab === tab.id ? 'text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}
                        `}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-white rounded-lg shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 text-lg">{tab.icon}</span>
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[400px]"
                        >
                            {/* STUDY MODE */}
                            {activeTab === 'study' && (
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-100 dark:border-gray-700" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4 flex items-center gap-2" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                                                    p: ({ node, ...props }) => <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-bold text-sky-600 dark:text-sky-400" {...props} />
                                                }}
                                            >
                                                {topic.content || "Content coming soon..."}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {/* Examples Section */}
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-xl flex items-center gap-2 px-2">
                                            <span className="text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg"><FiAward /></span>
                                            Solved Examples
                                        </h3>

                                        <div className="grid gap-6">
                                            {topic.examples?.map((ex, i) => (
                                                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                                    <div className="p-6 border-b border-gray-50 dark:border-gray-700 bg-white dark:bg-gray-800">
                                                        <div className="flex gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm">
                                                                Q{i + 1}
                                                            </div>
                                                            <p className="font-semibold text-gray-900 dark:text-white text-lg pt-0.5">{ex.question}</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 bg-slate-50 dark:bg-gray-900/30">
                                                        <div className="flex gap-4">
                                                            <div className="flex-shrink-0 w-8 flex justify-center">
                                                                <div className="w-0.5 h-full bg-green-200 dark:bg-green-900"></div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2 block">Step-by-Step Solution</span>
                                                                <div className="text-gray-700 dark:text-gray-300 space-y-2 font-medium">
                                                                    <ReactMarkdown
                                                                        components={{
                                                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                                                                        }}
                                                                    >
                                                                        {ex.solution}
                                                                    </ReactMarkdown>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PRACTICE MODE (Interactive Chat Style) */}
                            {activeTab === 'practice' && (
                                <div className="max-w-3xl mx-auto">
                                    {practiceQuestions.length > 0 ? (
                                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[500px] flex flex-col">
                                            {/* Question Header */}
                                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest">Question {currentPracticeIndex + 1} of {practiceQuestions.length}</span>
                                                    <div className="hidden md:flex items-center gap-2 text-sky-600 dark:text-sky-400 font-mono font-bold text-sm bg-sky-50 dark:bg-sky-900/20 px-2 py-1 rounded-lg border border-sky-100 dark:border-sky-800">
                                                        <FiClock className={!isTimerPaused ? "animate-pulse" : ""} />
                                                        {Math.floor(practiceTimer / 60)}:{(practiceTimer % 60).toString().padStart(2, '0')}
                                                        <button
                                                            onClick={() => setIsTimerPaused(!isTimerPaused)}
                                                            className="ml-2 p-1 hover:bg-sky-100 dark:hover:bg-sky-800 rounded-md transition-colors"
                                                            title={isTimerPaused ? "Resume Timer" : "Pause Timer"}
                                                        >
                                                            {isTimerPaused ? <FiPlay size={12} /> : <FiPause size={12} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setCurrentPracticeIndex(Math.max(0, currentPracticeIndex - 1)); setShowSolution(false); setShowHint(false); setIsChecked(false); setPracticeTimer(0); setIsTimerPaused(false); }}
                                                        disabled={currentPracticeIndex === 0}
                                                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-bold flex items-center gap-2 disabled:opacity-30"
                                                    >
                                                        <FiChevronLeft /> Previous
                                                    </button>
                                                    <button
                                                        onClick={() => { setCurrentPracticeIndex(Math.min(practiceQuestions.length - 1, currentPracticeIndex + 1)); setShowSolution(false); setShowHint(false); setIsChecked(false); setPracticeTimer(0); setIsTimerPaused(false); }}
                                                        disabled={currentPracticeIndex === practiceQuestions.length - 1}
                                                        className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-sky-200 dark:shadow-none transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 flex items-center gap-2"
                                                    >
                                                        Next Question <FiChevronRight />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Question Content */}
                                            <div className="p-8 flex-1 overflow-y-auto">
                                                <div className="mb-8">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                                            {practiceQuestions[currentPracticeIndex]?.type || 'Aptitude'}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setIsWhiteboardOpen(true)}
                                                                className="text-gray-400 hover:text-sky-600 dark:text-gray-500 dark:hover:text-sky-400 p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                                                                title="Open Scratchpad"
                                                            >
                                                                <FiPenTool size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowHint(!showHint)}
                                                                className={`p-2 rounded-lg transition-colors ${showHint ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-400 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-400 hover:bg-amber-50'}`}
                                                                title="Show Hint"
                                                            >
                                                                <FiHelpCircle size={18} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Hint Display */}
                                                    <AnimatePresence>
                                                        {showHint && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="mb-6 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 p-4 rounded-r-lg overflow-hidden"
                                                            >
                                                                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                                                                    <span className="font-bold flex items-center gap-2 mb-1">💡 Hint:</span>
                                                                    {(() => {
                                                                        const expl = practiceQuestions[currentPracticeIndex]?.explanation || '';
                                                                        if (!expl) return "No hint available.";

                                                                        const stepMatch = expl.match(/(?:^|\n|\*)\s*(?:Step\s*1|1\.)[:\.]?\s*(.*?)(?=(?:\n|$|\*|Step\s*2|2\.))/i);
                                                                        if (stepMatch && stepMatch[1].trim().length > 2) {
                                                                            return stepMatch[1].trim();
                                                                        }

                                                                        const firstSentenceMatch = expl.match(/^.*?[.!?](?:\s|$|\n)/);
                                                                        if (firstSentenceMatch && firstSentenceMatch[0].trim().length > 5) {
                                                                            return firstSentenceMatch[0].trim();
                                                                        }

                                                                        if (expl.length > 0) {
                                                                            return expl.substring(0, 80) + (expl.length > 80 ? "..." : "");
                                                                        }

                                                                        return "Read the question carefully and define the variables.";
                                                                    })()}
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    <p className="text-xl font-medium text-gray-800 dark:text-white font-serif leading-relaxed">
                                                        {practiceQuestions[currentPracticeIndex]?.questionText}
                                                    </p>
                                                </div>

                                                <div className="space-y-3 max-w-2xl">
                                                    {practiceQuestions[currentPracticeIndex]?.options?.map((option, idx) => {
                                                        const currentQ = practiceQuestions[currentPracticeIndex];
                                                        const isSelected = practiceAnswers[currentQ._id] === option;
                                                        const isCorrect = option === currentQ.correctAnswer;
                                                        const checked = isChecked;

                                                        let borderClass = 'border-gray-100 dark:border-gray-700 hover:border-sky-200 dark:hover:border-sky-700';
                                                        let bgClass = '';

                                                        if (showSolution || checked) {
                                                            if (isCorrect) {
                                                                borderClass = 'border-green-500 dark:border-green-500';
                                                                bgClass = 'bg-green-50 dark:bg-green-900/20';
                                                            } else if (isSelected) {
                                                                borderClass = 'border-red-500 dark:border-red-500';
                                                                bgClass = 'bg-red-50 dark:bg-red-900/20';
                                                            } else {
                                                                borderClass = 'opacity-50 border-gray-100 dark:border-gray-700';
                                                            }
                                                        } else if (isSelected) {
                                                            borderClass = 'border-sky-500 dark:border-sky-500';
                                                            bgClass = 'bg-sky-50 dark:bg-sky-900/20';
                                                        }

                                                        return (
                                                            <div
                                                                key={idx}
                                                                onClick={() => !checked && !showSolution && setPracticeAnswers(prev => ({ ...prev, [currentQ._id]: option }))}
                                                                className={`p-4 rounded-xl border-2 transition-all flex items-center ${borderClass} ${bgClass} ${(!checked && !showSolution) ? 'cursor-pointer' : 'cursor-default'}`}
                                                            >
                                                                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-4 transition-colors ${isSelected || ((showSolution || checked) && isCorrect) ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                                                    {String.fromCharCode(65 + idx)}
                                                                </span>
                                                                <span className="font-medium text-gray-700 dark:text-gray-200 flex-1">{option}</span>

                                                                {/* Result Icons */}
                                                                {(showSolution || checked) && isCorrect && <span className="text-green-500 text-xl">✓</span>}
                                                                {(showSolution || checked) && isSelected && !isCorrect && <span className="text-red-500 text-xl">✕</span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Actions Area */}
                                                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">

                                                    {/* Left: Feedback */}
                                                    <div className="flex-1">
                                                        {isChecked && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className={`font-bold flex items-center gap-2 ${practiceAnswers[practiceQuestions[currentPracticeIndex]._id] === practiceQuestions[currentPracticeIndex].correctAnswer ? 'text-green-600' : 'text-red-600'}`}
                                                            >
                                                                {practiceAnswers[practiceQuestions[currentPracticeIndex]._id] === practiceQuestions[currentPracticeIndex].correctAnswer
                                                                    ? <><FiCheckCircle /> Correct Answer!</>
                                                                    : <><FiXCircle /> Incorrect. Try to review the concept.</>
                                                                }
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                    {/* Right: Buttons */}
                                                    <div className="flex items-center gap-3">
                                                        {/* Check Answer Button */}
                                                        {!isChecked && !showSolution && (
                                                            <button
                                                                onClick={() => {
                                                                    setIsChecked(true);
                                                                    if (practiceAnswers[practiceQuestions[currentPracticeIndex]._id] === practiceQuestions[currentPracticeIndex].correctAnswer) {
                                                                        handleStreakUpdate();
                                                                    }
                                                                }}
                                                                disabled={!practiceAnswers[practiceQuestions[currentPracticeIndex]._id]}
                                                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                                                            >
                                                                Check Answer
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => setShowSolution(!showSolution)}
                                                            className="text-sky-600 dark:text-sky-400 font-bold text-sm flex items-center gap-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 px-4 py-2 rounded-xl transition-colors"
                                                        >
                                                            {showSolution ? 'Hide Solution' : 'View Solution'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {showSolution && (
                                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-5 bg-sky-50 dark:bg-sky-900/30 rounded-2xl text-sky-900 dark:text-sky-100 text-sm border border-sky-100 dark:border-sky-800 mx-8 mb-8">
                                                        <span className="font-bold flex items-center gap-2 mb-2 text-lg"><FiCheckCircle /> Solution</span>
                                                        <div className="font-semibold mb-2">Correct Answer: {practiceQuestions[currentPracticeIndex]?.correctAnswer}</div>
                                                        <div className="text-sky-800 dark:text-sky-200 leading-relaxed">
                                                            <ReactMarkdown>
                                                                {practiceQuestions[currentPracticeIndex]?.explanation || "No explanation provided."}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 opacity-50">
                                            <div className="text-4xl mb-4">📝</div>
                                            <p>No practice questions available for this topic yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TEST VIEW - Modern CBT Layout */}
                            {activeTab === 'test' && (
                                <div className="max-w-6xl mx-auto">
                                    {!isTestStarted ? (
                                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-sky-100/20 dark:shadow-none p-10 backdrop-blur-sm">
                                            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-lg text-white transform rotate-3 hover:rotate-6 transition-transform">⚡</div>
                                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Speed Test Challenge</h2>
                                            <p className="text-gray-500 dark:text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
                                                Test your speed and accuracy. Select your configuration below to begin the assessment.
                                            </p>

                                            <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
                                                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 w-full md:w-64">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">Total Questions</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[5, 10, 20].map(num => (
                                                            <button
                                                                key={num}
                                                                onClick={() => setTestConfig({ ...testConfig, count: num })}
                                                                className={`py-3 rounded-xl font-bold text-sm transition-all ${testConfig.count === num ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                            >
                                                                {num}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 w-full md:w-64">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">Time Limit</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[5, 10, 20].map(num => (
                                                            <button
                                                                key={num}
                                                                onClick={() => setTestConfig({ ...testConfig, time: num })}
                                                                className={`py-3 rounded-xl font-bold text-sm transition-all ${testConfig.time === num ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                            >
                                                                {num}m
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button onClick={startTest} className="px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                                                <span>Begin Assessment</span>
                                                <FiChevronRight />
                                            </button>
                                        </div>
                                    ) : !testSubmitted ? (
                                        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
                                            {/* Main Question Area */}
                                            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
                                                    <span className="font-bold text-sm text-gray-500 uppercase tracking-widest">Question {currentPracticeIndex + 1} of {testQuestions.length}</span>
                                                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-mono font-bold text-xl bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
                                                        <FiClock className="animate-pulse" />
                                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-8">
                                                    <p className="text-xl font-medium text-gray-800 dark:text-white leading-relaxed mb-8">
                                                        {testQuestions[currentPracticeIndex]?.questionText}
                                                    </p>

                                                    <div className="space-y-3 max-w-2xl">
                                                        {testQuestions[currentPracticeIndex]?.options?.map((option, idx) => (
                                                            <label
                                                                key={idx}
                                                                className={`
                                                                flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                                                                ${testAnswers[testQuestions[currentPracticeIndex]._id] === option
                                                                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                                                                        : 'border-gray-100 dark:border-gray-700 hover:border-sky-200 dark:hover:border-sky-700'
                                                                    }
                                                            `}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={testQuestions[currentPracticeIndex]._id}
                                                                    checked={testAnswers[testQuestions[currentPracticeIndex]._id] === option}
                                                                    onChange={() => setTestAnswers({ ...testAnswers, [testQuestions[currentPracticeIndex]._id]: option })}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${testAnswers[testQuestions[currentPracticeIndex]._id] === option ? 'border-sky-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                                    {testAnswers[testQuestions[currentPracticeIndex]._id] === option && <div className="w-3 h-3 bg-sky-500 rounded-full" />}
                                                                </div>
                                                                <span className="font-medium text-gray-700 dark:text-gray-200">{option}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex justify-between">
                                                    <button
                                                        onClick={() => setCurrentPracticeIndex(Math.max(0, currentPracticeIndex - 1))}
                                                        disabled={currentPracticeIndex === 0}
                                                        className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 flex items-center gap-2"
                                                    >
                                                        <FiChevronLeft /> Previous
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentPracticeIndex(Math.min(testQuestions.length - 1, currentPracticeIndex + 1))}
                                                        disabled={currentPracticeIndex === testQuestions.length - 1}
                                                        className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-2"
                                                    >
                                                        Next <FiChevronRight />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sidebar / Question Palette */}
                                            <div className="w-full lg:w-80 flex flex-col gap-6">
                                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1">
                                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Question Palette</h3>
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {testQuestions.map((q, idx) => {
                                                            const isAnswered = testAnswers[q._id];
                                                            const isCurrent = idx === currentPracticeIndex;
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => setCurrentPracticeIndex(idx)}
                                                                    className={`
                                                                    aspect-square rounded-lg font-bold text-sm transition-all
                                                                    ${isCurrent ? 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-gray-800' : ''}
                                                                    ${isAnswered
                                                                            ? 'bg-sky-500 text-white'
                                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                        }
                                                                `}
                                                                >
                                                                    {idx + 1}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                                        <div className="flex gap-4 mb-2 text-xs text-gray-500">
                                                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-500 rounded-full"></div> Answered</div>
                                                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 rounded-full border"></div> Unanswered</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => submitTest()}
                                                    className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                >
                                                    End Assessment
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 dark:border-gray-700">
                                            <div className="text-center mb-12">
                                                <div className="inline-block p-4 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 mb-4">
                                                    <FiAward size={48} />
                                                </div>
                                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Assessment Complete</h2>
                                                <p className="text-gray-500">Here is your detailed performance report</p>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                                {/* Score Card */}
                                                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="p-6 rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800">
                                                        <div className="text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">Score</div>
                                                        <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{testResult?.score} <span className="text-lg text-gray-400">/ {testResult.totalQuestions}</span></div>
                                                    </div>
                                                    <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                                                        <div className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Accuracy</div>
                                                        <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{testResult?.accuracy.toFixed(0)}%</div>
                                                    </div>
                                                    <div className="p-6 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                                                        <div className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Avg Time</div>
                                                        <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{testResult?.averageTimePerQuestion.toFixed(1)}s</div>
                                                    </div>
                                                </div>

                                                {/* Chart */}
                                                <div className="col-span-1 flex justify-center items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                                    <div className="w-40 h-40">
                                                        <Doughnut
                                                            data={{
                                                                labels: ['Correct', 'Wrong'],
                                                                datasets: [{
                                                                    data: [testResult.correctAnswers, testResult.wrongAnswers],
                                                                    backgroundColor: ['#10b981', '#ef4444'],
                                                                    borderWidth: 0
                                                                }]
                                                            }}
                                                            options={{
                                                                plugins: { legend: { display: false } },
                                                                cutout: '70%'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-6">
                                                        <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Correct</span></div>
                                                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Incorrect</span></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-2xl mb-12">
                                                <h4 className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200 mb-4">
                                                    <span>🤖</span> AI Performance Analysis
                                                </h4>
                                                <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
                                                    "{testResult?.aiFeedback || "Good effort! Focus on improving your speed on complex problems. Review the incorrect answers below to understand the gaps."}"
                                                </p>
                                            </div>

                                            <div className="flex justify-center gap-4">
                                                <button onClick={() => { setIsTestStarted(false); setTestSubmitted(false); }} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow hover:scale-105 transition-transform">
                                                    Retake Test
                                                </button>
                                                <button onClick={() => setActiveTab('practice')} className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    Review Concepts
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <Whiteboard isOpen={isWhiteboardOpen} onClose={() => setIsWhiteboardOpen(false)} />
            <StreakNotification
                isOpen={showStreakModal}
                onClose={() => setShowStreakModal(false)}
                streak={streak}
                message={streakMessage}
            />
        </div>
    );
};

export default TopicDetail;
