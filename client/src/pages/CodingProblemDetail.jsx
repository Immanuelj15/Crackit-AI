import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiPlay, FiCheck, FiTerminal, FiLayout, FiMaximize2, FiSettings, FiClock, FiCpu, FiBarChart2, FiMessageSquare, FiAward, FiX } from 'react-icons/fi';
import PerformanceChart from '../components/PerformanceChart';
import { useTheme } from '../context/ThemeContext';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';
const CodingProblemDetail = () => {
    const { slug } = useParams();
    const { theme } = useTheme();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [showConsole, setShowConsole] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [submissions, setSubmissions] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);
    const { user, refreshUser } = useAuth();
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [consoleTab, setConsoleTab] = useState('testcase'); // 'testcase' or 'result'
    const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);
    const [editorTheme, setEditorTheme] = useState('dark'); // 'dark' or 'light'
    const [showSettings, setShowSettings] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [showAIHint, setShowAIHint] = useState(false);
    const [aiHintLoading, setAiHintLoading] = useState(false);
    const [aiHint, setAiHint] = useState('');
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);
    const highlighterRef = useRef(null);

    useEffect(() => {
        // Remove local fetchUser as it is handled by AuthContext

        const fetchProblem = async () => {
            try {
                const { data } = await axios.get(`/api/coding/problem/${slug}`, { withCredentials: true });
                setProblem(data);

                // Set initial starter code
                const starter = data.starterCode.find(sc => sc.language === language);
                if (starter) {
                    setCode(starter.code);
                }

                // Fetch past submissions
                fetchSubmissions(data._id);
            } catch (error) {
                console.error("Error fetching problem:", error);
            } finally {
                setLoading(false);
            }
        };
        // fetchUser(); // Removed
        fetchProblem();
    }, [slug]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchSubmissions = async (problemId) => {
        try {
            const { data } = await axios.get(`/api/code/submissions/${problemId}`, { withCredentials: true });
            setSubmissions(data);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    const generateBoilerplate = (lang, funcName) => {
        switch (lang) {
            case 'java':
                return `class Solution {\n    public void ${funcName || 'solve'}() {\n        // Write your code here\n    }\n}`;
            case 'c':
                return `#include <stdio.h>\n\nvoid ${funcName || 'solve'}() {\n    // Write your code here\n}`;
            case 'cpp':
                return `#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void ${funcName || 'solve'}() {\n        // Write your code here\n    }\n};`;
            case 'python':
                return `class Solution:\n    def ${funcName || 'solve'}(self):\n        pass`;
            case 'javascript':
                return `var ${funcName || 'solve'} = function() {\n    // Write your code here\n};`;
            default:
                return '// Write your code here';
        }
    };

    // Update code when language changes
    useEffect(() => {
        if (problem) {
            const starter = problem.starterCode.find(sc => sc.language === language);
            if (starter) {
                setCode(starter.code);
            } else {
                const funcName = problem.driverCode?.functionName || problem.functionName;
                setCode(generateBoilerplate(language, funcName));
            }
        }
    }, [language, problem]);

    const handleRunCode = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setShowConsole(true);
        setConsoleTab('result');
        setTestResult({ status: 'Running...', output: '', error: '' });
        setSubmissionResult(null);

        try {
            const { data } = await axios.post('/api/code/run', {
                problemId: problem._id,
                language,
                code,
                testCaseIndex: selectedExampleIdx
            }, { withCredentials: true });

            setTestResult(data);
        } catch (error) {
            setTestResult({ status: 'Error', error: error.response?.data?.message || 'Execution failed' });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setShowConsole(true);
        setConsoleTab('result');
        setSubmissionResult({ status: 'Submitting...', verdict: 'Pending' });
        setTestResult(null);

        try {
            const { data } = await axios.post('/api/code/submit', {
                problemId: problem._id,
                language,
                code
            }, { withCredentials: true });

            // Mock beats data if not present
            const finalResult = {
                ...data,
                runtimeBeats: (Math.random() * 40 + 60).toFixed(1),
                memoryBeats: (Math.random() * 40 + 40).toFixed(1)
            };

            setSubmissionResult(finalResult);
            fetchSubmissions(problem._id); // Refresh submissions list
            if (finalResult.verdict === 'Accepted') {
                refreshUser();
            }
        } catch (error) {
            setSubmissionResult({ verdict: 'Error', message: error.response?.data?.message || 'Submission failed' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnlockEditorial = async () => {
        if (!user || !problem || isUnlocking) return;

        setIsUnlocking(true);
        try {
            const { data } = await axios.post('/api/gamification/unlock-editorial', {
                problemId: problem._id
            }, { withCredentials: true });

            // Refresh user to sync coins and unlocked editorials
            refreshUser();
            alert('Editorial Unlocked!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to unlock editorial');
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleAIHint = async () => {
        if (!problem || aiHintLoading) return;
        setAiHintLoading(true);
        setShowAIHint(true);
        try {
            const { data } = await axios.post('/api/ai/chat', {
                message: `Give me a hint for the coding problem: "${problem.title}". Description: ${problem.description}. Don't give the full code, just provide the logic/approach in 2-3 bullet points.`
            }, { withCredentials: true });
            setAiHint(data.response);
        } catch (error) {
            setAiHint("Failed to get hint. Please try again later.");
        } finally {
            setAiHintLoading(false);
        }
    };

    const highlightCode = (inputCode) => {
        if (!inputCode) return '';

        // Escape HTML
        let escaped = inputCode
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Tokenizer Regex
        const tokenRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\/.*$|\/\*[\s\S]*?\*\/)|([(){}\[\]])|(\b[a-zA-Z_]\w*(?=\s*\())|(\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|class|export|import|new|this|await|async|public|private|static|void|int|float|double|char|boolean|byte|short|long|interface|extends|implements|package|try|catch|finally|throw|using|namespace|typeof|instanceof|default|delete|in|of)\b)/gm;

        const isDark = editorTheme === 'dark';

        return escaped.replace(tokenRegex, (match, str, comment, bracket, func, keyword) => {
            if (str) return match;
            if (comment) return `<span class="text-gray-500 italic">${comment}</span>`;
            if (bracket) return `<span class="text-yellow-500 dark:text-yellow-400 font-bold">${bracket}</span>`;
            if (func) return `<span class="text-indigo-600 dark:text-sky-400 font-bold">${func}</span>`;
            if (keyword) return `<span class="text-sky-600 dark:text-sky-500 font-bold">${keyword}</span>`;
            return match;
        });
    };

    const handleScroll = () => {
        if (textareaRef.current) {
            if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
            if (highlighterRef.current) {
                highlighterRef.current.scrollTop = textareaRef.current.scrollTop;
                highlighterRef.current.scrollLeft = textareaRef.current.scrollLeft;
            }
        }
    };

    const getLineNumbers = () => {
        const lines = code.split('\n').length;
        return Array.from({ length: Math.max(lines, 20) }, (_, i) => i + 1).join('\n');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen pt-16 bg-white dark:bg-[#1a1a1a]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!problem) return null;

    return (
        <div className="h-screen bg-slate-50 dark:bg-[#0f1115] text-slate-700 dark:text-slate-300 flex flex-col font-sans overflow-hidden transition-colors duration-300">
            {/* Nav Header - Modern Glassmorphism */}
            <header className="h-14 flex items-center justify-between px-6 bg-white/70 dark:bg-[#1a1d24]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shrink-0 select-none shadow-sm z-50 sticky top-0">
                <div className="flex items-center gap-8">
                    <Link to="/coding" className="group flex items-center gap-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-all text-sm font-bold uppercase tracking-wider">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FiLayout className="text-indigo-500" />
                        </div>
                        <span className="hidden sm:inline">Problems</span>
                    </Link>
                    <div className="h-6 w-px bg-slate-200 dark:bg-white/10"></div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white group cursor-default">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${problem.difficulty?.toLowerCase() === 'easy' ? 'bg-emerald-500' : problem.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            {problem.title}
                        </div>
                        {/* Timer UI */}
                        <div className="flex items-center gap-3 mt-0.5">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-black font-mono text-slate-500 dark:text-slate-400">
                                <FiClock className={isTimerRunning ? "animate-spin-slow text-indigo-500" : ""} />
                                {formatTime(elapsedTime)}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                    className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-400"
                                    title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
                                >
                                    {isTimerRunning ? <span className="block w-2.5 h-2.5 bg-slate-400 rounded-sm"></span> : <FiPlay size={10} />}
                                </button>
                                <button
                                    onClick={() => setElapsedTime(0)}
                                    className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-400"
                                    title="Reset Timer"
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    {/* Action Buttons */}
                    <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-2xl p-1 border border-slate-200 dark:border-white/5 shadow-inner">
                        <button
                            onClick={handleRunCode}
                            disabled={isRunning || isSubmitting}
                            className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2.5 disabled:opacity-50 ${isRunning ? 'bg-slate-200 dark:bg-white/10 text-slate-600' : 'hover:bg-white dark:hover:bg-white/10 hover:shadow-sm text-slate-600 dark:text-slate-300'}`}
                        >
                            <FiPlay className={isRunning ? "animate-pulse" : ""} />
                            {isRunning ? 'Running' : 'Run'}
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isRunning || isSubmitting}
                            className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl transition-all flex items-center gap-2.5 disabled:opacity-50 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
                        >
                            {isSubmitting ? <div className="animate-spin h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full"></div> : <FiCheck strokeWidth={3} />}
                            Submit
                        </button>
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-white/10"></div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAIHint}
                            className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-sm group"
                            title="AI Hint ✨"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-tighter hidden lg:inline">AI Hint</span>
                                <span className="group-hover:rotate-12 transition-transform">✨</span>
                            </div>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 hover:bg-white dark:hover:bg-white/10 transition-all ${showSettings ? 'rotate-90 text-indigo-500 bg-white ring-2 ring-indigo-500/20' : ''}`}
                            >
                                <FiSettings />
                            </button>
                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-64 bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/10 p-5 rounded-3xl shadow-2xl z-[100] transition-colors"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                            <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Workspace Config</h4>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">Editor Theme</span>
                                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Color schema</span>
                                                </div>
                                                <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                                                    <button
                                                        onClick={() => setEditorTheme('light')}
                                                        className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${editorTheme === 'light' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        Light
                                                    </button>
                                                    <button
                                                        onClick={() => setEditorTheme('dark')}
                                                        className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${editorTheme === 'dark' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        Dark
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Split Layout */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left Side: Tabs Content */}
                <div className="w-[45%] flex flex-col border-r border-gray-200 dark:border-[#333] bg-white dark:bg-[#1a1a1a]">
                    <div className="h-11 bg-slate-100 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center px-3 gap-2 overflow-x-auto scrollbar-hide">
                        <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')} icon={<FiBarChart2 />} label="Description" />
                        <TabButton active={activeTab === 'editorial'} onClick={() => setActiveTab('editorial')} icon={<FiLayout />} label="Editorial" />
                        <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} icon={<FiClock />} label="History" />
                        <TabButton active={activeTab === 'discussion'} onClick={() => setActiveTab('discussion')} icon={<FiMessageSquare />} label="Discussion" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white dark:bg-[#1a1d24]/30 relative">
                        {/* AI Hint Floating Card */}
                        <AnimatePresence>
                            {showAIHint && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                    className="absolute bottom-6 left-6 right-6 p-6 bg-indigo-600 text-white rounded-3xl shadow-2xl z-40 overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><FiCpu size={120} /></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-bounce">✨</div>
                                                <h3 className="text-sm font-black uppercase tracking-widest">AI Genius Hint</h3>
                                            </div>
                                            <button onClick={() => setShowAIHint(false)} className="text-white/60 hover:text-white transition-colors">
                                                <FiMaximize2 className="rotate-45" />
                                            </button>
                                        </div>
                                        {aiHintLoading ? (
                                            <div className="flex items-center gap-3 py-2">
                                                <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
                                                <span className="text-xs font-bold animate-pulse">Consulting the AI...</span>
                                            </div>
                                        ) : (
                                            <div className="text-sm leading-relaxed font-medium">
                                                <ReactMarkdown>{aiHint}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {activeTab === 'description' && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                    {problem.dailyChallengeDate === new Date().toISOString().split('T')[0] && (
                                        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[30px] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><FiAward size={80} /></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">
                                                    🔥 Problem of the Day
                                                </div>
                                                <h3 className="text-lg font-black tracking-tight mb-2 uppercase">Daily Challenge Unlocked!</h3>
                                                <p className="text-xs font-bold text-indigo-100/80 mb-4 uppercase tracking-wider">Solve this problem today to earn <span className="text-yellow-400 font-black">30 Credits</span> instead of 10!</p>
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-yellow-400">
                                                    2X Rewards Active
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mb-8">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${problem.difficulty?.toLowerCase() === 'easy' ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' :
                                            problem.difficulty?.toLowerCase() === 'medium' ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20' :
                                                'text-red-500 bg-red-500/10 border border-red-500/20'}`}>
                                            {problem.difficulty}
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            <FiBarChart2 className="text-slate-300" /> 1.2k Submissions
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            <FiCheck className="text-emerald-500" /> 84% Success Rate
                                        </div>
                                    </div>

                                    <div className="prose dark:prose-invert prose-sm max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-loose prose-strong:text-slate-900 dark:prose-strong:text-white prose-headings:font-black">
                                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                                    </div>

                                    <div className="mt-12 space-y-8">
                                        {problem.examples.map((ex, idx) => (
                                            <div key={idx} className="group transition-all">
                                                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] text-indigo-500 group-hover:scale-110 transition-transform">0{idx + 1}</span>
                                                    Example Case
                                                </h4>
                                                <div className="relative overflow-hidden p-6 rounded-3xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 transition-all group-hover:border-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/5">
                                                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 group-hover:opacity-[0.06] transition-opacity"><FiLayout size={80} /></div>
                                                    <div className="relative z-10 font-mono text-xs space-y-4">
                                                        <div className="flex gap-4">
                                                            <span className="w-20 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px]">Input</span>
                                                            <span className="text-slate-900 dark:text-indigo-300 font-bold">{ex.input}</span>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <span className="w-20 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px]">Output</span>
                                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ex.output}</span>
                                                        </div>
                                                        {ex.explanation && (
                                                            <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex gap-4">
                                                                <span className="w-20 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px]">Review</span>
                                                                <span className="text-slate-500 dark:text-slate-400 italic leading-relaxed">{ex.explanation}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-16 mb-20 p-8 rounded-3xl bg-gradient-to-br from-slate-100 to-white dark:from-white/5 dark:to-transparent border border-slate-200 dark:border-white/5">
                                        <h3 className="text-xs font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                            <FiSettings className="text-indigo-500" /> Constraints
                                        </h3>
                                        <ul className="space-y-3">
                                            <ReactMarkdown components={{
                                                p: ({ node, ...props }) => <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400" {...props} />,
                                                li: ({ children }) => <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 shrink-0"></div><span>{children}</span></li>
                                            }}>{problem.constraints}</ReactMarkdown>
                                        </ul>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'editorial' && (
                                <div className="h-full">
                                    {!user?.unlockedEditorials?.includes(problem._id) ? (
                                        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 dark:bg-[#282828] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700/50 p-10 text-center animate-in fade-in zoom-in duration-500">
                                            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-yellow-500/5">
                                                <FiBarChart2 className="text-yellow-500 text-3xl" />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Unlock Editorial</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs leading-relaxed font-medium">Get access to the optimal solution and detailed explanation for this problem.</p>

                                            <button
                                                onClick={handleUnlockEditorial}
                                                disabled={isUnlocking}
                                                className="group relative px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                                            >
                                                {isUnlocking ? 'Unlocking...' : (
                                                    <span className="flex items-center gap-2">
                                                        Unlock for {problem.editorialCost || 50} Coins
                                                    </span>
                                                )}
                                            </button>

                                            <p className="mt-6 text-[11px] font-black text-gray-400 uppercase tracking-tighter">Your Balance: <span className="text-yellow-600 dark:text-yellow-500">{user?.coins || 0} Coins</span></p>
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="prose dark:prose-invert prose-sm max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-400"
                                        >
                                            <div className="flex items-center gap-2 mb-6 p-3 bg-green-500/5 rounded-2xl border border-green-500/10">
                                                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><FiCheck /></div>
                                                <span className="text-[11px] font-black uppercase text-green-600 dark:text-green-400 tracking-widest">Editorial Unlocked</span>
                                            </div>
                                            <ReactMarkdown>{problem.editorial || "No editorial content available yet."}</ReactMarkdown>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'submissions' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Submission History</h2>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">{submissions.length} Total</span>
                                    </div>
                                    <div className="space-y-4">
                                        {submissions.length > 0 ? submissions.map((sub) => (
                                            <div key={sub._id} className="group relative p-5 bg-slate-100/50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 transition-all hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><FiClock size={40} /></div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-widest uppercase ${sub.verdict === 'Accepted' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                                        {sub.verdict}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 dark:text-slate-400 transition-colors uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><FiClock className="text-indigo-500" /> {sub.runtime}ms</span>
                                                    <span className="flex items-center gap-1.5"><FiCpu className="text-emerald-500" /> {sub.language}</span>
                                                    <button 
                                                        onClick={() => setSelectedSubmission(sub)}
                                                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 flex items-center gap-1 hover:underline active:scale-95"
                                                    >
                                                        View <FiMaximize2 size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale leading-loose">
                                                <FiClock size={48} className="mb-4" />
                                                <p className="text-xs font-black uppercase tracking-widest">No previous runs</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'discussion' && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: 10 }}
                                    className="h-full"
                                >
                                    <CommentSection problemId={problem._id} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side: Editor & Console Split */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-colors ${editorTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                    {/* Editor Section */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className={`h-10 border-b flex items-center justify-between px-4 shrink-0 transition-colors ${editorTheme === 'dark' ? 'bg-[#282828] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-green-500 font-mono font-bold">&lt;/&gt;</span>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className={`bg-transparent border-none focus:ring-0 cursor-pointer p-0 text-xs font-bold uppercase tracking-wider transition-colors ${editorTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>
                            </div>
                            <div className={`flex items-center gap-4 transition-colors ${editorTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                <FiMaximize2 className="hover:text-blue-500 cursor-pointer transition-colors" />
                            </div>
                        </div>

                        <div className="flex-1 relative font-mono text-[13px] leading-[22px] flex overflow-hidden">
                            <div ref={lineNumbersRef} className={`w-12 text-right pr-3 pt-4 select-none overflow-hidden shrink-0 border-r transition-colors ${editorTheme === 'dark' ? 'bg-[#1e1e1e] border-[#2d2d2d] text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                <pre className="font-mono text-[11px] opacity-70 leading-[22px]">{getLineNumbers()}</pre>
                            </div>

                            {/* Editor Housing */}
                            <div className="flex-1 relative overflow-hidden">
                                {/* Highlighter Layer */}
                                <pre
                                    ref={highlighterRef}
                                    className={`absolute inset-0 p-4 m-0 pointer-events-none whitespace-pre font-mono text-[13px] leading-[22px] overflow-hidden transition-colors ${editorTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                    dangerouslySetInnerHTML={{ __html: highlightCode(code) + '\n' }}
                                />

                                {/* Input Layer */}
                                <textarea
                                    ref={textareaRef}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    onScroll={handleScroll}
                                    className={`absolute inset-0 w-full h-full bg-transparent caret-blue-500 resize-none focus:outline-none focus:ring-0 p-4 whitespace-pre overflow-auto scrollbar-thin custom-scrollbar selection:bg-blue-500/30 font-mono text-[13px] leading-[22px] transition-colors ${editorTheme === 'dark' ? 'text-transparent' : 'text-transparent'}`}
                                    spellCheck="false"
                                    style={{ tabSize: 4 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Console Section */}
                    {/* ... (rest of the console code) ... */}

                    {/* Console Section - Modern Redesign */}
                    <div className={`border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#1a1d24] flex flex-col overflow-hidden transition-all duration-500 ease-in-out shadow-2xl z-40 ${showConsole ? 'h-[40%]' : 'h-12'}`}>
                        <div className="h-12 px-6 flex items-center justify-between bg-slate-50 dark:bg-black/20 shrink-0 border-b border-slate-200 dark:border-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => { setShowConsole(true); setConsoleTab('testcase'); }}
                                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${showConsole && consoleTab === 'testcase' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                >
                                    <FiTerminal size={12} />
                                    Testcase
                                </button>
                                <button
                                    onClick={() => { setShowConsole(true); setConsoleTab('result'); }}
                                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${showConsole && consoleTab === 'result' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                >
                                    <FiCheck size={12} />
                                    Result
                                </button>
                            </div>
                            <button onClick={() => setShowConsole(!showConsole)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all group">
                                <FiChevronDown className={`text-slate-400 group-hover:text-indigo-500 transition-transform duration-500 ${!showConsole ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1a1a1a] relative transition-colors">
                            {consoleTab === 'testcase' ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        {problem.examples.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedExampleIdx(i)}
                                                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all shadow-sm border ${selectedExampleIdx === i
                                                    ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
                                                    : 'bg-gray-50 dark:bg-[#282828] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                    }`}
                                            >
                                                Case {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        <div>
                                            <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black mb-2 block">Standard Input</label>
                                            <div className="bg-gray-50 dark:bg-[#282828] p-4 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-800 dark:text-gray-200 transition-colors shadow-inner whitespace-pre-wrap">
                                                {problem.examples[selectedExampleIdx]?.input}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="font-mono text-[13px] h-full">
                                    {isSubmitting || isRunning ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                                            <div className="animate-spin h-10 w-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full"></div>
                                            <span className="text-xs font-bold tracking-widest uppercase animate-pulse transition-colors">{isRunning ? 'Executing Sandbox...' : 'Verifying Solution...'}</span>
                                        </div>
                                    ) : submissionResult ? (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className={`text-3xl font-black tracking-tighter ${submissionResult.verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                                                        {submissionResult.verdict}
                                                    </h2>
                                                    <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-widest">{submissionResult.passedTestcases} / {submissionResult.totalTestcases} testcases passed</p>
                                                </div>
                                                {submissionResult.verdict === 'Accepted' && (
                                                    <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                                        Perfect Solution
                                                    </div>
                                                )}
                                            </div>

                                            {submissionResult.verdict === 'Accepted' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                    <div className="bg-gray-50 dark:bg-[#282828] p-6 rounded-3xl border border-gray-200 dark:border-gray-700/50 shadow-sm transition-colors relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><FiClock size={40} /></div>
                                                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-tighter mb-4"><FiClock /> Execution Time</div>
                                                        <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{submissionResult.runtime}<span className="text-sm font-bold text-gray-400 ml-1">ms</span></div>
                                                        <div className="mt-2 text-xs text-gray-500 font-bold">Beats <span className="text-blue-500">{submissionResult.runtimeBeats}%</span> of users</div>
                                                        <PerformanceChart beats={submissionResult.runtimeBeats} theme={theme} />
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-[#282828] p-6 rounded-3xl border border-gray-200 dark:border-gray-700/50 shadow-sm transition-colors relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><FiCpu size={40} /></div>
                                                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-tighter mb-4"><FiCpu /> Memory Footprint</div>
                                                        <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{submissionResult.memory || '43.6'}<span className="text-sm font-bold text-gray-400 ml-1">MB</span></div>
                                                        <div className="mt-2 text-xs text-gray-500 font-bold">Beats <span className="text-purple-500">{submissionResult.memoryBeats}%</span> of users</div>
                                                        <PerformanceChart beats={submissionResult.memoryBeats} theme={theme} />
                                                    </div>
                                                </div>
                                            )}

                                            {submissionResult.verdict !== 'Accepted' && submissionResult.message && (
                                                <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20 text-red-500 text-sm font-medium italic shadow-sm">
                                                    {submissionResult.message}
                                                </div>
                                            )}
                                        </div>
                                    ) : testResult ? (
                                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 h-full">
                                            <div className="flex items-center justify-between">
                                                <div className={`flex items-center gap-3 text-xl font-black tracking-tighter uppercase px-4 py-1.5 rounded-2xl ${testResult.status === 'Accepted' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                                    {testResult.status === 'Accepted' ? <FiCheck strokeWidth={4} /> : <div className="w-4 h-4 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin"></div>}
                                                    {testResult.status}
                                                </div>
                                                <div className="flex gap-6 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-tighter">
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full"><FiClock className="text-indigo-500" /> {testResult.time || '0.00'}s</span>
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full"><FiCpu className="text-emerald-500" /> {testResult.memory || '12'}KB</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
                                                {testResult.output ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black"><FiTerminal /> Output Log</div>
                                                        <div className="bg-slate-50 dark:bg-black/30 p-5 rounded-3xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-indigo-200 shadow-inner max-h-[150px] overflow-auto custom-scrollbar leading-relaxed">
                                                            {testResult.output}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3 opacity-30">
                                                        <div className="text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px] font-black">No output generated</div>
                                                        <div className="h-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10"></div>
                                                    </div>
                                                )}

                                                {testResult.error && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-red-500 uppercase tracking-widest text-[10px] font-black"><FiCpu /> Execution Error</div>
                                                        <div className="bg-red-500/5 p-5 rounded-3xl border border-red-500/10 text-red-400 font-medium leading-relaxed italic">
                                                            {testResult.error}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 opacity-50">
                                            <FiTerminal className="text-5xl mb-4" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">Awaiting Code Execution...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Code Viewer Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSubmission(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-white/10"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-black/20">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedSubmission.verdict === 'Accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {selectedSubmission.verdict}
                                        </span>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Submission Details</h3>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-3 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-0 bg-[#1e1e1e] custom-scrollbar">
                                <div className="p-6 text-[13px] font-mono leading-relaxed text-slate-300 font-medium">
                                    <pre className="whitespace-pre-wrap">{selectedSubmission.code}</pre>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <FiClock className="text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{selectedSubmission.runtime}ms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCpu className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{selectedSubmission.language}</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        setCode(selectedSubmission.code);
                                        setLanguage(selectedSubmission.language);
                                        setSelectedSubmission(null);
                                    }}
                                    className="ml-auto px-6 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    Restore to Editor
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`px-5 h-8 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-full ${active
            ? 'text-indigo-600 dark:text-white bg-white dark:bg-white/10 shadow-sm ring-1 ring-slate-200 dark:ring-white/10'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
    >
        <span className={`text-base ${active ? 'text-indigo-500 animate-pulse' : 'text-slate-300 dark:text-slate-600'}`}>{icon}</span>
        {label}
    </button>
);

export default CodingProblemDetail;
