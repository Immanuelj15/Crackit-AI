import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import DarkModeToggle from '../components/DarkModeToggle';

const AptitudeTest = () => {
    const { category } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const timerRef = useRef(null);

    // Map category ID to display name
    const categoryNames = {
        'quant': 'Quantitative Aptitude',
        'logical': 'Logical Reasoning',
        'verbal': 'Verbal Ability'
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Fetch general aptitude questions for the specific category
                const { data } = await axios.get(`/api/questions?type=aptitude&category=${category}&isGeneral=true`, {
                    withCredentials: true
                });
                setQuestions(data);
                setLoading(false);

                // Start Timer
                timerRef.current = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            handleSubmit();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

            } catch (error) {
                console.error("Error fetching aptitude questions:", error);
                setLoading(false);
            }
        };
        fetchQuestions();

        return () => clearInterval(timerRef.current);
    }, [category]);

    const handleOptionSelect = (questionId, option) => {
        if (submitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = () => {
        clearInterval(timerRef.current);
        setSubmitted(true);

        // Calculate Score
        let newScore = 0;
        questions.forEach(q => {
            if (answers[q._id] === q.correctAnswer) {
                newScore++;
            }
        });
        setScore(newScore);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (questions.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No questions found!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find any questions for this category.</p>
            <Link to="/aptitude" className="text-sky-600 hover:text-sky-700 font-medium">← Go Back</Link>
        </div>
    );

    // Results View
    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 text-center border-b border-gray-100 dark:border-gray-700">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Test Completed!</h2>
                        <p className="text-gray-600 dark:text-gray-400">Here is how you performed in {categoryNames[category]}</p>
                    </div>

                    <div className="p-8 bg-sky-50 dark:bg-sky-900/20 grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Score</div>
                            <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">{score} / {questions.length}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accuracy</div>
                            <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                                {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
                            <div className={`text-xl font-bold mt-1 ${score > questions.length / 2 ? 'text-green-500' : 'text-orange-500'}`}>
                                {score > questions.length / 2 ? 'Passed' : 'Needs Work'}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Review</h3>
                        <div className="space-y-6">
                            {questions.map((q, idx) => {
                                const isCorrect = answers[q._id] === q.correctAnswer;
                                const userAnswer = answers[q._id];

                                return (
                                    <div key={q._id} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800'}`}>
                                        <p className="font-medium text-gray-900 dark:text-white mb-3">
                                            {idx + 1}. {q.questionText}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 text-sm">
                                            <div className="">
                                                <span className="text-gray-500 dark:text-gray-400">Your Answer: </span>
                                                <span className={`font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {userAnswer || 'Skipped'}
                                                </span>
                                            </div>
                                            {!isCorrect && (
                                                <div className="">
                                                    <span className="text-gray-500 dark:text-gray-400">Correct Answer: </span>
                                                    <span className="font-medium text-green-600 dark:text-green-400">{q.correctAnswer}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-center gap-4">
                        <Link to="/aptitude" className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors">
                            Choose Another Category
                        </Link>
                        <Link to="/dashboard" className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Active Test View
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                            {categoryNames[category]} Test
                        </h1>
                        <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">{currentQuestionIndex + 1}/{questions.length}</div>
                    </div>
                    <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-sky-600 dark:text-sky-400'}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        End Test
                    </button>
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 px-3 py-1 rounded-full text-sm font-semibold">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border ${currentQuestion.difficulty === 'easy' ? 'border-green-200 text-green-600 dark:border-green-800 dark:text-green-400' :
                                    currentQuestion.difficulty === 'medium' ? 'border-yellow-200 text-yellow-600 dark:border-yellow-800 dark:text-yellow-400' :
                                        'border-red-200 text-red-600 dark:border-red-800 dark:text-red-400'
                                }`}>
                                {currentQuestion.difficulty}
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white leading-relaxed mb-8">
                            {currentQuestion.questionText}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(currentQuestion._id, opt)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group ${answers[currentQuestion._id] === opt
                                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 ring-2 ring-sky-200 dark:ring-sky-800'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${answers[currentQuestion._id] === opt
                                            ? 'border-sky-500 bg-sky-500'
                                            : 'border-gray-300 dark:border-gray-600 group-hover:border-sky-400'
                                        }`}>
                                        {answers[currentQuestion._id] === opt && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                    </div>
                                    <span className={`text-lg ${answers[currentQuestion._id] === opt ? 'text-sky-900 dark:text-sky-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {opt}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${currentQuestionIndex === 0
                                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                            }`}
                    >
                        Previous
                    </button>

                    {currentQuestionIndex < questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium shadow-md shadow-sky-500/20 transition-all transform hover:translate-y-px"
                        >
                            Next Question
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-md shadow-green-500/20 transition-all transform hover:translate-y-px"
                        >
                            Submit Test
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AptitudeTest;
