import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const Chatbot = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hi! I'm CrackIt AI. How can I help you prepare for your placement?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // HIDE on Login/Register pages
    if (['/login', '/register', '/'].includes(location.pathname)) {
        // Optional: also hide on landing page if preferred, but user said "except login and sign up". 
        // Let's hide on Landing too if it's purely for authenticated users, 
        // BUT user said "in all page... except login and sign up". Landing is usually public. 
        // I'll stick to hiding strictly on Login and Register as requested? 
        // Actually, usually landing page has its own call to action. Let's keep it there for "demo" feel, 
        // or remove. Let's strictly follow "except login and sign up".
    }

    // Strict exclusion
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Convert history to Standard format (Role: 'user' | 'assistant')
            // Filter out temporary/loading states or initial greetings if needed.
            // My previous filter removed idx 0 (greeting). Let's keep that logic but change format.
            const history = messages
                .filter((_, i) => i !== 0) // Remove the initial "Hi! I'm CrackIt AI" greeting
                .map(msg => ({
                    role: msg.role === 'model' ? 'assistant' : 'user', // Map 'model' -> 'assistant'
                    content: msg.text
                }));

            const { data } = await axios.post('http://localhost:5000/api/chat', {
                message: userMessage.text,
                history
            });

            setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-white">
                                <FaRobot className="text-xl" />
                                <span className="font-bold">Doubt Clearance Bot</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800/50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-sky-500 text-white rounded-tr-none'
                                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-600'
                                            }`}
                                    >
                                        {/* Simple markdown parsing could go here, for now raw text */}
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start mb-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-600">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Ask about DSA, Companies..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                <FaPaperPlane className="text-sm" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center group"
            >
                {isOpen ? <FaTimes className="text-xl" /> : <FaRobot className="text-2xl group-hover:rotate-12 transition-transform" />}
            </motion.button>
        </div>
    );
};

export default Chatbot;
