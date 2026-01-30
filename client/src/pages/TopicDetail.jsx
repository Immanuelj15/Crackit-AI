import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiChevronRight, FiChevronLeft, FiAlertCircle, FiAward } from 'react-icons/fi';

const TopicDetail = () => {
    const { topicId, category } = useParams();
    const [topic, setTopic] = useState(null);
    const [activeTab, setActiveTab] = useState('study'); // study, practice, test
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(true); // For mobile capability if needed, mostly desktop focus

    // Practice State
    const [practiceQuestions, setPracticeQuestions] = useState([]);
    const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
    const [showSolution, setShowSolution] = useState(false);

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
        const fetchTopic = async () => {
            try {
                const { data } = await axios.get(`/api/topics/${topicId}`, { withCredentials: true });
                setTopic(data);

                const qRes = await axios.get(`/api/questions?category=${category}`, { withCredentials: true });
                const allQs = qRes.data.filter(q => q.topic === topicId);
                setPracticeQuestions(allQs);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopic();
    }, [topicId, category]);

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
        setTestSubmitted(true);
        const total = questions.length;
        let correct = 0;
        questions.forEach(q => { if (answers[q._id] === q.correctAnswer) correct++; });
        const wrong = total - correct;

        try {
            const resultData = { topicId, category, score: correct, totalQuestions: total, correctAnswers: correct, wrongAnswers: wrong, timeTaken: (testConfig.time * 60) - timeLeft, answers };
            const { data } = await axios.post('/api/topics/result', resultData, { withCredentials: true });
            setTestResult(data);
        } catch (error) { console.error("Result save failed", error); }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!topic) return <div>Topic not found</div>;

    return (
        <>
            <div className="max-w-5xl mx-auto space-y-8">
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
                                            <span className="font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest">Question {currentPracticeIndex + 1} of {practiceQuestions.length}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setCurrentPracticeIndex(Math.max(0, currentPracticeIndex - 1)); setShowSolution(false); }}
                                                    disabled={currentPracticeIndex === 0}
                                                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-bold flex items-center gap-2 disabled:opacity-30"
                                                >
                                                    <FiChevronLeft /> Previous
                                                </button>
                                                <button
                                                    onClick={() => { setCurrentPracticeIndex(Math.min(practiceQuestions.length - 1, currentPracticeIndex + 1)); setShowSolution(false); }}
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
                                                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                                                    {practiceQuestions[currentPracticeIndex]?.type || 'Aptitude'}
                                                </span>
                                                <p className="text-xl font-medium text-gray-800 dark:text-white font-serif leading-relaxed">
                                                    {practiceQuestions[currentPracticeIndex]?.questionText}
                                                </p>
                                            </div>

                                            <div className="space-y-3 max-w-2xl">
                                                {practiceQuestions[currentPracticeIndex]?.options?.map((option, idx) => (
                                                    <div key={idx} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${showSolution && option === practiceQuestions[currentPracticeIndex].correctAnswer ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600' : 'border-gray-100 dark:border-gray-700 hover:border-sky-200 dark:hover:border-sky-700'}`}>
                                                        <span className="font-bold text-gray-400 dark:text-gray-500 mr-4">{String.fromCharCode(65 + idx)}.</span>
                                                        <span className="font-medium text-gray-700 dark:text-gray-200">{option}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Solution Toggle */}
                                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                                <button
                                                    onClick={() => setShowSolution(!showSolution)}
                                                    className="text-sky-600 dark:text-sky-400 font-bold text-sm flex items-center gap-2 hover:underline"
                                                >
                                                    {showSolution ? 'Hide Solution' : 'View Solution'}
                                                </button>
                                                {showSolution && (
                                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/30 rounded-xl text-sky-900 dark:text-sky-100 text-sm border border-sky-100 dark:border-sky-800">
                                                        <span className="font-bold block mb-1">Correct Answer:</span>
                                                        {practiceQuestions[currentPracticeIndex]?.correctAnswer}
                                                    </motion.div>
                                                )}
                                            </div>
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

                        {/* TEST VIEW - Kept Clean & Focused */}
                        {activeTab === 'test' && (
                            <div className="max-w-3xl mx-auto">
                                {!isTestStarted ? (
                                    <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
                                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">⚡</div>
                                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Speed Test Challenge</h2>
                                        <p className="text-gray-500 mb-10">Select your difficulty parameters.</p>

                                        <div className="space-y-6 max-w-sm mx-auto mb-10">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block text-left">Questions</label>
                                                <div className="flex bg-gray-50 p-1 rounded-xl">
                                                    {[5, 10, 20].map(num => (
                                                        <button
                                                            key={num}
                                                            onClick={() => setTestConfig({ ...testConfig, count: num })}
                                                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${testConfig.count === num ? 'bg-white shadow text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block text-left">Time Limit</label>
                                                <div className="flex bg-gray-50 p-1 rounded-xl">
                                                    {[5, 10, 20].map(num => (
                                                        <button
                                                            key={num}
                                                            onClick={() => setTestConfig({ ...testConfig, time: num })}
                                                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${testConfig.time === num ? 'bg-white shadow text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            {num}m
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={startTest} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-200 transition-all hover:scale-[1.02]">
                                            Start Challenge
                                        </button>
                                    </div>
                                ) : !testSubmitted ? (
                                    <div>
                                        {/* Simplified Test Layout */}
                                        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md py-4 mb-8 border-b border-gray-100 flex justify-between items-center rounded-b-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 animate-pulse font-bold">⏱️</div>
                                                <div className="font-mono text-xl font-bold text-gray-900">
                                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                                </div>
                                            </div>
                                            <button onClick={() => submitTest()} className="text-red-500 font-bold text-sm hover:underline">End Test</button>
                                        </div>

                                        <div className="space-y-12 pb-20">
                                            {testQuestions.map((q, idx) => (
                                                <div key={q._id} className="scroll-mt-24">
                                                    <div className="flex gap-4">
                                                        <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500">{idx + 1}</span>
                                                        <div className="flex-1">
                                                            <p className="text-lg font-medium text-gray-900 mb-4">{q.questionText}</p>
                                                            <div className="grid gap-3">
                                                                {q.options.map((opt) => (
                                                                    <label key={opt} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${testAnswers[q._id] === opt ? 'border-sky-500 bg-sky-50' : 'border-gray-50 hover:border-gray-200'}`}>
                                                                        <input type="radio" name={q._id} checked={testAnswers[q._id] === opt} onChange={() => setTestAnswers({ ...testAnswers, [q._id]: opt })} className="w-4 h-4 text-sky-500 border-gray-300 focus:ring-sky-500" />
                                                                        <span className="ml-3 font-medium text-gray-700">{opt}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🏆</div>
                                        <h2 className="text-4xl font-extrabold mb-2 text-gray-900">Test Complete!</h2>
                                        <p className="text-sky-600 font-bold text-lg mb-10">Score: {testResult?.score}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                                <div className="text-3xl font-extrabold text-gray-900 mb-1">{testResult?.accuracy.toFixed(0)}%</div>
                                                <div className="text-xs font-bold text-gray-400 uppercase">Accuracy</div>
                                            </div>
                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                                <div className="text-3xl font-extrabold text-gray-900 mb-1">{testResult?.averageTimePerQuestion.toFixed(1)}s</div>
                                                <div className="text-xs font-bold text-gray-400 uppercase">Avg Speed</div>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-50 p-6 rounded-2xl mb-10 text-left">
                                            <h4 className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                                                <span>🤖</span> AI Feedback
                                            </h4>
                                            <p className="text-indigo-800 text-sm leading-relaxed">
                                                "{testResult?.aiFeedback || "Excellent work! Keep practicing to improve your speed further."}"
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-4">
                                            <button onClick={() => { setIsTestStarted(false); setTestSubmitted(false); }} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow hover:scale-105 transition-transform">
                                                Retry Test
                                            </button>
                                            <button onClick={() => setActiveTab('practice')} className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors">
                                                Back to Practice
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
};

export default TopicDetail;
