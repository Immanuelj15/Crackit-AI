import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const CodingProblemDetail = () => {
    const { slug } = useParams();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('java');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [showConsole, setShowConsole] = useState(false);
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const { data } = await axios.get(`/api/coding/problem/${slug}`, { withCredentials: true });
                setProblem(data);

                // Set initial starter code
                const starter = data.starterCode.find(sc => sc.language === language);
                if (starter) {
                    setCode(starter.code);
                }
            } catch (error) {
                console.error("Error fetching problem:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [slug]);

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
                // Generate boilerplate if specific starter code is missing
                // Use functionName from problem if available, or a default
                const funcName = problem.driverCode?.functionName || problem.functionName; // Fallback to root level functionName if driverCode structure differs
                setCode(generateBoilerplate(language, funcName));
            }
        }
    }, [language, problem]);

    const handleRunCode = () => {
        // Mock run functionality
        setOutput('Running tests...\n\nTest Case 1: Passed\nTest Case 2: Passed\nTest Case 3: Passed\n\nAll public test cases passed!');
    };

    const handleSubmit = () => {
        // Mock submit functionality
        setOutput('Submitting...\n\nAccepted! Runtime: 56ms, Memory: 42.1MB');
    };

    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case 'hard': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            default: return 'text-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen pt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex flex-col items-center justify-center h-screen pt-16 px-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Problem Not Found</h2>
                <Link to="/coding" className="text-emerald-500 hover:text-emerald-600 font-medium">
                    Back to Coding Practice
                </Link>
            </div>
        );
    }




    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const getLineNumbers = () => {
        const lines = code.split('\n').length;
        return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    };

    return (
        <div className="min-h-screen pt-16 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-300 flex flex-col font-sans h-screen overflow-hidden transition-colors duration-300">
            {/* Header */}
            <header className="h-12 flex items-center justify-between px-4 bg-white dark:bg-[#282828] border-b border-gray-200 dark:border-gray-700 shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        to={`/coding/${problem.pattern}`}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Problem List
                    </Link>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRunCode}
                        className="px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-500 rounded transition-colors flex items-center gap-2 shadow-sm"
                    >
                        Submit
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0 bg-gray-50 dark:bg-[#1a1a1a]">

                {/* Left Panel: Description */}
                <div className="w-[45%] flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a]">
                    <div className="h-10 bg-[#f7f7f7] dark:bg-[#282828] border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-6">
                        <button className="text-xs font-medium text-gray-900 dark:text-gray-200 flex items-center gap-2 border-b-2 border-transparent hover:border-blue-500 h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                            </svg>
                            Description
                        </button>
                        <button className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 h-full flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Editorial
                        </button>
                        <button className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 h-full flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Submissions
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar bg-white dark:bg-[#1a1a1a]">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{problem.title}</h1>
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${problem.difficulty?.toLowerCase() === 'easy' ? 'text-emerald-500 bg-emerald-500/10' :
                                problem.difficulty?.toLowerCase() === 'medium' ? 'text-yellow-500 bg-yellow-500/10' :
                                    'text-red-500 bg-red-500/10'
                                }`}>
                                {problem.difficulty}
                            </span>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800">
                            <ReactMarkdown>{problem.description}</ReactMarkdown>
                        </div>

                        {/* Examples */}
                        <div className="mt-8 space-y-6">
                            {problem.examples.map((ex, idx) => (
                                <div key={idx}>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Example {idx + 1}:</h4>
                                    <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 border-l-4 border-gray-300 dark:border-gray-600 font-mono text-xs">
                                        <p className="mb-1"><span className="font-bold text-gray-700 dark:text-gray-400">Input:</span> <span className="text-gray-800 dark:text-gray-300">{ex.input}</span></p>
                                        <p className="mb-1"><span className="font-bold text-gray-700 dark:text-gray-400">Output:</span> <span className="text-gray-800 dark:text-gray-300">{ex.output}</span></p>
                                        <p><span className="font-bold text-gray-700 dark:text-gray-400">Explanation:</span> <span className="text-gray-600 dark:text-gray-400">{ex.explanation}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Constraints */}
                        <div className="mt-8 mb-8">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-3">Constraints:</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                <ReactMarkdown components={{
                                    p: ({ node, ...props }) => <li {...props} />
                                }}>{problem.constraints}</ReactMarkdown>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code Editor */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
                    {/* Editor Header */}
                    <div className="h-10 bg-[#1e1e1e] border-b border-gray-700 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="text-green-500 font-mono text-xs">&lt;/&gt;</span>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-transparent border-none text-gray-300 focus:ring-0 cursor-pointer p-0 text-xs font-medium hover:text-white"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="c">C</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="text-gray-400 hover:text-white p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            <button className="text-gray-400 hover:text-white p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 relative font-mono text-[13px] leading-6 flex">
                        {/* Line Numbers */}
                        <div
                            ref={lineNumbersRef}
                            className="bg-[#1e1e1e] w-12 text-gray-600 text-right pr-3 pt-4 select-none overflow-hidden border-r border-[#282828] shrink-0"
                            style={{ fontFamily: '"Menlo", "Consolas", monospace' }}
                        >
                            <pre>{getLineNumbers()}</pre>
                        </div>

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onScroll={handleScroll}
                            className="flex-1 bg-[#1e1e1e] text-gray-300 resize-none focus:outline-none focus:ring-0 p-4 pt-4 pl-4 whitespace-pre overflow-auto custom-scrollbar"
                            spellCheck="false"
                            style={{ fontFamily: '"Menlo", "Consolas", monospace' }}
                        />
                    </div>

                    {/* Collapsible Console */}
                    <div className={`border-t border-gray-700 bg-[#1e1e1e] flex flex-col transition-all duration-300 ${showConsole ? 'h-[40%]' : 'h-10'}`}>
                        <button
                            onClick={() => setShowConsole(!showConsole)}
                            className="h-10 px-4 flex items-center justify-between text-gray-400 hover:text-gray-200 bg-[#252526] w-full"
                        >
                            <span className="flex items-center gap-2 text-xs font-semibold">
                                Console
                                {showConsole ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                )}
                            </span>
                        </button>

                        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-gray-300 bg-[#1e1e1e]">
                            {output ? (
                                <div className="whitespace-pre-wrap">
                                    {output.includes("Error") ?
                                        <span className="text-red-400">{output}</span> :
                                        <span className="text-emerald-400">{output}</span>
                                    }
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                    <span className="text-xs">Run your code to see output</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingProblemDetail;
