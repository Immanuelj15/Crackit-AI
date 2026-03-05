import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiPlay, FiCheck, FiTerminal, FiLayout, FiMaximize2, FiSettings, FiClock, FiCpu, FiBarChart2 } from 'react-icons/fi';
import PerformanceChart from '../components/PerformanceChart';
import { useTheme } from '../context/ThemeContext';

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
    const [user, setUser] = useState(null);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [consoleTab, setConsoleTab] = useState('testcase'); // 'testcase' or 'result'
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);
    const highlighterRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get('/api/user/profile', { withCredentials: true });
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

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
        fetchUser();
        fetchProblem();
    }, [slug]);

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
                code
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

            // Update local user state
            setUser(prev => ({
                ...prev,
                coins: data.coins,
                unlockedEditorials: [...prev.unlockedEditorials, problem._id]
            }));

            alert('Editorial Unlocked!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to unlock editorial');
        } finally {
            setIsUnlocking(false);
        }
    };

    const highlightCode = (inputCode) => {
        if (!inputCode) return '';

        // Escape HTML
        let escaped = inputCode
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Tokenizer Regex: matches strings, comments, brackets, functions, or keywords in ONE pass
        // g1: Strings, g2: Comments, g3: Brackets, g4: Functions, g5: Keywords
        const tokenRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\/.*$|\/\*[\s\S]*?\*\/)|([(){}\[\]])|(\b[a-zA-Z_]\w*(?=\s*\())|(\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|class|export|import|new|this|await|async|public|private|static|void|int|float|double|char|boolean|byte|short|long|interface|extends|implements|package|try|catch|finally|throw|using|namespace|typeof|instanceof|default|delete|in|of)\b)/gm;

        return escaped.replace(tokenRegex, (match, str, comment, bracket, func, keyword) => {
            if (str) return match; // Keep strings white (base color)
            if (comment) return `<span class="text-gray-500 italic">${comment}</span>`;
            if (bracket) return `<span class="text-yellow-400 font-bold">${bracket}</span>`;
            if (func) return `<span class="text-sky-400 font-bold">${func}</span>`;
            if (keyword) return `<span class="text-sky-500 font-bold">${keyword}</span>`;
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
        <div className="h-screen bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 flex flex-col font-sans overflow-hidden transition-colors duration-300">
            {/* Nav Header */}
            <header className="h-12 flex items-center justify-between px-4 bg-gray-50 dark:bg-[#282828] border-b border-gray-200 dark:border-gray-700 shrink-0 select-none shadow-sm">
                <div className="flex items-center gap-6">
                    <Link to="/coding" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium">
                        <FiLayout className="text-blue-500" />
                        Problem List
                    </Link>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                        {problem.title}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-200 dark:bg-[#3c3c3c] rounded p-0.5">
                        <button
                            onClick={handleRunCode}
                            disabled={isRunning || isSubmitting}
                            className="px-3 py-1 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-[#4d4d4d] rounded transition-colors flex items-center gap-2 disabled:opacity-50 text-gray-700 dark:text-gray-200"
                        >
                            <FiPlay className="text-gray-500 dark:text-gray-400" />
                            Run
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isRunning || isSubmitting}
                            className="px-3 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-500 rounded transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? <div className="animate-spin h-3 w-3 border-2 border-white/20 border-t-white rounded-full"></div> : <FiCheck />}
                            Submit
                        </button>
                    </div>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <FiSettings className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors" />
                </div>
            </header>

            {/* Main Split Layout */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left Side: Tabs Content */}
                <div className="w-[45%] flex flex-col border-r border-gray-200 dark:border-[#333] bg-white dark:bg-[#1a1a1a]">
                    <div className="h-10 bg-gray-50 dark:bg-[#282828] border-b border-gray-200 dark:border-[#333] flex items-center px-2 gap-1 overflow-x-auto scrollbar-hide">
                        <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')} icon={<FiBarChart2 />} label="Description" />
                        <TabButton active={activeTab === 'editorial'} onClick={() => setActiveTab('editorial')} icon={<FiBarChart2 />} label="Editorial" />
                        <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} icon={<FiClock />} label="Submissions" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white dark:bg-[#1a1a1a]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'description' && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{problem.title}</h1>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${problem.difficulty?.toLowerCase() === 'easy' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/10' :
                                            problem.difficulty?.toLowerCase() === 'medium' ? 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-500/10' :
                                                'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10'}`}>
                                            {problem.difficulty}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <FiBarChart2 /> 1.2k Submissions
                                        </div>
                                    </div>
                                    <div className="prose dark:prose-invert prose-sm max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
                                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                                    </div>
                                    <div className="mt-8 space-y-6">
                                        {problem.examples.map((ex, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white italic">Example {idx + 1}:</h4>
                                                <div className="bg-gray-50 dark:bg-[#282828] border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 font-mono text-xs leading-relaxed transition-colors">
                                                    <div><span className="text-gray-500 dark:text-gray-400 font-bold uppercase transition-colors">Input:</span> <span className="text-gray-900 dark:text-gray-200 transition-colors">{ex.input}</span></div>
                                                    <div><span className="text-gray-500 dark:text-gray-400 font-bold uppercase transition-colors">Output:</span> <span className="text-gray-900 dark:text-gray-200 transition-colors">{ex.output}</span></div>
                                                    {ex.explanation && <div><span className="text-gray-500 dark:text-gray-400 font-bold uppercase transition-colors">Explanation:</span> <span className="text-gray-500 dark:text-gray-400 transition-colors">{ex.explanation}</span></div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-10 mb-10 pb-10 border-t border-gray-100 dark:border-gray-800 pt-8">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest">Constraints:</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                            <ReactMarkdown components={{ p: ({ node, ...props }) => <li {...props} /> }}>{problem.constraints}</ReactMarkdown>
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
                                <div className="space-y-4">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Submission History</h2>
                                    {submissions.length > 0 ? submissions.map((sub) => (
                                        <div key={sub._id} className="p-4 bg-gray-50 dark:bg-[#282828] rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:border-blue-500/50 hover:shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`font-bold text-sm ${sub.verdict === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>{sub.verdict}</span>
                                                <span className="text-[10px] text-gray-500 font-medium">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1"><FiCpu /> {sub.runtime}ms</span>
                                                <span className="flex items-center gap-1 uppercase font-bold text-gray-400">{sub.language}</span>
                                            </div>
                                        </div>
                                    )) : <p className="text-center py-20 text-gray-400 italic text-sm">No submissions found for this account.</p>}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side: Editor & Console Split */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
                    {/* Editor Section */}
                    <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
                        <div className="h-10 bg-[#282828] border-b border-[#333] flex items-center justify-between px-4 shrink-0 transition-colors">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-green-500 font-mono font-bold">&lt;/&gt;</span>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-transparent border-none text-gray-300 focus:ring-0 cursor-pointer p-0 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400">
                                <FiMaximize2 className="hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>

                        <div className="flex-1 relative font-mono text-[13px] leading-[22px] flex overflow-hidden">
                            <div ref={lineNumbersRef} className="bg-[#1e1e1e] w-12 text-gray-600 text-right pr-3 pt-4 select-none overflow-hidden shrink-0 border-r border-[#2d2d2d] transition-colors">
                                <pre className="font-mono text-[11px] opacity-70 leading-[22px]">{getLineNumbers()}</pre>
                            </div>

                            {/* Editor Housing */}
                            <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
                                {/* Highlighter Layer */}
                                <pre
                                    ref={highlighterRef}
                                    className="absolute inset-0 p-4 m-0 pointer-events-none whitespace-pre font-mono text-[13px] leading-[22px] text-white overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: highlightCode(code) + '\n' }}
                                />

                                {/* Input Layer */}
                                <textarea
                                    ref={textareaRef}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    onScroll={handleScroll}
                                    className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white resize-none focus:outline-none focus:ring-0 p-4 whitespace-pre overflow-auto scrollbar-thin custom-scrollbar selection:bg-blue-500/30 font-mono text-[13px] leading-[22px]"
                                    spellCheck="false"
                                    style={{ tabSize: 4 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Console Section */}
                    {/* ... (rest of the console code) ... */}

                    {/* Console Section */}
                    <div className={`border-t border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282828] flex flex-col overflow-hidden transition-all duration-300 ${showConsole ? 'h-[40%]' : 'h-10'}`}>
                        <div className="h-10 px-4 flex items-center justify-between bg-gray-100 dark:bg-[#2d2d2d] shrink-0 border-b border-gray-200 dark:border-[#333] transition-colors">
                            <div className="flex items-center gap-4">
                                <button onClick={() => { setShowConsole(true); setConsoleTab('testcase'); }} className={`text-[11px] font-black uppercase tracking-wider pb-1 transition-all border-b-2 ${showConsole && consoleTab === 'testcase' ? 'text-gray-900 dark:text-white border-blue-500' : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'}`}>
                                    Testcase
                                </button>
                                <button onClick={() => { setShowConsole(true); setConsoleTab('result'); }} className={`text-[11px] font-black uppercase tracking-wider pb-1 transition-all border-b-2 ${showConsole && consoleTab === 'result' ? 'text-gray-900 dark:text-white border-blue-500' : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'}`}>
                                    Test Result
                                </button>
                            </div>
                            <button onClick={() => setShowConsole(!showConsole)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors group">
                                <FiChevronDown className={`text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-transform duration-300 ${!showConsole ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1a1a1a] relative transition-colors">
                            {consoleTab === 'testcase' ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        {problem.examples.map((_, i) => (
                                            <button key={i} className="px-4 py-1.5 bg-gray-50 dark:bg-[#282828] rounded-lg text-[11px] font-bold border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-500/50 hover:text-blue-500 transition-all shadow-sm">Case {i + 1}</button>
                                        ))}
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        <div>
                                            <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black mb-2 block">Standard Input</label>
                                            <div className="bg-gray-50 dark:bg-[#282828] p-4 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-800 dark:text-gray-200 transition-colors shadow-inner">{problem.examples[0].input}</div>
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
                                        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                                            <div className={`text-xl font-black tracking-tighter uppercase ${testResult.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>{testResult.status}</div>
                                            <div className="space-y-5 font-mono text-xs">
                                                {testResult.output && (
                                                    <div>
                                                        <div className="text-gray-400 dark:text-gray-500 mb-2 font-bold uppercase tracking-widest text-[10px]">Stdout</div>
                                                        <div className="bg-gray-50 dark:bg-[#282828] p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-inner">{testResult.output}</div>
                                                    </div>
                                                )}
                                                {testResult.error && (
                                                    <div>
                                                        <div className="text-red-500/40 mb-2 font-bold uppercase tracking-widest text-[10px]">Runtime Error</div>
                                                        <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 text-red-400 font-medium">{testResult.error}</div>
                                                    </div>
                                                )}
                                                <div className="flex gap-8 text-gray-400 dark:text-gray-500 text-[10px] pt-6 uppercase font-black tracking-tighter">
                                                    <span className="flex items-center gap-1.5"><FiClock /> TIME: {testResult.time}s</span>
                                                    <span className="flex items-center gap-1.5"><FiCpu /> MEMORY: {testResult.memory}KB</span>
                                                </div>
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
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`px-4 h-full flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 hover:bg-gray-100 dark:hover:bg-[#333] ${active ? 'text-gray-900 dark:text-white border-blue-500 bg-gray-100 dark:bg-[#333]' : 'text-gray-400 dark:text-gray-600 border-transparent'}`}
    >
        <span className={active ? 'text-blue-500 scale-110' : 'text-gray-400 dark:text-gray-700'}>{icon}</span>
        {label}
    </button>
);

export default CodingProblemDetail;
