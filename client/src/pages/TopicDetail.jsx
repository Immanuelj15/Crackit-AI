import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import DarkModeToggle from '../components/DarkModeToggle';
import ReactMarkdown from 'react-markdown';

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
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors">
            {/* SIDEBAR */}
            <aside className={`w-80 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-20 h-full'} md:translate-x-0 md:relative`}>
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                    <Link to={`/aptitude/${category}`} className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <span className="mr-2">←</span> Back
                    </Link>
                </div>

                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold line-clamp-2">{topic.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">Module Content</p>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {[
                        { id: 'study', icon: '📖', label: 'Study Material', desc: 'Concepts & Formulas' },
                        { id: 'practice', icon: '✍️', label: 'Practice Questions', desc: `${practiceQuestions.length} Questions` },
                        { id: 'test', icon: '⚡', label: 'Speed Test', desc: 'Timed Assessment' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-colors ${activeTab === item.id
                                ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <span className="text-xl mt-0.5">{item.icon}</span>
                            <div>
                                <div className="font-semibold text-sm">{item.label}</div>
                                <div className="text-xs opacity-70">{item.desc}</div>
                            </div>
                            {activeTab === item.id && (
                                <div className="ml-auto mt-1.5 w-2 h-2 rounded-full bg-sky-500"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-xs text-gray-400">CrackIt AI • Learning System</p>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 md:px-8">
                    <button className="md:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>☰</button>
                    <div className="font-medium text-gray-500 dark:text-gray-400">
                        {category.toUpperCase()} / <span className="text-gray-900 dark:text-white">{activeTab === 'study' ? 'Theory' : activeTab === 'practice' ? 'Practice' : 'Test'}</span>
                    </div>
                    <DarkModeToggle />
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 scroll-smooth">
                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* STUDY VIEW */}
                                {activeTab === 'study' && (
                                    <div className="space-y-8">
                                        <div className="prose dark:prose-invert max-w-none prose-lg prose-headings:text-sky-700 dark:prose-headings:text-sky-300 prose-a:text-sky-600">
                                            <ReactMarkdown>{topic.content}</ReactMarkdown>
                                        </div>

                                        {topic.examples?.length > 0 && (
                                            <div className="mt-12">
                                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                    <span className="bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 p-1.5 rounded-md text-sm">EXP</span>
                                                    Solved Examples
                                                </h3>
                                                <div className="grid gap-6">
                                                    {topic.examples.map((ex, i) => (
                                                        <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                                                            <div className="font-medium text-lg mb-4 text-gray-900 dark:text-white">{ex.question}</div>
                                                            <div className="bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 p-4 rounded-r-lg">
                                                                <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-1">Solution</p>
                                                                <p className="text-gray-700 dark:text-gray-300">{ex.solution}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-12 flex justify-end">
                                            <button
                                                onClick={() => setActiveTab('practice')}
                                                className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-semibold flex items-center gap-2"
                                            >
                                                Next: Practice Questions →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* PRACTICE VIEW */}
                                {activeTab === 'practice' && (
                                    <div className="flex flex-col h-[calc(100vh-12rem)]">
                                        {practiceQuestions.length > 0 ? (
                                            <>
                                                <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
                                                    <div className="mb-8 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <span>Question {currentPracticeIndex + 1} of {practiceQuestions.length}</span>
                                                        <span>Difficulty: <span className={`capitalize font-bold ${practiceQuestions[currentPracticeIndex].difficulty === 'easy' ? 'text-green-500' : 'text-orange-500'}`}>{practiceQuestions[currentPracticeIndex].difficulty}</span></span>
                                                    </div>

                                                    <div className="min-h-[200px] mb-8">
                                                        <h3 className="text-2xl font-medium leading-relaxed text-gray-900 dark:text-white">
                                                            {practiceQuestions[currentPracticeIndex].questionText}
                                                        </h3>
                                                    </div>

                                                    <div className="grid gap-3 mb-8">
                                                        {practiceQuestions[currentPracticeIndex].options.map((opt, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => { if (!showSolution) setShowSolution(true); }}
                                                                className={`p-4 rounded-xl border text-left transition-all ${showSolution
                                                                    ? opt === practiceQuestions[currentPracticeIndex].correctAnswer
                                                                        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-500 text-green-900 dark:text-green-100'
                                                                        : 'opacity-50 border-gray-200 dark:border-gray-700'
                                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-md'
                                                                    }`}
                                                            >
                                                                <span className="mr-3 font-bold text-gray-400">{String.fromCharCode(65 + i)}</span>
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {showSolution && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200">
                                                            <strong>Correct Answer:</strong> {practiceQuestions[currentPracticeIndex].correctAnswer}
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                                                    <button
                                                        onClick={() => { setCurrentPracticeIndex(Math.max(0, currentPracticeIndex - 1)); setShowSolution(false); }}
                                                        disabled={currentPracticeIndex === 0}
                                                        className="px-4 py-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                                                    >
                                                        ← Previous
                                                    </button>
                                                    <button
                                                        onClick={() => { setCurrentPracticeIndex(Math.min(practiceQuestions.length - 1, currentPracticeIndex + 1)); setShowSolution(false); }}
                                                        disabled={currentPracticeIndex === practiceQuestions.length - 1}
                                                        className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                                                    >
                                                        Next Question →
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-20">No practice questions available.</div>
                                        )}
                                    </div>
                                )}

                                {/* TEST VIEW */}
                                {activeTab === 'test' && (
                                    <div className="max-w-3xl mx-auto">
                                        {!isTestStarted ? (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center shadow-lg">
                                                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">⚡</div>
                                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ready for a Speed Test?</h2>
                                                <p className="text-gray-500 dark:text-gray-400 mb-8">Test your speed and accuracy with a timed quiz.</p>

                                                <div className="grid grid-cols-2 gap-6 mb-8 text-left max-w-sm mx-auto">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Questions</label>
                                                        <select value={testConfig.count} onChange={(e) => setTestConfig({ ...testConfig, count: Number(e.target.value) })} className="w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                                            <option value="5">5</option><option value="10">10</option><option value="20">20</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Minutes</label>
                                                        <select value={testConfig.time} onChange={(e) => setTestConfig({ ...testConfig, time: Number(e.target.value) })} className="w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                                            <option value="5">5</option><option value="10">10</option><option value="20">20</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <button onClick={startTest} className="w-full px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md transition-transform hover:scale-[1.02]">
                                                    Start Test
                                                </button>
                                            </div>
                                        ) : !testSubmitted ? (
                                            <div>
                                                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 py-4 mb-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold font-mono text-xl">
                                                        <span>⏱️</span>
                                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                                    </div>
                                                    <button onClick={() => submitTest()} className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold text-sm">Submit Now</button>
                                                </div>
                                                <div className="space-y-12 pb-20">
                                                    {testQuestions.map((q, idx) => (
                                                        <div key={q._id}>
                                                            <div className="flex gap-4 mb-4">
                                                                <span className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                                                                <p className="text-lg font-medium pt-1">{q.questionText}</p>
                                                            </div>
                                                            <div className="pl-12 space-y-3">
                                                                {q.options.map((opt) => (
                                                                    <label key={opt} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${testAnswers[q._id] === opt ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                                                        <input type="radio" name={q._id} checked={testAnswers[q._id] === opt} onChange={() => setTestAnswers({ ...testAnswers, [q._id]: opt })} className="w-4 h-4 text-sky-600" />
                                                                        <span className="ml-3">{opt}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="inline-block p-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-6xl mb-6">🏆</div>
                                                <h2 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">Test Complete!</h2>

                                                <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
                                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                        <div className="text-3xl font-bold text-sky-600">{testResult?.score}</div>
                                                        <div className="text-xs text-gray-500 uppercase">Score</div>
                                                    </div>
                                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                        <div className="text-3xl font-bold text-green-600">{testResult?.accuracy.toFixed(0)}%</div>
                                                        <div className="text-xs text-gray-500 uppercase">Accuracy</div>
                                                    </div>
                                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                        <div className="text-3xl font-bold text-orange-600">{testResult?.averageTimePerQuestion.toFixed(1)}s</div>
                                                        <div className="text-xs text-gray-500 uppercase">Speed</div>
                                                    </div>
                                                </div>

                                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl text-indigo-800 dark:text-indigo-200 italic mb-8 border border-indigo-100 dark:border-indigo-800">
                                                    "{testResult?.aiFeedback}"
                                                </div>

                                                {/* Review Section */}
                                                <div className="text-left mb-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                    <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300">
                                                        📝 Detailed Review
                                                    </div>
                                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                                        {testQuestions.map((q, idx) => {
                                                            const userAnswer = testAnswers[q._id];
                                                            const isCorrect = userAnswer === q.correctAnswer;
                                                            return (
                                                                <div key={q._id} className="p-4 sm:p-6">
                                                                    <div className="flex gap-3">
                                                                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                            {isCorrect ? '✓' : '✗'}
                                                                        </span>
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-gray-900 dark:text-white mb-2">{q.questionText}</p>
                                                                            <div className="text-sm space-y-1">
                                                                                <p className={isCorrect ? 'text-green-600 font-medium' : 'text-red-500'}>
                                                                                    Your Answer: {userAnswer || 'Skipped'}
                                                                                </p>
                                                                                {!isCorrect && (
                                                                                    <p className="text-green-600 font-medium">
                                                                                        Correct Answer: {q.correctAnswer}
                                                                                    </p>
                                                                                )}
                                                                                <p className="text-gray-400 text-xs mt-1">Difficulty: {q.difficulty}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <button onClick={() => { setIsTestStarted(false); setTestSubmitted(false); }} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold">Try Again</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TopicDetail;
