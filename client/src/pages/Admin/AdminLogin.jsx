import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const loggedInUser = await login(email, password);
            if (loggedInUser.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
            } else {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err || 'Failed to login. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] -ml-64 -mb-64"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black mb-6 shadow-xl shadow-indigo-500/20">
                        CA
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Administrator</h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sign in to manage platform</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold mb-8"
                    >
                        <FiAlertCircle className="flex-shrink-0" /> {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all font-bold"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white p-5 rounded-2xl font-black uppercase tracking-[2px] text-xs shadow-xl shadow-indigo-600/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-10"
                    >
                        {loading ? 'Authenticating...' : (
                            <>
                                Sign In <FiArrowRight />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-slate-600 text-[10px] uppercase font-black tracking-widest mt-12">
                    Secure Administrative Access Only
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
