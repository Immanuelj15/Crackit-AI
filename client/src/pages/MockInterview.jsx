import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUploadCloud,
    FiCpu,
    FiUser,
    FiMessageSquare,
    FiSend,
    FiCheckCircle,
    FiAlertCircle,
    FiRefreshCw,
    FiFileText,
    FiX,
    FiMic,
    FiMicOff,
    FiVolume2,
    FiVolumeX,
    FiTrendingUp,
    FiCheck
} from 'react-icons/fi';

const MockInterview = () => {
    const { user } = useAuth();
    const [mode, setMode] = useState('select'); // select, upload, analysis, interview, result
    const [topic, setTopic] = useState('technical');
    const [resumeText, setResumeText] = useState('');
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const { data } = await axios.post('/api/ai/analyze-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            setResumeText(data.text);
            setResumeAnalysis(data.analysis);
            setMode('analysis');
        } catch (error) {
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (isVoiceMode) startListening();
        };
        window.speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setAnswer(transcript);
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const fetchQuestion = async (manualResumeText = null) => {
        setLoading(true);
        setFeedback(null);
        setAnswer('');
        try {
            const { data } = await axios.post('/api/ai/generate', {
                topic,
                resumeText: manualResumeText || resumeText,
                company: 'Top Tech',
                difficulty: 'medium'
            }, { withCredentials: true });
            setQuestion(data.question);
            setMode('interview');
            if (isVoiceMode) {
                speak(data.question);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const submitAnswer = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        try {
            const { data } = await axios.post('/api/ai/evaluate', {
                question,
                answer,
                topic
            }, { withCredentials: true });
            setFeedback(data);
            setMode('result');
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const resetInterview = () => {
        setMode('select');
        setQuestion('');
        setAnswer('');
        setFeedback(null);
        setResumeText('');
        setResumeAnalysis(null);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 py-12 px-4 flex items-center justify-center transition-colors duration-300">
            <div className="max-w-4xl w-full">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <FiCpu className="animate-pulse" /> AI Interview Simulator
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Ace Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500 underline decoration-indigo-500/30">Big Interview</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg font-light">
                        Experience a realistic interview powered by expert AI models. Tailored to your resume or chosen topics.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {/* MODE SELECTION */}
                    {mode === 'select' && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <button
                                onClick={() => setMode('upload')}
                                className="group p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all text-left relative overflow-hidden shadow-sm hover:shadow-xl"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <FiFileText size={120} />
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                    <FiUploadCloud size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Resume Mode</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    Upload your resume and get questions specifically tailored to your experience and project stack.
                                </p>
                            </button>

                            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-6">
                                        <FiMessageSquare size={28} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Topic Mode</h3>
                                    <div className="space-y-4">
                                        <select
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-sky-500/50 transition-colors"
                                        >
                                            <option value="technical">Technical General</option>
                                            <option value="coding">Coding & DS/Algo</option>
                                            <option value="behavioral">HR & Behavioral</option>
                                            <option value="system_design">System Design</option>
                                        </select>

                                        <div
                                            onClick={() => setIsVoiceMode(!isVoiceMode)}
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${isVoiceMode ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isVoiceMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-700 text-slate-400'}`}>
                                                    {isVoiceMode ? <FiMic /> : <FiMicOff />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">Voice Mode</div>
                                                    <div className="text-[10px] opacity-60 uppercase font-black tracking-tighter">AI will talk to you</div>
                                                </div>
                                            </div>
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${isVoiceMode ? 'bg-indigo-500' : 'bg-slate-600'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isVoiceMode ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => fetchQuestion()}
                                    className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-sky-500/20"
                                >
                                    Start Practice
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* RESUME UPLOAD */}
                    {mode === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed p-12 rounded-3xl text-center relative shadow-xl"
                        >
                            <button onClick={() => setMode('select')} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors">
                                <FiX size={24} />
                            </button>
                            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto mb-6">
                                <FiUploadCloud size={40} className={isUploading ? "animate-bounce" : ""} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Upload Your CV / Resume</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                We'll analyze your resume to generate questions that match your actual profile. (PDF only, max 10MB)
                            </p>

                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept=".pdf"
                                onChange={handleResumeUpload}
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/20"
                            >
                                {isUploading ? "Analyzing..." : "Choose File"}
                            </button>
                        </motion.div>
                    )}

                    {/* RESUME ANALYSIS RESULTS */}
                    {mode === 'analysis' && resumeAnalysis && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl"
                        >
                            <h2 className="text-2xl font-black text-white mb-6">AI Profile Insights</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                    <h4 className="text-xs font-bold text-sky-400 uppercase mb-3 flex items-center gap-2">
                                        <FiCheckCircle /> Found Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeAnalysis.skills?.map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-sky-500/10 text-sky-400 rounded-full text-[10px]">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                    <h4 className="text-xs font-bold text-red-400 uppercase mb-3 flex items-center gap-2">
                                        <FiAlertCircle /> Skill Gaps
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeAnalysis.missingSkills?.map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-[10px]">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
                                <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3 flex items-center gap-2">
                                    <FiTrendingUp /> Career Improvement Plan
                                </h4>
                                <ul className="space-y-2">
                                    {resumeAnalysis.improvementSuggestions?.map((s, i) => (
                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                            <span className="text-indigo-500 mt-1">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => fetchQuestion()}
                                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Proceed to Interview
                                </button>
                                <button
                                    onClick={() => setMode('upload')}
                                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                                >
                                    Re-upload
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* INTERVIEW STAGE */}
                    {mode === 'interview' && (
                        <motion.div
                            key="interview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${isSpeaking ? 'bg-indigo-500 shadow-xl shadow-indigo-500/50 scale-110' : 'bg-slate-800'}`}>
                                        {isSpeaking && (
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="absolute inset-0 bg-indigo-500 rounded-full"
                                            />
                                        )}
                                        <FiCpu size={24} className="text-white relative z-10" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900 dark:text-white block">AI Interviewer</span>
                                        {isSpeaking && <span className="text-[10px] text-indigo-500 font-black uppercase animate-pulse">Speaking...</span>}
                                    </div>
                                </div>
                                <button onClick={resetInterview} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">Quit Session</button>
                            </div>

                            <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl">
                                <div className="text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-4">Question</div>
                                <h2 className="text-xl md:text-2xl font-medium text-slate-800 dark:text-white leading-relaxed mb-8">
                                    {loading ? (
                                        <span className="flex items-center gap-4 text-slate-500 italic">
                                            Generating your question... <FiRefreshCw className="animate-spin" />
                                        </span>
                                    ) : question}
                                </h2>

                                <div className="relative">
                                    <div className="absolute top-4 left-4 text-emerald-500/50">
                                        <FiUser size={18} />
                                    </div>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 pl-12 text-slate-900 dark:text-slate-200 outline-none focus:border-emerald-500/40 transition-all min-h-[200px] resize-none leading-relaxed"
                                        placeholder="Speak your mind... take your time to structure the answer."
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <div className="flex items-center gap-4">
                                        {isVoiceMode && (
                                            <button
                                                onClick={isListening ? stopListening : startListening}
                                                className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${isListening ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                                            >
                                                {isListening ? (
                                                    <>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3].map(i => (
                                                                <motion.div
                                                                    key={i}
                                                                    animate={{ height: [8, 16, 8] }}
                                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                                    className="w-1 bg-white rounded-full"
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-bold">Listening...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiMic />
                                                        <span className="text-xs font-bold">Unmute Mic</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {isVoiceMode && question && (
                                            <button
                                                onClick={() => speak(question)}
                                                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-500 transition-colors"
                                                title="Re-play Question"
                                            >
                                                <FiVolume2 />
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            stopListening();
                                            submitAnswer();
                                        }}
                                        disabled={loading || !answer.trim()}
                                        className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-2xl font-black transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95"
                                    >
                                        {loading ? "Evaluating..." : "Submit Answer"}
                                        <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* RESULT STAGE */}
                    {mode === 'result' && feedback && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 -mr-20 -mt-20 ${feedback.score >= 7 ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>

                            <div className="text-center mb-10">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">Interview Performance</div>
                                <div className="relative inline-block">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                        <circle
                                            cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray={364.4}
                                            strokeDashoffset={364.4 - (364.4 * feedback.score) / 10}
                                            className={`${feedback.score >= 7 ? 'text-emerald-500' : 'text-yellow-500'} transition-all duration-1000 ease-out`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{feedback.score}</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">/ 10</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                                        <FiCheckCircle /> Overall Feedback
                                    </h4>
                                    <p className="text-slate-300 leading-relaxed font-light">{feedback.feedback}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => fetchQuestion()}
                                        className="py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiRefreshCw /> Next Question
                                    </button>
                                    <button
                                        onClick={resetInterview}
                                        className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        End Session
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default MockInterview;
